# Game Backend Server

This is the FastAPI backend for the game project.

## Requirements
* Python 3.12+
* `uv` package manager

## How to run the server

1. Open a terminal and navigate to the backend directory:
```bash
cd backend
```

2. Run the server using `uvrun` and `uvicorn`:
```bash
uv run uvicorn main:app --reload
```

The server will automatically start on `http://127.0.0.1:8000`. 
Due to the `--reload` flag, the server will watch for any file changes and automatically restart itself!

You can view the auto-generated interactive API documentation at:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`
