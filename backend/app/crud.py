from sqlalchemy.orm import Session
from . import models, schemas, auth

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password,
        country=user.country
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return False
    if not auth.verify_password(password, user.password_hash):
        return False
    return user

def get_user_characters(db: Session, user_id: int):
    return db.query(models.Character).filter(models.Character.user_id == user_id).all()

def create_character(db: Session, character: schemas.CharacterCreate, user_id: int):
    db_character = models.Character(
        name=character.name,
        gender=character.gender,
        user_id=user_id
    )
    db.add(db_character)
    db.commit()
    db.refresh(db_character)
    return db_character
