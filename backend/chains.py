import os
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException
from dotenv import load_dotenv

load_dotenv()

class Chain:
    def __init__(self):
        # Initialize ChatGroq with deterministic temperature
        self.llm = ChatGroq(
            temperature=0,
            groq_api_key=os.getenv("GROQ_API_KEY"),
            model_name="llama-3.1-8b-instant"
        )

    def extract_jobs(self, cleaned_text: str):
        """
        Prompts the LLM to parse the cleaned page text into a JSON array of job postings.
        Each element must have: role, experience, skills (list), description.
        """
        prompt_extract = PromptTemplate.from_template(
            """
            ### SCRAPED PAGE TEXT:
            {page_data}

            ### INSTRUCTION:
            The above text comes from a job/careers page. Extract every job posting and return a valid JSON array,
            where each object has these keys:
              - "role"        (string)
              - "experience"  (string)
              - "skills"      (array of strings)
              - "description" (string)

            Only output the raw JSON array. No extra commentary.
            ### JSON OUTPUT:
            """
        )
        chain_extract = prompt_extract | self.llm
        res = chain_extract.invoke(input={"page_data": cleaned_text})

        try:
            parsed = JsonOutputParser().parse(res.content)
        except OutputParserException:
            raise OutputParserException("Failed to parse job postings JSON.")
        return parsed if isinstance(parsed, list) else [parsed]

    def write_mail_with_resume(self, job_description: dict, resume_details: dict, matching_skills: list):
        """
        Given:
         - job_description: { "role", "experience", "skills", "description" }
         - resume_details:  { "skills": [...], "experience": "..." }
         - matching_skills: the intersection of job.skills & resume.skills
        Prompt the LLM to produce a cold‐email that highlights only those overlapping skills + the summary.
        """
        prompt_email = PromptTemplate.from_template(
            """
            ### JOB DATA:
            Role: {role}
            Required Experience: {job_exp}
            Required Skills: {job_skills}
            Full Description: {job_desc}

            ### RESUME DATA:
            All skills on my resume: {resume_skills}
            My overall experience: {resume_exp}

            ### MATCHING SKILLS:
            {matching_skills}

            ### INSTRUCTION:
            Your job is to write a cold email to the client regarding the job mentioned above describing the my capability 
            in fulfilling their needs.
            Explain why I’m a fit for the above Role (mention only the items in "MATCHING SKILLS" + my summarized experience).
            Use natural, confident language.
            Do not provide a preamble.
            ### EMAIL (NO PREAMBLE):
            """
        )
        chain_email = prompt_email | self.llm

        inputs = {
            "role": job_description.get("role", ""),
            "job_exp": job_description.get("experience", ""),
            "job_skills": ", ".join(job_description.get("skills", [])),
            "job_desc": job_description.get("description", ""),
            "resume_skills": ", ".join(resume_details.get("skills", [])),
            "resume_exp": resume_details.get("experience", ""),
            "matching_skills": ", ".join(matching_skills) if matching_skills else "None"
        }

        res = chain_email.invoke(inputs)
        return res.content
