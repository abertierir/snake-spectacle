from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import uuid

from schemas import (
    User as UserSchema, LoginRequest, SignupRequest, AuthResponse
)
from models import User as UserModel
from database import get_db

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=AuthResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.email == request.email).first()
    if not db_user:
        return AuthResponse(error="Invalid email or password")
    
    if db_user.hashed_password != request.password:
        return AuthResponse(error="Invalid email or password")
    
    user_schema = UserSchema(id=uuid.UUID(db_user.id), username=db_user.username, email=db_user.email)
    return AuthResponse(user=user_schema)

@router.post("/signup", response_model=AuthResponse)
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.email == request.email).first()
    if db_user:
        return AuthResponse(error="Email already exists")
    
    new_user = UserModel(
        username=request.username,
        email=request.email,
        hashed_password=request.password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    user_schema = UserSchema(id=uuid.UUID(new_user.id), username=new_user.username, email=new_user.email)
    return AuthResponse(user=user_schema)

@router.post("/logout")
def logout():
    return {"message": "Successful logout"}

@router.get("/me", response_model=UserSchema)
def get_me():
    # Since we have no actual auth/session, we'll return a 401
    raise HTTPException(status_code=401, detail="Not authenticated")
