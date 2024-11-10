import jwt
from fastapi import FastAPI, HTTPException
from fastapi import Request
from fastapi import Response
from starlette import status

if "main" in  __name__:
    if __package__ is None or __package__ == '':
        import sys
        from os import path
        sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

        from backend.authorization_service.app.utils.token_operations.access_token import create_access_token
        from backend.authorization_service.app.utils.token_operations.refresh_token import rotate_refresh_token
        from backend.authorization_service.app.utils.token_operations.verify_token import verify_token
        from backend.authorization_service.app.utils.token_operations.blacklist_token import blacklist_token
    else:
        from .utils.token_operations.access_token import create_access_token
        from .utils.token_operations.refresh_token import rotate_refresh_token
        from .utils.token_operations.verify_token import verify_token
        from .utils.token_operations.blacklist_token import blacklist_token

app = FastAPI()

@app.post("/refresh")
async def refresh_token(request: Request, response: Response):
    """
    Endpoint for token refresh.
    Args:
        request: request object;
        response: response object.

    Returns:
        Response object with new tokens, if successful, and Error if not.
    """
    try:
        refresh_token = request.cookies.get('refresh_token', None)
        access_token = request.cookies.get('access_token', None)
        verify_token(token=access_token, request=request)
        decoded = verify_token(token=refresh_token, request=request, token_type="refresh")
        new_access_token = create_access_token({"sub": decoded["sub"]})
        new_refresh_token = rotate_refresh_token(old_token=refresh_token,
                                                 username=decoded["sub"],
                                                 user_agent=request.headers.get('User-Agent', None),
                                                 ip_address=request.client.host
                                                 )
        response.set_cookie(key="access_token", value=new_access_token, httponly=True)
        response.set_cookie(key="refresh_token", value=new_refresh_token, httponly=True)
        response.status_code = status.HTTP_200_OK
        return response
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=str(e))

@app.post("/logout")
async def logout(request: Request):
    """
    Endpoint for logging out.

    Args:
        request: request object.

    Returns:
        Ok, if successful, and error, if not.
    """
    try:
        blacklist_token(request.cookies.get('refresh_token', None))
        return Response(content=str({"message": "Successfully logged out."}), status_code=status.HTTP_200_OK)
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/_health")
def health_check():
    """
    Endpoint for docker-compose healthcheck call.

    Returns:
        Ok, if server is up and healthy.
    """
    return Response(content=str({"message": "Healthy"}), status_code=status.HTTP_200_OK)
