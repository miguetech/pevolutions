from pydantic import BaseModel
from typing import Optional

class PlayerCreate(BaseModel):
    name: str
    sex: int = 0

class PlayerResponse(BaseModel):
    id: int
    name: str
    level: int
    vocation: int
    health: int
    healthmax: int
    experience: int

    class Config:
        from_attributes = True

class PlayerUpdate(BaseModel):
    level: Optional[int] = None
    vocation: Optional[int] = None
    health: Optional[int] = None
    healthmax: Optional[int] = None

class PlayerStats(BaseModel):
    id: int
    name: str
    level: int
    vocation: int
    experience: int
    health: int
    healthmax: int
    sex: int
    skill_fishing: int
    onlinetime: int
    lastlogin: int
    lastlogout: int
    pokemon_count: int

    class Config:
        from_attributes = True

class PlayerOnline(BaseModel):
    id: int
    name: str
    level: int
    vocation: int
    sex: int
    captures: int
    fishing_level: int

class PokemonTeamResponse(BaseModel):
    name: str
    pokemon1: Optional[int] = None
    pokemon2: Optional[int] = None
    pokemon3: Optional[int] = None
    pokemon4: Optional[int] = None
    pokemon5: Optional[int] = None
    pokemon6: Optional[int] = None

    class Config:
        from_attributes = True
