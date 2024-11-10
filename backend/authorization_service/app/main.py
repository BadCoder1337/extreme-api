import jwt
from fastapi import FastAPI, HTTPException
from fastapi import Request
from fastapi import Response
from passlib.context import CryptContext
from starlette import status

if "main" in  __name__:
    if __package__ is None or __package__ == '':
        import sys
        from os import path
        sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

        from backend.authorization_service.app.utils.token_operations.blacklist_token import blacklist_token
    else:
        from .utils.token_operations.blacklist_token import blacklist_token

app = FastAPI()

@app.post("/logout")
async def logout(request: Request):
    """
    Endpoint for logging out.

    Args:
        request: request object

    Returns:
        Ok, if successful, and error, if not.
    """
    try:
        blacklist_token(request.cookies.get('refresh_token', None))
        return Response(content={"message": "Successfully logged out."}, status_code=status.HTTP_200_OK)
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/_health")
def health_check():
    """
    Endpoint for docker-compose healthcheck call.

    Returns:
        Ok, if server is up and healthy.
    """
    return Response(content={"message": "Healthy"}, status_code=status.HTTP_200_OK)
