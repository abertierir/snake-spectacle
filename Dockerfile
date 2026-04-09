# Stage 1: Build the React frontend using Vite
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
RUN npm run build

# Stage 2: Build the FastAPI backend and serve everything
FROM python:3.12-slim AS backend
WORKDIR /app

# Install uv for fast dependency resolution
RUN pip install uv

# Copy backend dependency files
COPY backend/pyproject.toml backend/uv.lock ./

# Install python dependencies using uv
RUN uv sync --frozen

# Copy backend source code including tests/db if needed
COPY backend ./backend

# Copy the built frontend dist from Stage 1 into the expected location
# We place it inside backend/dist so main.py can easily reference it relative to its location
COPY --from=frontend-builder /app/frontend/dist /app/backend/dist

WORKDIR /app/backend

# Expose port
EXPOSE 8000

# Run the backend which will now also serve static assets
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
