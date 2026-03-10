from pydantic import BaseModel

class GuildResponse(BaseModel):
    id: int
    name: str
    members_count: int
    points: int

    class Config:
        from_attributes = True
