from pydantic import BaseModel, EmailStr
from typing import Optional

class AccountCreate(BaseModel):
    name: str
    password: str
    email: EmailStr

class AccountLogin(BaseModel):
    name: str
    password: str

class AccountResponse(BaseModel):
    id: int
    name: str
    email: str
    flag: Optional[str] = None
    creation: int
    role: int = 1

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
