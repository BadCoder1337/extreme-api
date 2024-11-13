from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from starlette import status
from starlette.responses import Response
if __package__ is None or __package__ == '':
    import sys
    from os import path

    sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

    from backend.authorization_service.app.utils.database import get_db
    from backend.authorization_service.app.utils.models.models import Role
else:
    from ....utils.database import get_db
    from ..models import Role

router = APIRouter()


# Create a user
@router.post("/create")
async def create_role(data = Body(), db: Session = Depends(get_db)):
    """
    Endpoint for creating a new role.
    Args:
        data: Role`s data;
        db: Database object.

    Returns:
        Created, if successful, and error, if not.
    """
    try:
        role = Role(name=data['name'])
        db.add(role)
        db.commit()
        db.refresh(role)
        return Response(status_code=status.HTTP_201_CREATED)
    except Exception as e:
        return Response(content=str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
