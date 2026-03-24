from sqlalchemy import Column, Integer, String
from ...database import Base

class Guild(Base):
    __tablename__ = "guilds"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    ownerid = Column(Integer, nullable=False)
    creationdata = Column(Integer, nullable=False)

class GuildMember(Base):
    __tablename__ = "guild_membership"

    player_id = Column(Integer, primary_key=True)
    guild_id = Column(Integer, nullable=False)
    rank_id = Column(Integer, nullable=False)
    nick = Column(String(15), nullable=False, default="")
