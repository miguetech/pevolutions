from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from . import schemas, repository
from ...database import get_db

router = APIRouter(prefix="/api/guilds", tags=["guilds"])

@router.get("/", response_model=List[schemas.GuildResponse])
def get_guilds(limit: int = 10, db: Session = Depends(get_db)):
    return repository.get_guilds(db, limit)
