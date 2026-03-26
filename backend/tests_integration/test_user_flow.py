from fastapi.testclient import TestClient

def test_user_signup_and_leaderboard_flow(client: TestClient):
    # 1. Sign up a new user
    signup_data = {
        "username": "integration_user",
        "email": "integration@example.com",
        "password": "securepassword123"
    }
    signup_response = client.post("/api/auth/signup", json=signup_data)
    assert signup_response.status_code == 200
    
    user_info = signup_response.json().get("user")
    assert user_info is not None
    assert user_info["username"] == "integration_user"
    user_id = user_info["id"]

    # 2. Login as the new user
    login_data = {
        "email": "integration@example.com",
        "password": "securepassword123"
    }
    login_response = client.post("/api/auth/login", json=login_data)
    assert login_response.status_code == 200
    assert login_response.json().get("user")["id"] == user_id

    # 3. Submit a new score to the leaderboard
    score_data = {
        "userId": user_id,
        "score": 420,
        "mode": "walls"
    }
    score_response = client.post("/api/leaderboard", json=score_data)
    assert score_response.status_code == 201
    score_entry = score_response.json()
    assert score_entry["username"] == "integration_user"
    assert score_entry["score"] == 420
    assert score_entry["mode"] == "walls"

    # 4. Fetch the leaderboard and ensure the score is there
    leaderboard_response = client.get("/api/leaderboard?mode=walls")
    assert leaderboard_response.status_code == 200
    entries = leaderboard_response.json()
    assert len(entries) > 0
    
    # Find our entry
    our_entry = next((e for e in entries if e["userId"] == user_id), None)
    assert our_entry is not None
    assert our_entry["score"] == 420

    # 5. Logout
    logout_response = client.post("/api/auth/logout")
    assert logout_response.status_code == 200
