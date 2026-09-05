from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import jwt

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User, UserRole

bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(credentials.credentials)
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if user is None:
        raise credentials_exception
    return user


def require_roles(*roles: UserRole):
    """Dependency factory that checks the current user has one of the given roles."""

    def _check(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{current_user.role}' is not permitted to perform this action.",
            )
        return current_user

    return _check


# Convenience role guards
require_admin = require_roles(UserRole.ADMIN)
require_internal = require_roles(
    UserRole.ADMIN, UserRole.SALES_REP, UserRole.SALES_MANAGER, UserRole.FINANCE
)
require_manager_or_above = require_roles(UserRole.ADMIN, UserRole.SALES_MANAGER)
require_finance_or_above = require_roles(UserRole.ADMIN, UserRole.FINANCE)
require_manager_or_finance = require_roles(
    UserRole.ADMIN, UserRole.SALES_MANAGER, UserRole.FINANCE
)
