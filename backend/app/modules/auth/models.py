from sqlalchemy import Column, Integer, String, BigInteger
from sqlalchemy.orm import relationship
from ...database import Base

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(32), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    creation = Column(BigInteger, nullable=False, default=0)
    premium_ends_at = Column(BigInteger, nullable=False, default=0)
    premium_points = Column(Integer, nullable=True)
    flag = Column(String(80), nullable=False, default="")
    
    players = relationship("Player", back_populates="account")
