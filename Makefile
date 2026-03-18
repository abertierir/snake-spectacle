.PHONY: install install-backend install-frontend run run-backend run-frontend test

# Install all dependencies
install: install-backend install-frontend

# Install backend dependencies
install-backend:
	cd backend && uv sync

# Install frontend dependencies
install-frontend:
	cd frontend && npm install

# Run both backend and frontend development servers concurrently
run:
	@echo "Starting backend and frontend..."
	npx concurrently -k -c "blue.bold,green.bold" -n "BACKEND,FRONTEND" "make run-backend" "make run-frontend"

# Run the backend development server
run-backend:
	cd backend && uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run the frontend development server
run-frontend:
	cd frontend && npm run dev

# Run backend tests
test:
	cd backend && uv run pytest
