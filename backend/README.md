# Game Backend Server

This is the FastAPI backend for the game project.

## Requirements
* Python 3.12+
* `uv` package manager

## Database Setup
The backend is built with SQLAlchemy and supports both SQLite (default) and PostgreSQL.

### Option 1: SQLite (Default)
By default, the backend will automatically create a local `sql_app.db` file in the `backend` directory. No additional setup is required.

### Option 2: PostgreSQL
For a more robust development setup or production, you can use PostgreSQL. We provide a `docker-compose.yml` in the root directory to easily spin up a local instance.

1. Navigate to the root folder (where `docker-compose.yml` is) and start the database:
```bash
docker compose up -d
```
2. When running the server, provide the `DATABASE_URL` environment variable.

## How to run the server

1. Open a terminal and navigate to the backend directory:
```bash
cd backend
```

2. Run the server using `uv run uvicorn`:

**With default SQLite:**
```bash
uv run uvicorn main:app --reload
```

**With local PostgreSQL (Docker):**
```bash
DATABASE_URL="postgresql+psycopg://postgres:postgrespassword@localhost:5432/snakedb" uv run uvicorn main:app --reload
```

The server will automatically start on `http://127.0.0.1:8000`. 
Due to the `--reload` flag, the server will watch for any file changes and automatically restart itself!

You can view the auto-generated interactive API documentation at:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`
