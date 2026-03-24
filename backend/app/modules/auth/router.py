from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from . import schemas, repository
from ...database import get_db
from ...config import settings
from ...shared.auth.jwt import create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=schemas.AccountResponse)
def register(account: schemas.AccountCreate, db: Session = Depends(get_db)):
    db_account = repository.get_account_by_name(db, name=account.name)
    if db_account:
        raise HTTPException(status_code=400, detail="Account name already registered")
    
    db_account = repository.get_account_by_email(db, email=account.email)
    if db_account:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    return repository.create_account(db=db, account=account)

@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.AccountLogin, db: Session = Depends(get_db)):
    account = repository.authenticate_account(db, credentials.name, credentials.password)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect account name or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": account.name}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
