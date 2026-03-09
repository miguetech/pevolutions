from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base

class GenderEnum(str, enum.Enum):
    boy = "boy"
    girl = "girl"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    country = Column(String(2), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    characters = relationship("Character", back_populates="owner", cascade="all, delete-orphan")

class Character(Base):
    __tablename__ = "characters"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(50), unique=True, index=True, nullable=False)
    gender = Column(Enum(GenderEnum), nullable=False)
    level = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User", back_populates="characters")
