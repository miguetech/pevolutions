from pydantic import BaseModel
from typing import Optional

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class AccountSettings(BaseModel):
    email: Optional[str] = None
    flag: Optional[str] = None

class AccountStats(BaseModel):
    total_playing_time: int
    pokemon_caught: int
    world_ranking: int
