from fastapi import FastAPI, HTTPException, Query, Depends
from typing import List, Optional
import uuid
from datetime import date
from sqlalchemy.orm import Session
from pathlib import Path
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from schemas import (
    GameMode, LeaderboardEntry as LeaderboardEntrySchema, LivePlayer, SubmitScorePayload
)
from models import User as UserModel, LeaderboardEntry as LeaderboardEntryModel
from database import mock_db, get_db
from auth import router as auth_router

app = FastAPI(title="Snake Spectacle API", version="1.0.0")

app.include_router(auth_router)

@app.get("/api/leaderboard", response_model=List[LeaderboardEntrySchema])
def get_leaderboard(mode: Optional[GameMode] = Query(None), db: Session = Depends(get_db)):
    query = db.query(LeaderboardEntryModel).order_by(LeaderboardEntryModel.score.desc())
    if mode:
        query = query.filter(LeaderboardEntryModel.mode == mode)
    entries = query.all()
    
    result = []
    for entry in entries:
        result.append(LeaderboardEntrySchema(
            id=uuid.UUID(entry.id),
            userId=entry.userId,
            username=entry.username,
            score=entry.score,
            mode=entry.mode,
            date=entry.date
        ))
    return result

@app.post("/api/leaderboard", response_model=LeaderboardEntrySchema, status_code=201)
def submit_score(payload: SubmitScorePayload, db: Session = Depends(get_db)):
    # Find user
    db_user = db.query(UserModel).filter(UserModel.id == payload.userId).first()
    username = db_user.username if db_user else "Unknown User"
    
    new_entry = LeaderboardEntryModel(
        userId=payload.userId,
        username=username,
        score=payload.score,
        mode=payload.mode,
        date=date.today()
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    
    return LeaderboardEntrySchema(
        id=uuid.UUID(new_entry.id),
        userId=new_entry.userId,
        username=new_entry.username,
        score=new_entry.score,
        mode=new_entry.mode,
        date=new_entry.date
    )

@app.get("/api/live/players", response_model=List[LivePlayer])
def get_live_players():
    return list(mock_db["live_players"].values())

@app.get("/api/live/players/{id}", response_model=LivePlayer)
def get_live_player(id: str):
    if id not in mock_db["live_players"]:
        raise HTTPException(status_code=404, detail="Player not found")
    return mock_db["live_players"][id]

frontend_dist = Path(__file__).parent / "dist"

if (frontend_dist / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")

@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="API route not found")
        
    file_path = frontend_dist / full_path
    if file_path.is_file():
        return FileResponse(file_path)
    
    index_path = frontend_dist / "index.html"
    if index_path.is_file():
        return FileResponse(index_path)
        
    return FileResponse(index_path) if index_path.exists() else {"error": "Frontend build not found", "status_code": 404}
