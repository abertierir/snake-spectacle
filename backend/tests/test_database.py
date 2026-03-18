from database import mock_db

def test_database_structure():
    assert "live_players" in mock_db
    assert isinstance(mock_db["live_players"], dict)
