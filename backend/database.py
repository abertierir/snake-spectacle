import uuid
from datetime import date
from models import User, LeaderboardEntry, GameMode

# Mock Database
mock_db = {
    "users": {}, # id -> User
    "users_by_email": {}, # email -> {password, user}
    "leaderboard": [], # List[LeaderboardEntry]
    "live_players": {} # id -> LivePlayer
}

# Add some fake mocked users
user1_id = uuid.uuid4()
user2_id = uuid.uuid4()
user3_id = uuid.uuid4()

user1 = User(id=user1_id, username="snake_master", email="snake@example.com")
user2 = User(id=user2_id, username="gamer_pro", email="gamer@example.com")
user3 = User(id=user3_id, username="noob_guy", email="noob@example.com")

for u in [user1, user2, user3]:
    mock_db["users"][str(u.id)] = u
    mock_db["users_by_email"][u.email] = {"password": "password123", "user": u}

# Add some fake leaderboard entries
mock_db["leaderboard"].extend([
    LeaderboardEntry(id=uuid.uuid4(), userId=str(user1_id), username=user1.username, score=1500, mode=GameMode.walls, date=date.today()),
    LeaderboardEntry(id=uuid.uuid4(), userId=str(user2_id), username=user2.username, score=1200, mode=GameMode.pass_through, date=date.today()),
    LeaderboardEntry(id=uuid.uuid4(), userId=str(user3_id), username=user3.username, score=300, mode=GameMode.walls, date=date.today()),
    LeaderboardEntry(id=uuid.uuid4(), userId=str(user1_id), username=user1.username, score=2500, mode=GameMode.pass_through, date=date.today()),
])
