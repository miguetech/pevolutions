from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from .database import get_db
from .config import settings
from .modules.auth import repository as auth_repo

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_account(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        account_name: str = payload.get("sub")
        if account_name is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    account = auth_repo.get_account_by_name(db, name=account_name)
    if account is None:
        raise credentials_exception
    
    return account
