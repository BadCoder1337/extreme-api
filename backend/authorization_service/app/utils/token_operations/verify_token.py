from datetime import datetime, timedelta

import jwt
import redis
from fastapi import Request

if __package__ is None or __package__ == '':
    import sys
    from os import path

    sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

    from backend.authorization_service.app.utils.config import config
    from backend.authorization_service.app.utils.crypt_operations.decryption import decrypt_jwt
else:
    from ...utils.config import config
    from ...utils.crypt_operations.decryption import decrypt_jwt

# Initialize Redis
redis_client = redis.StrictRedis.from_url(config.REDIS_URL)


def verify_token(token: str, token_type: str = "access", request: Request = None):
    try:
        decrypted_token = decrypt_jwt(token=token, should_use_aes=True)
        decoded_token = jwt.decode(decrypted_token, key=config.PUBLIC_KEY, algorithms=["RS256"])

        # Check for type of token
        if decoded_token["type"] != token_type:
            raise jwt.InvalidTokenError("Invalid token type")

        # Grace period for access tokens
        if token_type == "access":
            # Check if the token is blacklisted
            if redis_client.get(f"blacklist:{token}"):
                raise jwt.InvalidTokenError("Token is blacklisted")

            expiration = datetime.utcfromtimestamp(decoded_token["exp"])
            if expiration < datetime.utcnow() - timedelta(seconds=int(config.GRACE_PERIOD_SECONDS)):
                raise jwt.ExpiredSignatureError("Token has expired with grace period")

        # Additional checks for refresh tokens
        if token_type == "refresh":
            # Check if the token is blacklisted
            if redis_client.get(f"blacklist:{token}"):
                raise jwt.InvalidTokenError("Token is blacklisted")

            # Check User-Agent and IP address if provided in request
            if request:
                user_agent = request.headers.get("User-Agent", None)
                ip_address = request.client.host
                if decoded_token.get("user_agent") != user_agent or decoded_token.get("ip_address") != ip_address:
                    raise jwt.InvalidTokenError("Refresh token validation failed: User-Agent or IP mismatch")

        return decoded_token

    except jwt.ExpiredSignatureError:
        raise jwt.InvalidTokenError("Token has expired")
    except jwt.InvalidTokenError as e:
        raise e
