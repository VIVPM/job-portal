import os
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException
from dotenv import load_dotenv

load_dotenv()

class ResumeParser:
    def __init__(self):
        self.llm = ChatGroq(
            temperature=0,
            groq_api_key=os.getenv("GROQ_API_KEY"),
            model_name="llama-3.1-8b-instant"
        )

    def parse_resume(self, resume_text: str) -> dict:
        """
        Prompts the LLM to produce a JSON object with:
          - "skills": [ ... ]     (array of all technical skills)
          - "experience": "..."    (a 1–2 sentence summary of my professional experience)
        """
        prompt = PromptTemplate.from_template(
            """
            ### RESUME TEXT:
            {text}

            ### INSTRUCTION:
            Extract a JSON object with exactly:
              - "skills":   an array of all relevant technical skills/keywords (e.g., "Python", "FastAPI", "PostgreSQL")
              - "experience": a concise summary of my overall professional experience (1–2 sentences)

            Only output the raw JSON. No additional explanation.
            ### JSON OUTPUT:
            """
        )
        chain = prompt | self.llm
        res = chain.invoke(input={"text": resume_text})

        try:
            parsed = JsonOutputParser().parse(res.content)
        except OutputParserException:
            raise OutputParserException("Failed to parse resume JSON.")
        return parsed
