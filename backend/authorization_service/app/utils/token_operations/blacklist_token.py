from datetime import datetime
from os import path

import jwt
import redis

if __package__ is None or __package__ == '':
    import sys

    sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

    from backend.authorization_service.app.utils.config import config
    from backend.authorization_service.app.utils.crypt_operations.decryption import decrypt_jwt
else:
    from ...utils.config import config
    from ...utils.crypt_operations.decryption import decrypt_jwt

# Initialize Redis
redis_client = redis.StrictRedis.from_url(config.REDIS_URL)


def blacklist_token(token: str):
    """Adds the token to the Redis blacklist with its expiration time."""
    decrypted_token = decrypt_jwt(token=token, should_use_aes=True)
    decoded = jwt.decode(jwt=decrypted_token, key=config.PUBLIC_KEY, algorithms=["RS256"])
    expiry = datetime.utcfromtimestamp(decoded["exp"])
    ttl = int((expiry - datetime.utcnow()).total_seconds())
    redis_client.setex(f"blacklist:{token}", ttl, "blacklisted")
