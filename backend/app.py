import os
from io import BytesIO
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader
import google.generativeai as genai
from fastapi import Response
import uvicorn

# ------------------------------------------------------------------------------
# Load environment & configure Gemini API
# ------------------------------------------------------------------------------

load_dotenv()  # expects GOOGLE_API_KEY in your .env
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise RuntimeError("GOOGLE_API_KEY not set in environment")
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

# ------------------------------------------------------------------------------
# FastAPI setup
# ------------------------------------------------------------------------------

app = FastAPI(title="Resume Checker API")
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

@app.get("/", include_in_schema=False)
async def health_check():
    return {"status": "ok", "service": "Resume Checker API"}

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
    response = model.generate_content([pdf_text, prompt])
    return {"result": response.text}

# ------------------------------------------------------------------------------
# Run server: python app.py
# ------------------------------------------------------------------------------

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port)
