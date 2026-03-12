from models import User, GameMode, Position, Direction
import uuid

def test_user_creation():
    user_id = uuid.uuid4()
    user = User(id=user_id, username="test", email="test@example.com")
    assert user.id == user_id
    assert user.username == "test"
    assert user.email == "test@example.com"

def test_enums():
    assert GameMode.walls == "walls"
    assert GameMode.pass_through == "pass-through"
    assert Direction.UP == "UP"

def test_position():
    pos = Position(x=10, y=20)
    assert pos.x == 10
    assert pos.y == 20
