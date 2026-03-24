from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from . import schemas, repository
from ...database import get_db
from ...dependencies import get_current_account
from ...modules.auth.schemas import AccountResponse

router = APIRouter(prefix="/api/shop", tags=["shop"])

@router.get("/packages", response_model=List[schemas.ShopPackage])
def get_packages():
    return repository.get_shop_packages()

@router.get("/premium", response_model=schemas.PremiumStatus)
def get_premium_status(
    db: Session = Depends(get_db),
    current_account: AccountResponse = Depends(get_current_account)
):
    return repository.get_premium_status(db, current_account.id)
