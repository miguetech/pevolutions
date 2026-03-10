from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from . import schemas, repository
from ...database import get_db
from ...dependencies import get_current_account
from ...modules.auth.schemas import AccountResponse

router = APIRouter(prefix="/api/players", tags=["players"])

@router.get("/", response_model=List[schemas.PlayerResponse])
def get_my_players(
    db: Session = Depends(get_db),
    current_account: AccountResponse = Depends(get_current_account)
):
    return repository.get_account_players(db, current_account.id)

@router.post("/", response_model=schemas.PlayerResponse)
def create_player(
    player: schemas.PlayerCreate,
    db: Session = Depends(get_db),
    current_account: AccountResponse = Depends(get_current_account)
):
    db_player = repository.get_player_by_name(db, player.name)
    if db_player:
        raise HTTPException(status_code=400, detail="Player name already exists")
    
    return repository.create_player(db, player, current_account.id)

@router.get("/online", response_model=List[schemas.PlayerOnline])
def get_online_players(
    sort_by: str = "level",
    search: str = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    return repository.get_online_players(db, sort_by, search, limit)

@router.get("/{player_name}", response_model=schemas.PlayerResponse)
def get_player(player_name: str, db: Session = Depends(get_db)):
    player = repository.get_player_by_name(db, player_name)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return player

@router.put("/{player_name}", response_model=schemas.PlayerResponse)
def update_player(
    player_name: str,
    updates: schemas.PlayerUpdate,
    db: Session = Depends(get_db),
    current_account: AccountResponse = Depends(get_current_account)
):
    player = repository.update_player(db, player_name, current_account.id, updates.dict(exclude_unset=True))
    if not player:
        raise HTTPException(status_code=404, detail="Player not found or not owned by you")
    return player

@router.delete("/{player_name}")
def delete_player(
    player_name: str,
    db: Session = Depends(get_db),
    current_account: AccountResponse = Depends(get_current_account)
):
    success = repository.delete_player(db, player_name, current_account.id)
    if not success:
        raise HTTPException(status_code=404, detail="Player not found or not owned by you")
    return {"message": "Player deleted successfully"}

@router.get("/{player_name}/pokemon", response_model=schemas.PokemonTeamResponse)
def get_player_pokemon(player_name: str, db: Session = Depends(get_db)):
    team = repository.get_pokemon_team(db, player_name)
    if not team:
        raise HTTPException(status_code=404, detail="Pokemon team not found")
    return team

@router.get("/{player_name}/stats", response_model=schemas.PlayerStats)
def get_player_stats(player_name: str, db: Session = Depends(get_db)):
    stats = repository.get_player_stats(db, player_name)
    if not stats:
        raise HTTPException(status_code=404, detail="Player not found")
    return stats
