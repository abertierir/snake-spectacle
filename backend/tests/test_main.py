import pytest
import uuid
from database import mock_db
from models import User

def test_leaderboard(client, db_session):
    user_id = str(uuid.uuid4())
    # create a user directly in the test database
    new_user = User(id=user_id, username='test_user', email='a@b.com', hashed_password='password')
    db_session.add(new_user)
    db_session.commit()
    
    # Submit score
    res = client.post("/api/leaderboard", json={
        "userId": user_id,
        "score": 100,
        "mode": "walls"
    })
    assert res.status_code == 201
    assert res.json()["score"] == 100
    
    # Get leaderboard
    res2 = client.get("/api/leaderboard")
    assert res2.status_code == 200
    assert len(res2.json()) == 1
    assert res2.json()[0]["score"] == 100
    
    # Get leaderboard with mode
    res3 = client.get("/api/leaderboard?mode=pass-through")
    assert res3.status_code == 200
    assert len(res3.json()) == 0
    
def test_live_players(client):
    player_id = str(uuid.uuid4())
    mock_db["live_players"][player_id] = {
        "id": player_id,
        "username": "player1",
        "mode": "pass-through",
        "score": 10,
        "snake": [{"x": 0, "y": 0}],
        "food": {"x": 5, "y": 5},
        "direction": "UP",
        "isAlive": True
    }
    
    # Get all live players
    res = client.get("/api/live/players")
    assert res.status_code == 200
    assert len(res.json()) == 1
    assert res.json()[0]["id"] == player_id
    
    # Get specific player
    res2 = client.get(f"/api/live/players/{player_id}")
    assert res2.status_code == 200
    assert res2.json()["id"] == player_id
    
    # Get non-existent player
    res3 = client.get(f"/api/live/players/{uuid.uuid4()}")
    assert res3.status_code == 404
