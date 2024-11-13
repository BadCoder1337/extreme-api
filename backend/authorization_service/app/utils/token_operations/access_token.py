from datetime import datetime, timedelta
from os import path

import jwt

if __package__ is None or __package__ == '':
    import sys

    sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

    from backend.authorization_service.app.utils.config import config
    from backend.authorization_service.app.utils.crypt_operations.encryption import encrypt_jwt
else:
    from ...utils.config import config
    from ...utils.crypt_operations.encryption import encrypt_jwt

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES))

    data.update({"exp": expire, "type": "access"})

    encoded_jwt = jwt.encode(payload=data, key=config.SECRET_KEY, algorithm="RS256")

    encrypted_jwt = encrypt_jwt(encoded_jwt=encoded_jwt, should_use_aes=True)

    return encrypted_jwt
