import uuid
from sqlalchemy import Column, String, Integer, Date, Enum as SQLEnum
from sqlalchemy.orm import declarative_base

from schemas import GameMode

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = 'users'
    id = Column(String, primary_key=True, default=generate_uuid)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class LeaderboardEntry(Base):
    __tablename__ = 'leaderboard'
    id = Column(String, primary_key=True, default=generate_uuid)
    userId = Column(String, index=True, nullable=False)
    username = Column(String, nullable=False)
    score = Column(Integer, index=True, nullable=False)
    mode = Column(SQLEnum(GameMode), nullable=True)
    date = Column(Date, nullable=False)
