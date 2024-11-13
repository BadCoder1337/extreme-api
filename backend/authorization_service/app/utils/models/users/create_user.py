from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from starlette import status
from starlette.responses import Response
if __package__ is None or __package__ == '':
    import sys
    from os import path

    sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

    from backend.authorization_service.app.utils.database import get_db
    from backend.authorization_service.app.utils.models.models import User
    from backend.authorization_service.app.utils.models.users.utils import hash_password, verify_password
else:
    from ....utils.database import get_db
    from ..models import User
    from .utils import hash_password, verify_password

router = APIRouter()


# Create a user
@router.post("/create")
async def create_user(data = Body(), db: Session = Depends(get_db)):
    try:
        hashed_password = hash_password(data["password"])
        verify_password(data["password"], hashed_password)
        user = User(username=data["username"], email=data["email"], password_hash=hashed_password)
        db.add(user)
        db.commit()
        db.refresh(user)
        return Response(status_code=status.HTTP_201_CREATED)
    except Exception as e:
        return Response(content=str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
