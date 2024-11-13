from datetime import datetime, timedelta
from os import path

import jwt
import redis

if __package__ is None or __package__ == '':
    import sys

    sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

    from backend.authorization_service.app.utils.config import config
    from backend.authorization_service.app.utils.crypt_operations.encryption import encrypt_jwt
    from backend.authorization_service.app.utils.token_operations.blacklist_token import blacklist_token
else:
    from ...utils.config import config
    from ...utils.crypt_operations.encryption import encrypt_jwt
    from .blacklist_token import blacklist_token

# Initialize Redis
redis_client = redis.StrictRedis.from_url(config.REDIS_URL)


def create_refresh_token(data: dict, user_agent: str, ip_address: str):
    expire = datetime.utcnow() + timedelta(days=config.REFRESH_TOKEN_EXPIRE_DAYS)
    data.update({
        "exp": expire,
        "type": "refresh",
        "user_agent": user_agent,
        "ip_address": ip_address
    })
    encoded_jwt = jwt.encode(payload=data, key=config.SECRET_KEY, algorithm="RS256")
    encrypted_jwt = encrypt_jwt(encoded_jwt=encoded_jwt, should_use_aes=True)
    # Store refresh token in Redis for rotation and validation
    redis_client.setex(f"refresh_token:{data['sub']}", config.REFRESH_TOKEN_EXPIRE_DAYS * 86400, encrypted_jwt)
    return encrypted_jwt

def rotate_refresh_token(old_token: str, username: str, user_agent: str, ip_address: str):
    """Rotate refresh tokens by blacklisting the old token and issuing a new one."""
    blacklist_token(token=old_token)
    data = {"sub": username}
    new_refresh_token = create_refresh_token(data=data, user_agent=user_agent, ip_address=ip_address)
    return new_refresh_token