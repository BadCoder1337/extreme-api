from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from starlette import status
from starlette.responses import Response

if __package__ is None or __package__ == '':
    import sys
    from os import path

    sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

    from backend.authorization_service.app.utils.database import get_db
    from backend.authorization_service.app.utils.models.models import User
else:
    from ....utils.database import get_db
    from ..models import User

router = APIRouter()


@router.delete("/delete/")
async def delete_user(data = Body(), db: Session = Depends(get_db)):
    """
    Endpoint for deleting a user
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
        db.delete(user)
        db.commit()
        return Response(content=str(f"User {user.username} was deleted"), status_code=status.HTTP_200_OK)
    except Exception as e:
        return Response(content=str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
