from fastapi import APIRouter, HTTPException
import uuid

from models import (
    User, LoginRequest, SignupRequest, AuthResponse
)
from database import mock_db

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=AuthResponse)
def login(request: LoginRequest):
    if request.email not in mock_db["users_by_email"]:
        return AuthResponse(error="Invalid email or password")
    
    password = mock_db["users_by_email"][request.email]["password"]
    if password != request.password:
        return AuthResponse(error="Invalid email or password")
    
    user = mock_db["users_by_email"][request.email]["user"]
    return AuthResponse(user=user)

@router.post("/signup", response_model=AuthResponse)
def signup(request: SignupRequest):
    if request.email in mock_db["users_by_email"]:
        return AuthResponse(error="Email already exists")
    
    user_id = uuid.uuid4()
    user = User(id=user_id, username=request.username, email=request.email)
    
    mock_db["users"][str(user_id)] = user
    mock_db["users_by_email"][request.email] = {
        "password": request.password,
        "user": user
    }
    
    return AuthResponse(user=user)

@router.post("/logout")
def logout():
    return {"message": "Successful logout"}

@router.get("/me", response_model=User)
def get_me():
    # Since we have no actual auth/session, we'll return a 401
    raise HTTPException(status_code=401, detail="Not authenticated")
