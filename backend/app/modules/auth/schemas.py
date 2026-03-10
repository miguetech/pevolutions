from pydantic import BaseModel, EmailStr

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
    creation: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
