from fastapi import APIRouter, Depends, HTTPException, Body
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


@router.delete("/delete")
async def delete_role(data = Body(), db: Session = Depends(get_db)):
    """
    Endpoint for deleting a role
    Args:
        data: Role`s data;
        db: Database object.

    Returns:
        Ok, if successful, and error, if not.
    """
    try:
        role = db.query(Role).filter(Role.name == data['name']).first()
        if not role:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
        role.name = data['new_name']
        db.delete(role)
        db.commit()
        return Response(content=str(f"Role {role.name} was deleted"), status_code=status.HTTP_200_OK)
    except Exception as e:
        return Response(content=str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
