from fastapi import FastAPI, HTTPException, Query
from typing import List, Optional
import uuid
from datetime import date

from models import (
    GameMode, LeaderboardEntry, LivePlayer, SubmitScorePayload
)
from database import mock_db
from auth import router as auth_router

app = FastAPI(title="Snake Spectacle API", version="1.0.0")

app.include_router(auth_router)

@app.get("/api/leaderboard", response_model=List[LeaderboardEntry])
def get_leaderboard(mode: Optional[GameMode] = Query(None)):
    if mode:
        return [entry for entry in mock_db["leaderboard"] if entry.mode == mode]
    return mock_db["leaderboard"]

@app.post("/api/leaderboard", response_model=LeaderboardEntry, status_code=201)
def submit_score(payload: SubmitScorePayload):
    # Find user
    user = mock_db["users"].get(payload.userId)
    username = user.username if user else "Unknown User"
    
    entry = LeaderboardEntry(
        id=uuid.uuid4(),
        userId=payload.userId,
        username=username,
        score=payload.score,
        mode=payload.mode,
        date=date.today()
    )
    mock_db["leaderboard"].append(entry)
    # sort descending by score
    mock_db["leaderboard"] = sorted(mock_db["leaderboard"], key=lambda k: k.score, reverse=True)
    return entry

@app.get("/api/live/players", response_model=List[LivePlayer])
def get_live_players():
    return list(mock_db["live_players"].values())

@app.get("/api/live/players/{id}", response_model=LivePlayer)
def get_live_player(id: str):
    if id not in mock_db["live_players"]:
        raise HTTPException(status_code=404, detail="Player not found")
    return mock_db["live_players"][id]
