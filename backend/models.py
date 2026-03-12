from pydantic import BaseModel, EmailStr
from typing import List, Optional
from enum import Enum
import uuid
from datetime import date

# Defined GameMode enum
class GameMode(str, Enum):
    pass_through = "pass-through"
    walls = "walls"

# Defined Direction enum
class Direction(str, Enum):
    UP = "UP"
    DOWN = "DOWN"
    LEFT = "LEFT"
    RIGHT = "RIGHT"

# Defined Position
class Position(BaseModel):
    x: int
    y: int

# Defined User
class User(BaseModel):
    id: uuid.UUID
    username: str
    email: EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignupRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

# Defined AuthResponse
class AuthResponse(BaseModel):
    user: Optional[User] = None
    error: Optional[str] = None

# Defined LeaderboardEntry
class LeaderboardEntry(BaseModel):
    id: uuid.UUID
    userId: str
    username: str
    score: int
    mode: Optional[GameMode] = None
    date: date

# Defined LivePlayer
class LivePlayer(BaseModel):
    id: uuid.UUID
    username: str
    mode: GameMode
    score: int
    snake: List[Position]
    food: Position
    direction: Direction
    isAlive: bool

# Defined SubmitScorePayload
class SubmitScorePayload(BaseModel):
    userId: str
    score: int
    mode: GameMode
