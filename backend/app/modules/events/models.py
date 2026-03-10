from sqlalchemy import Column, Integer, String, BigInteger, Text
from ...database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    date = Column(String(50), nullable=False)
    tag = Column(String(50), nullable=False)
    created_at = Column(BigInteger, nullable=False, default=0)
