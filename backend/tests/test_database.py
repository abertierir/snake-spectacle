from database import mock_db

def test_database_structure():
    assert "users" in mock_db
    assert "users_by_email" in mock_db
    assert "leaderboard" in mock_db
    assert "live_players" in mock_db
    
    assert isinstance(mock_db["users"], dict)
    assert isinstance(mock_db["users_by_email"], dict)
    assert isinstance(mock_db["leaderboard"], list)
    assert isinstance(mock_db["live_players"], dict)
