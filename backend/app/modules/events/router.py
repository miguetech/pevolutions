from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from . import schemas, repository
from ...database import get_db

router = APIRouter(prefix="/api/events", tags=["events"])

@router.get("/", response_model=List[schemas.EventResponse])
def get_events(limit: int = 10, db: Session = Depends(get_db)):
    return repository.get_events(db, limit)
