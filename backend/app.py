import os
from io import BytesIO
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader
from langchain_google_genai import GoogleGenerativeAI
from fastapi import Response
import uvicorn
from typing import List
from pathlib import Path

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from langchain_community.document_loaders import WebBaseLoader

from chains import Chain
from utils import clean_text, extract_text_from_file
from resume_parser import ResumeParser

JOBPORTAL_PATH = Path(__file__).parent / "JobPortal.js"

# ------------------------------------------------------------------------------
# Load environment & configure Gemini API
# ------------------------------------------------------------------------------

load_dotenv()  # expects GOOGLE_API_KEY in your .env
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise RuntimeError("GOOGLE_API_KEY not set in environment")
model = GoogleGenerativeAI(model="gemini-2.0-flash",temperature=0.6)

# ------------------------------------------------------------------------------
# FastAPI setup
# ------------------------------------------------------------------------------

app = FastAPI(title="Backend Python API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","https://job-portal-internship.onrender.com"],  # your React origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------------------
# Helper functions
# ------------------------------------------------------------------------------

def read_pdf_bytes(data: bytes) -> str:
    """
    Extract text from PDF file bytes using an in-memory buffer.
    """
    buffer = BytesIO(data)           # wrap raw bytes in a file-like object
    reader = PdfReader(buffer)
    text_parts = []
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text_parts.append(page_text)
    return "\n".join(text_parts)

def build_prompt(pdf_text: str, job_description: str, analysis_type: str) -> str:
    """
    Construct the Gemini prompt based on the chosen analysis_type.
    """
    jd_section = f"\nJob description:\n{job_description}\n" if job_description else ""
    if analysis_type == "quick":
        return f"""
You are ResumeChecker, an expert in resume analysis. Provide a quick scan of the following resume:
1. Identify the most suitable profession for this resume.
2. List 3 key strengths of the resume.
3. Suggest 2 quick improvements.
4. Give an overall ATS score out of 100.

Resume text:
{pdf_text}
{jd_section}
"""
    elif analysis_type == "detailed":
        return f"""
You are ResumeChecker, an expert in resume analysis. Provide a detailed analysis of the following resume:
1. Identify the most suitable profession for this resume.
2. List 5 strengths of the resume.
3. Suggest 3-5 areas for improvement with specific recommendations.
4. Rate the following aspects out of 10: Impact, Brevity, Style, Structure, Skills.
5. Provide a brief review of each major section (e.g., Summary, Experience, Education).
6. Give an overall ATS score out of 100 with a breakdown of the scoring.

Resume text:
{pdf_text}
{jd_section}
"""
    elif analysis_type == "ats":
        return f"""
You are ResumeChecker, an expert in ATS optimization. Analyze the following resume and provide optimization suggestions:
1. Identify keywords from the job description that should be included in the resume.
2. Suggest reformatting or restructuring to improve ATS readability.
3. Recommend changes to improve keyword density without keyword stuffing.
4. Provide 3-5 bullet points on how to tailor this resume for the specific job description.
5. Give an ATS compatibility score out of 100 and explain how to improve it.

Resume text:
{pdf_text}
Job description:
{job_description}
"""
    else:
        raise ValueError(f"Invalid analysis_type '{analysis_type}'. Use 'quick', 'detailed', or 'ats'.")

# ------------------------------------------------------------------------------
# API endpoint
# ------------------------------------------------------------------------------

@app.head("/", include_in_schema=False)
async def head_root():
    return Response(status_code=200)

@app.get("/")
def read_root():
    return {"message": "Conversation logger API up and running"}



@app.post("/api/resume-checker")
async def resume_checker(
    file: UploadFile = File(...),
    job_description: str = Form(""),
    analysis_type: str = Form("quick")
):
    # Validate file type
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    contents = await file.read()
    if len(contents) > 200 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large; max 200 MB")

    # Use BytesIO to give PdfReader a seekable buffer
    pdf_text = read_pdf_bytes(contents)

    prompt = build_prompt(pdf_text, job_description, analysis_type)
    response = model(prompt)
    return {"result":response}

class ConversationItem(BaseModel):
    role: str   # "user" or "model"
    text: str

@app.get("/api/jobportal")
def get_jobportal():
    try:
        return {"jobPortal": JOBPORTAL_PATH.read_text(encoding="utf-8")}
    except Exception as e:
        raise HTTPException(500, str(e))

@app.post("/api/conversation")
def append_conversation(item: ConversationItem):
    """
    Appends a line into the JS template literal in JobPortal.js.
    """
    try:
        content = JOBPORTAL_PATH.read_text(encoding="utf-8")
        # Find the closing backtick of the template literal
        parts = content.rsplit("`;", 1)
        if len(parts) != 2:
            raise ValueError("Unable to find the template literal boundary.")
        body, tail = parts
        # Append new line(s)
        new_line = f"\n\n// {item.role} @ {item.role.upper()}:\n{item.text}"
        updated = body + new_line + "`;" + tail
        JOBPORTAL_PATH.write_text(updated, encoding="utf-8")
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(500, str(e))


# -----------------------------
# “Cold‐Email Generator” Endpoint
# -----------------------------

# Instantiate Chain + ResumeParser (both use GROQ_API_KEY internally)
chain = Chain()               # from chains.py
resume_parser = ResumeParser()  # from resume_parser.py


class GeneratedEmail(BaseModel):
    role: str
    email: str


@app.post("/api/generate-emails", response_model=List[GeneratedEmail])
async def generate_emails(
    job_url: str = Form(...),
    resume_file: UploadFile = File(...)
):
    """
    1. Accept `job_url` (string) + `resume_file` (PDF, DOCX, or TXT).
    2. Extract text from the resume file.
    3. Scrape & clean the page at `job_url`.
    4. `chain.extract_jobs(...)` via Groq → structured job postings.
    5. `resume_parser.parse_resume(...)` via Groq → {skills, experience}.
    6. For each job posting, intersect job.skills & resume.skills, then `chain.write_mail_with_resume(...)` to draft an email.
    7. Return a JSON array of `{ role, email }`.
    """
    # 1. Extract text from the uploaded resume file
    try:
        raw_bytes = await resume_file.read()
        resume_text = extract_text_from_file(resume_file.filename, raw_bytes)
        if not resume_text.strip():
            raise ValueError("No text found in resume.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract text from resume: {e}")

    # 2. Scrape & clean the job listing page
    try:
        loader = WebBaseLoader([job_url])
        raw_doc = loader.load().pop().page_content
        page_text = clean_text(raw_doc)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch or clean job URL: {e}")

    # 3. Extract structured job postings (Groq)
    try:
        jobs = chain.extract_jobs(page_text)
        if not jobs or not isinstance(jobs, list):
            raise ValueError("No valid job postings returned.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Job extraction failed: {e}")

    # 4. Parse resume into { skills, experience } (Groq)
    try:
        resume_data = resume_parser.parse_resume(resume_text)
        if not resume_data.get("skills") and not resume_data.get("experience"):
            raise ValueError("Parsed resume returned empty content.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Resume parsing failed: {e}")

    # 5. For each job, find overlapping skills & generate a cold email
    out_emails = []
    for job in jobs:
        try:
            job_skills = job.get("skills", [])
            resume_skills = resume_data.get("skills", [])
            matching_skills = list(set(job_skills) & set(resume_skills))

            email_body = chain.write_mail_with_resume(
                job_description=job,
                resume_details=resume_data,
                matching_skills=matching_skills
            )
            out_emails.append(GeneratedEmail(role=job.get("role", "Unknown Role"), email=email_body))
        except Exception:
            # Skip any job that fails
            continue

    if not out_emails:
        raise HTTPException(status_code=400, detail="No emails could be generated.")

    return out_emails

# ------------------------------------------------------------------------------
# Run server: python app.py
# ------------------------------------------------------------------------------

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port)
