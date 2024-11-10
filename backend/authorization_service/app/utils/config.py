import os

from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from dotenv import load_dotenv

load_dotenv()
base_path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load RSA key
with open(f"{base_path}/private_key.pem", "rb") as f:
    private_key = serialization.load_pem_private_key(
        f.read(),
        password=None,
        backend=default_backend()
    )
with open(f"{base_path}/public_key.pem", "rb") as f:
    public_key = serialization.load_pem_public_key(
        f.read(),
        backend=default_backend()
    )


class Config:
    SECRET_KEY = private_key or os.getenv("JWT_SECRET_KEY", "default_secret_key")
    PUBLIC_KEY = public_key or os.getenv("JWT_PUBLIC_KEY", "default_public_key")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 5))
    REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))
    REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")
    DATABASE_URL = "postgresql+psycopg2://{username}:{password}@{host}:{port}/{db_name}".format(
        host=os.getenv("POSTGRES_HOST", "localhost"),
        port=os.getenv("POSTGRES_PORT", 5432),
        db_name=os.getenv("POSTGRES_DATABASE", "postgres"),
        username=os.getenv("POSTGRES_USER", "postgres"),
        password=os.getenv("POSTGRES_PASSWORD", "postgres"),
    )
    GRACE_PERIOD_SECONDS = os.getenv("GRACE_PERIOD_SECONDS", 10)  # Set a grace period for token expiry checks

config = Config()
