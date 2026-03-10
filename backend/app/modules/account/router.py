from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from . import schemas, repository
from ...database import get_db
from ...dependencies import get_current_account
from ...modules.auth.schemas import AccountResponse
from ...shared.auth.password import verify_password

router = APIRouter(prefix="/api/account", tags=["account"])

@router.put("/password")
def change_password(
    password_data: schemas.PasswordChange,
    db: Session = Depends(get_db),
    current_account: AccountResponse = Depends(get_current_account)
):
    if not verify_password(password_data.current_password, current_account.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    repository.update_account_password(db, current_account.id, password_data.new_password)
    return {"message": "Password updated successfully"}

@router.put("/settings", response_model=AccountResponse)
def update_settings(
    settings: schemas.AccountSettings,
    db: Session = Depends(get_db),
    current_account: AccountResponse = Depends(get_current_account)
):
    return repository.update_account_settings(
        db, 
        current_account.id, 
        settings.email, 
        settings.flag
    )

@router.get("/stats", response_model=schemas.AccountStats)
def get_stats(
    db: Session = Depends(get_db),
    current_account: AccountResponse = Depends(get_current_account)
):
    return repository.get_account_stats(db, current_account.id)
