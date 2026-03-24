from sqlalchemy.orm import Session
from ...shared.auth.password import get_password_hash, verify_password
from ...shared.auth.jwt import create_access_token
from . import models, schemas
import time

def get_account_by_name(db: Session, name: str):
    return db.query(models.Account).filter(models.Account.name == name).first()

def get_account_by_email(db: Session, email: str):
    return db.query(models.Account).filter(models.Account.email == email).first()

def create_account(db: Session, account: schemas.AccountCreate):
    hashed_password = get_password_hash(account.password)
    db_account = models.Account(
        name=account.name,
        email=account.email,
        password=hashed_password,
        creation=int(time.time())
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

def authenticate_account(db: Session, name: str, password: str):
    account = get_account_by_name(db, name)
    if not account:
        return False
    if not verify_password(password, account.password):
        return False
    return account
