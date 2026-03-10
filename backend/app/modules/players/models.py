from sqlalchemy import Column, Integer, String, BigInteger, ForeignKey, Text, LargeBinary
from sqlalchemy.orm import relationship
from ...database import Base

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    level = Column(Integer, nullable=False, default=1)
    vocation = Column(Integer, nullable=False, default=0)
    health = Column(Integer, nullable=False, default=150)
    healthmax = Column(Integer, nullable=False, default=150)
    experience = Column(BigInteger, nullable=False, default=0)
    sex = Column(Integer, nullable=False, default=0)
    town_id = Column(Integer, nullable=False, default=1)
    posx = Column(Integer, nullable=False, default=1053)
    posy = Column(Integer, nullable=False, default=1050)
    posz = Column(Integer, nullable=False, default=7)
    conditions = Column(LargeBinary, nullable=False, default=b'')
    lastlogin = Column(BigInteger, nullable=False, default=0)
    lastlogout = Column(BigInteger, nullable=False, default=0)
    onlinetime = Column(BigInteger, nullable=False, default=0)
    skill_fishing = Column(Integer, nullable=False, default=10)
    
    account = relationship("Account", back_populates="players")
    pokemon_team = relationship("PokemonTeam", back_populates="player", uselist=False)

class PokemonTeam(Base):
    __tablename__ = "pokemonteam"

    name = Column(String(255), ForeignKey("players.name"), primary_key=True)
    pokemon1 = Column(Integer, nullable=True)
    pokemon2 = Column(Integer, nullable=True)
    pokemon3 = Column(Integer, nullable=True)
    pokemon4 = Column(Integer, nullable=True)
    pokemon5 = Column(Integer, nullable=True)
    pokemon6 = Column(Integer, nullable=True)
    
    player = relationship("Player", back_populates="pokemon_team")
