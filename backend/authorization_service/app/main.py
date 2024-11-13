import jwt
from fastapi import FastAPI, HTTPException, Depends
from fastapi import Request
from fastapi import Response
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from starlette import status

if __package__ is None or __package__ == '':
    import sys
    from os import path

    sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

    from backend.authorization_service.app.utils.database import get_db
    from backend.authorization_service.app.utils.models import models
    from backend.authorization_service.app.utils.token_operations.access_token import create_access_token
    from backend.authorization_service.app.utils.token_operations.refresh_token import create_refresh_token, \
        rotate_refresh_token
    from backend.authorization_service.app.utils.token_operations.verify_token import verify_token
    from backend.authorization_service.app.utils.token_operations.blacklist_token import blacklist_token
    from backend.authorization_service.app.utils.rate_limit_check import rate_limit_check
    from backend.authorization_service.app.utils.models.schemes import UserBaseSchema
    from backend.authorization_service.app.utils.models.users.utils import verify_password
    from backend.authorization_service.app.utils.models.users.create_user import router as create_user_router
    from backend.authorization_service.app.utils.models.users.update_user import router as update_user_router
    from backend.authorization_service.app.utils.models.users.delete_user import router as delete_user_router
else:
    from .utils.database import get_db
    from .utils.models import models
    from .utils.token_operations.access_token import create_access_token
    from .utils.token_operations.refresh_token import create_refresh_token, rotate_refresh_token
    from .utils.token_operations.verify_token import verify_token
    from .utils.token_operations.blacklist_token import blacklist_token
    from .utils.rate_limit_check import rate_limit_check
    from .utils.models.schemes import UserBaseSchema
    from .utils.models.users.utils import verify_password
    from .utils.models.users.create_user import router as create_user_router
    from .utils.models.users.update_user import router as update_user_router
    from .utils.models.users.delete_user import router as delete_user_router
app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
app.include_router(create_user_router, prefix="/users", tags=["Users"])
app.include_router(update_user_router, prefix="/users", tags=["Users"])
app.include_router(delete_user_router, prefix="/users", tags=["Users"])


@app.post("/login")
async def login(response: Response, request: Request, user: UserBaseSchema, db: Session = Depends(get_db)):
    """
    Endpoint for logging in.

    Args:
        request: request object;
        response: response object;
        user: authorized user;
        db: working database.

    Returns:
        Response object with tokens, if successful, and Error if not.
    """
    username = user.username
    db_user = db.query(models.User).filter(models.User.username == username).first()\

    if not db_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

    is_valid = verify_password(plain_password=user.password,
                               hashed_password=db_user.password_hash)

    if not is_valid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

    if not rate_limit_check(user.username, "login", limit=5, period=300):
        return Response(content=str({"error": "Too many login attempts. Please try again later."}),
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS)

    user_agent = request.headers.get('User-Agent', None)
    access_token = create_access_token({"sub": username})
    refresh_token = create_refresh_token({"sub": username}, user_agent=user_agent, ip_address=request.client.host)
    response.set_cookie(key="access_token", value=access_token, httponly=True)
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True)
    response.status_code = status.HTTP_200_OK
    return response


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
