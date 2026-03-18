from fastapi import FastAPI, HTTPException, Query, Depends
from typing import List, Optional
import uuid
from datetime import date
from sqlalchemy.orm import Session

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
