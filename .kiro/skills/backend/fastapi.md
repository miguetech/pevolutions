# FastAPI Development

## RESTful API Design

### HTTP Methods
- `GET` - Retrieve resources (idempotent, no body)
- `POST` - Create new resources
- `PUT` - Update entire resource (idempotent)
- `PATCH` - Partial update
- `DELETE` - Remove resource (idempotent)

### Status Codes
```python
from fastapi import status

# Success
200 - OK (GET, PUT, PATCH)
201 - Created (POST)
204 - No Content (DELETE)

# Client Errors
400 - Bad Request (validation error)
401 - Unauthorized (not authenticated)
403 - Forbidden (not authorized)
404 - Not Found
409 - Conflict (duplicate resource)
422 - Unprocessable Entity (Pydantic validation)

# Server Errors
500 - Internal Server Error
503 - Service Unavailable
```

## Router Organization

### Use APIRouter with Prefixes
```python
from fastapi import APIRouter

router = APIRouter(
    prefix="/api/v1/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=list[UserResponse])
async def list_users(skip: int = 0, limit: int = 100):
    pass

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    pass

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate):
    pass
```

## Dependency Injection

### Database Session
```python
from fastapi import Depends
from sqlalchemy.orm import Session
from app.database import get_db

@router.get("/users/{user_id}")
def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

### Authentication
```python
from app.auth import get_current_user

@router.get("/me")
def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user

@router.post("/posts")
def create_post(
    post: PostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_post = Post(**post.dict(), user_id=current_user.id)
    db.add(new_post)
    db.commit()
    return new_post
```

## Pydantic Schemas

### Request/Response Models
```python
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True  # SQLAlchemy 2.0

class UserUpdate(BaseModel):
    email: EmailStr | None = None
    username: str | None = None
```

### Validation
```python
from pydantic import validator

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    
    @validator('username')
    def username_alphanumeric(cls, v):
        assert v.isalnum(), 'must be alphanumeric'
        return v
    
    @validator('password')
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('must be at least 8 characters')
        return v
```

## Async/Await Patterns

### When to Use Async
```python
# Use async for I/O operations
@router.get("/external-data")
async def get_external_data():
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.example.com/data")
        return response.json()

# Regular sync for database with SQLAlchemy (non-async)
@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()
```

## Error Handling

### Custom Exceptions
```python
from fastapi import HTTPException

class UserNotFoundError(HTTPException):
    def __init__(self, user_id: int):
        super().__init__(
            status_code=404,
            detail=f"User with id {user_id} not found"
        )

# Usage
@router.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise UserNotFoundError(user_id)
    return user
```

### Global Exception Handler
```python
from fastapi import Request
from fastapi.responses import JSONResponse

@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)}
    )
```

## Query Parameters

### Pagination
```python
from fastapi import Query

@router.get("/users")
def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    users = db.query(User).offset(skip).limit(limit).all()
    return users
```

### Filtering
```python
@router.get("/users")
def list_users(
    is_active: bool | None = None,
    role: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(User)
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    if role:
        query = query.filter(User.role == role)
    return query.all()
```

## Background Tasks

```python
from fastapi import BackgroundTasks

def send_email(email: str, message: str):
    # Send email logic
    pass

@router.post("/users")
def create_user(
    user: UserCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    new_user = User(**user.dict())
    db.add(new_user)
    db.commit()
    
    background_tasks.add_task(send_email, user.email, "Welcome!")
    return new_user
```

## Best Practices

1. **Always use response_model** to control output
2. **Use status codes explicitly** for clarity
3. **Validate inputs** with Pydantic
4. **Use dependencies** for reusable logic
5. **Document endpoints** with docstrings and examples
6. **Version your API** with prefixes (/api/v1/)
7. **Use tags** to organize OpenAPI docs
