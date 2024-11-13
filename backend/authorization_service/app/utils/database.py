from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

if __package__ is None or __package__ == '':
    import sys
    from os import path

    sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

    from backend.authorization_service.app.utils.config import config
else:
    from .config import config

# SQLAlchemy database URL
DATABASE_URL = config.DATABASE_URL

# Create the SQLAlchemy engine
engine = create_engine(url=DATABASE_URL, echo=True, echo_pool="debug")

# SessionLocal is a factory for creating new sessions with the database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Dependency function
def get_db():
    db = SessionLocal()  # Create a new session
    try:
        yield db  # Provide the session to the request
    finally:
        db.close()  # Ensure session is closed after request completion
