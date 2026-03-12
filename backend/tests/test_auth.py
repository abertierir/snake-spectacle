import pytest
from fastapi.testclient import TestClient
from main import app
from database import mock_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def reset_db():
    mock_db["users"].clear()
    mock_db["users_by_email"].clear()
    mock_db["leaderboard"].clear()
    mock_db["live_players"].clear()
    yield

def test_signup_and_login():
    # Test Signup
    res = client.post("/api/auth/signup", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    })
    assert res.status_code == 200
    data = res.json()
    assert "user" in data
    assert data["user"]["username"] == "testuser"
    assert data["user"]["email"] == "test@example.com"
    
    # Test Duplicate Signup
    res2 = client.post("/api/auth/signup", json={
        "username": "testuser2",
        "email": "test@example.com",
        "password": "password1234"
    })
    assert res2.status_code == 200
    assert res2.json()["error"] == "Email already exists"

    # Test Login
    res3 = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert res3.status_code == 200
    assert res3.json()["user"]["email"] == "test@example.com"
    
    # Test invalid login
    res4 = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "wrong"
    })
    assert res4.status_code == 200
    assert res4.json()["error"] == "Invalid email or password"

def test_logout_and_me():
    res = client.post("/api/auth/logout")
    assert res.status_code == 200
    
    res_me = client.get("/api/auth/me")
    assert res_me.status_code == 401
    assert res_me.json()["detail"] == "Not authenticated"
