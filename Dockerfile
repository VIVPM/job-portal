# 1. Base image
FROM python:3.10-slim

# 2. Working directory in container
WORKDIR /app

# 3. Copy & install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy your FastAPI code _and_ JobPortal.js
COPY backend/ .

# 5. Expose port (optional, for documentation)
EXPOSE 8000

# 6. Launch Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
