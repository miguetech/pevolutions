# SQLAlchemy ORM Patterns

## SQLAlchemy 2.0+ Style

### Model Definition
```python
from sqlalchemy import String, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from datetime import datetime

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    posts: Mapped[list["Post"]] = relationship(back_populates="user")
```

### Relationships
```python
# One-to-Many
class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    posts: Mapped[list["Post"]] = relationship(back_populates="user")

class Post(Base):
    __tablename__ = "posts"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(back_populates="posts")

# Many-to-Many
class Student(Base):
    __tablename__ = "students"
    id: Mapped[int] = mapped_column(primary_key=True)
    courses: Mapped[list["Course"]] = relationship(
        secondary="student_courses",
        back_populates="students"
    )

class Course(Base):
    __tablename__ = "courses"
    id: Mapped[int] = mapped_column(primary_key=True)
    students: Mapped[list["Student"]] = relationship(
        secondary="student_courses",
        back_populates="courses"
    )
```

## Query Patterns

### Basic Queries
```python
from sqlalchemy import select

# Get all
users = db.query(User).all()
# Or with select (2.0 style)
stmt = select(User)
users = db.execute(stmt).scalars().all()

# Get one
user = db.query(User).filter(User.id == 1).first()
# Or
stmt = select(User).where(User.id == 1)
user = db.execute(stmt).scalar_one_or_none()

# Get by primary key
user = db.get(User, 1)
```

### Filtering
```python
# Simple filters
active_users = db.query(User).filter(User.is_active == True).all()

# Multiple conditions (AND)
users = db.query(User).filter(
    User.is_active == True,
    User.role == "admin"
).all()

# OR conditions
from sqlalchemy import or_
users = db.query(User).filter(
    or_(User.role == "admin", User.role == "moderator")
).all()

# IN clause
user_ids = [1, 2, 3]
users = db.query(User).filter(User.id.in_(user_ids)).all()

# LIKE
users = db.query(User).filter(User.username.like("%john%")).all()
```

### Ordering and Limiting
```python
# Order by
users = db.query(User).order_by(User.created_at.desc()).all()

# Pagination
users = db.query(User).offset(10).limit(20).all()

# Count
user_count = db.query(User).count()
```

## Relationship Loading

### Avoid N+1 Problem
```python
# Bad - N+1 queries
users = db.query(User).all()
for user in users:
    print(user.posts)  # Separate query for each user!

# Good - Eager loading with joinedload
from sqlalchemy.orm import joinedload

users = db.query(User).options(joinedload(User.posts)).all()
for user in users:
    print(user.posts)  # No additional queries

# selectinload for collections (better for one-to-many)
from sqlalchemy.orm import selectinload

users = db.query(User).options(selectinload(User.posts)).all()
```

### Loading Strategies
```python
# joinedload - single query with JOIN
users = db.query(User).options(joinedload(User.profile)).all()

# selectinload - separate query with IN clause
users = db.query(User).options(selectinload(User.posts)).all()

# subqueryload - separate query with subquery
users = db.query(User).options(subqueryload(User.posts)).all()
```

## Session Management

### Context Manager Pattern
```python
from app.database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Usage in FastAPI
@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()
```

### Transaction Management
```python
# Auto-commit on success, rollback on error
try:
    user = User(username="john", email="john@example.com")
    db.add(user)
    db.commit()
    db.refresh(user)  # Get updated data from DB
except Exception as e:
    db.rollback()
    raise
```

## CRUD Operations

### Create
```python
def create_user(db: Session, user_data: UserCreate) -> User:
    user = User(**user_data.dict())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
```

### Read
```python
def get_user(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
    return db.query(User).offset(skip).limit(limit).all()
```

### Update
```python
def update_user(db: Session, user_id: int, user_data: UserUpdate) -> User | None:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    
    for key, value in user_data.dict(exclude_unset=True).items():
        setattr(user, key, value)
    
    db.commit()
    db.refresh(user)
    return user
```

### Delete
```python
def delete_user(db: Session, user_id: int) -> bool:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return False
    
    db.delete(user)
    db.commit()
    return True
```

## Joins

```python
# Inner join
results = db.query(User, Post).join(Post).all()

# Left outer join
results = db.query(User).outerjoin(Post).all()

# With filters
results = db.query(User).join(Post).filter(Post.published == True).all()
```

## Aggregations

```python
from sqlalchemy import func

# Count
post_count = db.query(func.count(Post.id)).scalar()

# Group by
user_post_counts = db.query(
    User.username,
    func.count(Post.id).label("post_count")
).join(Post).group_by(User.id).all()

# Having
active_users = db.query(User).join(Post).group_by(User.id).having(
    func.count(Post.id) > 5
).all()
```

## Best Practices

1. **Use mapped_column and Mapped** for SQLAlchemy 2.0+
2. **Always use indexes** on foreign keys and frequently queried columns
3. **Use eager loading** to avoid N+1 queries
4. **Close sessions** properly with context managers
5. **Use transactions** for multiple operations
6. **Avoid lazy loading** in loops
7. **Use select() style** for new code (2.0 style)
8. **Add constraints** at database level (unique, not null, foreign keys)
