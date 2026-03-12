from sqlalchemy.orm import Session
from . import models, schemas

def get_account_players(db: Session, account_id: int):
    return db.query(models.Player).filter(models.Player.account_id == account_id).all()

def create_player(db: Session, player: schemas.PlayerCreate, account_id: int):
    db_player = models.Player(
        name=player.name,
        account_id=account_id,
        sex=player.sex
    )
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player

def get_player_by_name(db: Session, name: str):
    return db.query(models.Player).filter(models.Player.name == name).first()

def update_player(db: Session, player_name: str, account_id: int, updates: dict):
    player = db.query(models.Player).filter(
        models.Player.name == player_name,
        models.Player.account_id == account_id
    ).first()
    
    if player:
        for key, value in updates.items():
            if value is not None:
                setattr(player, key, value)
        db.commit()
        db.refresh(player)
    return player

def delete_player(db: Session, player_name: str, account_id: int):
    player = db.query(models.Player).filter(
        models.Player.name == player_name,
        models.Player.account_id == account_id
    ).first()
    
    if player:
        db.delete(player)
        db.commit()
        return True
    return False

def get_pokemon_team(db: Session, player_name: str):
    return db.query(models.PokemonTeam).filter(models.PokemonTeam.name == player_name).first()

def get_player_stats(db: Session, player_name: str):
    player = db.query(models.Player).filter(models.Player.name == player_name).first()
    if not player:
        return None
    
    team = get_pokemon_team(db, player_name)
    pokemon_count = 0
    if team:
        pokemon_count = sum(1 for i in range(1, 7) if getattr(team, f'pokemon{i}'))
    
    return {
        "id": player.id,
        "name": player.name,
        "level": player.level,
        "vocation": player.vocation,
        "experience": player.experience,
        "health": player.health,
        "healthmax": player.healthmax,
        "sex": player.sex,
        "skill_fishing": player.skill_fishing,
        "onlinetime": player.onlinetime,
        "lastlogin": player.lastlogin,
        "lastlogout": player.lastlogout,
        "pokemon_count": pokemon_count
    }

def get_online_players(db: Session, sort_by: str = "level", search: str = None, limit: int = 50):
    query = db.query(models.Player).join(
        models.PlayerOnline,
        models.Player.id == models.PlayerOnline.player_id
    )
    
    if search:
        query = query.filter(models.Player.name.like(f"%{search}%"))
    
    if sort_by == "captures":
        query = query.order_by(models.Player.experience.desc())
    elif sort_by == "fishing_level":
        query = query.order_by(models.Player.skill_fishing.desc())
    else:
        query = query.order_by(models.Player.level.desc())
    
    players = query.limit(limit).all()
    
    result = []
    for p in players:
        result.append({
            "id": p.id,
            "name": p.name,
            "level": p.level,
            "vocation": p.vocation,
            "sex": p.sex,
            "captures": int(p.experience / 100),
            "fishing_level": p.skill_fishing
        })
    
    return result
