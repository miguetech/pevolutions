from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from . import schemas, repository
from ...database import get_db

router = APIRouter(prefix="/api", tags=["server"])

@router.get("/server/info", response_model=schemas.ServerInfo)
def get_server_info(db: Session = Depends(get_db)):
    return repository.get_server_info(db)

@router.get("/players/top", response_model=List[schemas.TopPlayer])
def get_top_players(limit: int = 10, db: Session = Depends(get_db)):
    return repository.get_top_players(db, limit)

@router.get("/guilds/top", response_model=List[schemas.TopGuild])
def get_top_guilds(limit: int = 10, db: Session = Depends(get_db)):
    return repository.get_top_guilds(db, limit)

@router.get("/support/staff", response_model=List[schemas.SupportStaff])
def get_support_staff():
    return repository.get_support_staff()

@router.get("/downloads", response_model=List[schemas.Download])
def get_downloads():
    return repository.get_downloads()
