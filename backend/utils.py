import re
import io
from PyPDF2 import PdfReader
from docx import Document

def clean_text(text: str) -> str:
    """
    Strip HTML tags, URLs, special characters, normalize whitespace.
    (Same as before.)
    """
    # 1. Remove HTML tags
    text = re.sub(r'<[^>]*?>', '', text)
    # 2. Remove URLs
    text = re.sub(
        r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+',
        '',
        text
    )
    # 3. Remove special characters (keep alphanumeric + spaces)
    text = re.sub(r'[^a-zA-Z0-9 ]', '', text)
    # 4. Collapse multiple spaces
    text = re.sub(r'\s{2,}', ' ', text)
    # 5. Trim whitespace
    return text.strip()


def extract_text_from_file(filename: str, raw_bytes: bytes) -> str:
    """
    Given an uploaded file (with its filename), return its plain‐text contents.
    Supports:
      - PDF (.pdf): uses PyPDF2.PdfReader
      - DOCX (.docx): uses python-docx
      - TXT  (.txt): decode as UTF-8
    Raises ValueError if the format isn’t recognized or no text can be extracted.
    """
    lower_fname = filename.lower()

    # -----------------------------
    # 1) PDF extraction
    # -----------------------------
    if lower_fname.endswith(".pdf"):
        try:
            # Use an in‐memory BytesIO
            reader = PdfReader(io.BytesIO(raw_bytes))
            full_text = []
            for page in reader.pages:
                txt = page.extract_text() or ""
                full_text.append(txt)
            return "\n".join(full_text).strip()
        except Exception as e:
            raise ValueError(f"PDF parsing error: {e}")

    # -----------------------------
    # 2) DOCX extraction
    # -----------------------------
    if lower_fname.endswith(".docx"):
        try:
            with io.BytesIO(raw_bytes) as mem_stream:
                doc = Document(mem_stream)
                full_text = []
                for para in doc.paragraphs:
                    if para.text:
                        full_text.append(para.text)
            return "\n".join(full_text).strip()
        except Exception as e:
            raise ValueError(f"DOCX parsing error: {e}")

    # -----------------------------
    # 3) Plain‐text (.txt)
    # -----------------------------
    if lower_fname.endswith(".txt"):
        try:
            return raw_bytes.decode("utf-8", errors="ignore").strip()
        except Exception as e:
            raise ValueError(f"TXT decoding error: {e}")

    # -----------------------------
    # Unsupported format
    # -----------------------------
    raise ValueError("Unsupported file type. Please upload a .pdf, .docx, or .txt resume.")
