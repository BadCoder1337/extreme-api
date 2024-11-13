from fastapi import APIRouter, Depends, Body, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from starlette.responses import Response

if __package__ is None or __package__ == '':
    import sys
    from os import path

    sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

    from backend.authorization_service.app.utils.database import get_db
    from backend.authorization_service.app.utils.models.models import User
    from backend.authorization_service.app.utils.models.users.utils import hash_password
else:
    from ....utils.database import get_db
    from ..models import User
    from .utils import hash_password

router = APIRouter()


@router.put("/update")
async def update_user(data = Body(), db: Session = Depends(get_db)):
    """
    Endpoint for updating a user
    Args:
        data: User`s data;
        db: Database object.

    Returns:
        Ok, if successful, and error, if not.
    """
    try:
        user = db.query(User).filter(User.username == data["username"]).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        if "new_username" in data:
            user.username = data["new_username"]
        if "is_active" in data:
            user.email = data["email"]
        if "is_active" in data:
            user.password_hash = hash_password(data["password"])
        if "is_active" in data:
            user.password_hash = hash_password(data["is_active"])
        db.commit()
        db.refresh(user)
        return Response(content=str(f"User {user.username} updated successfully"), status_code=status.HTTP_200_OK)
    except Exception as e:
        return Response(content=str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
