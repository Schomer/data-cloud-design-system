# Stage 1: Build the React frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend

# Copy frontend source
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Python backend and serve
FROM python:3.13-slim
WORKDIR /app

# Copy backend requirements
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ .

# Copy the built Vite static files to the backend's dist directory
COPY --from=frontend-builder /app/frontend/dist /app/dist

# Copy generated_skills for skill-based app generation
COPY generated_skills/ /app/../generated_skills/

# Ensure generated_apps dir exists
RUN mkdir -p /app/../frontend/src/generated_apps

# Expose port 8080 required by Cloud Run
EXPOSE 8080

# Start Uvicorn bound to 0.0.0.0 and port 8080
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
