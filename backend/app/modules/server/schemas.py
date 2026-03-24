from pydantic import BaseModel
from typing import List

class ServerInfo(BaseModel):
    online_count: int
    status: str
    uptime: str
    version: str = "1.0.0"

class TopPlayer(BaseModel):
    name: str
    level: int
    score: int

class TopGuild(BaseModel):
    name: str
    members: int
    points: str
    tag: str

class SupportStaff(BaseModel):
    name: str
    role: str
    availability: str
    languages: List[str]

class Download(BaseModel):
    name: str
    version: str
    size: str
    url: str
    platform: str
