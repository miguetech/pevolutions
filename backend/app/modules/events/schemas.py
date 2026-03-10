from pydantic import BaseModel

class EventResponse(BaseModel):
    id: int
    title: str
    description: str
    date: str
    tag: str

    class Config:
        from_attributes = True
