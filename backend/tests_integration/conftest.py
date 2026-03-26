import pytest
import os
import tempfile
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database import Base, get_db, mock_db
from main import app

# For true integration testing where we want a physical database file
db_fd, temp_db_file = tempfile.mkstemp(suffix=".db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{temp_db_file}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_integration_db():
    # Setup the physical test DB before any integration tests run
    Base.metadata.create_all(bind=engine)
    yield
    # Teardown the DB after all integration tests are done
    Base.metadata.drop_all(bind=engine)
    os.close(db_fd)
    os.remove(temp_db_file)


@pytest.fixture(scope="function")
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Optionally clean up data between tests
        for table in reversed(Base.metadata.sorted_tables):
            db.execute(table.delete())
        db.commit()


@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    
    # Also clean up any mock state just in case
    mock_db["live_players"].clear()
    
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
