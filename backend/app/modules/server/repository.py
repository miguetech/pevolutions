from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from ..players import models as player_models
from ..guilds import models as guild_models

def get_server_info(db: Session):
    online_count = db.query(player_models.PlayerOnline).count()
    return {
        "online_count": online_count,
        "status": "online",
        "uptime": "99.9%",
        "version": "1.0.0"
    }

def get_top_players(db: Session, limit: int = 10):
    players = db.query(player_models.Player)\
        .order_by(desc(player_models.Player.level), desc(player_models.Player.experience))\
        .limit(limit)\
        .all()
    
    return [{
        "name": p.name,
        "level": p.level,
        "score": int(p.experience / 100)
    } for p in players]

def get_top_guilds(db: Session, limit: int = 10):
    guilds = db.query(guild_models.Guild)\
        .order_by(desc(guild_models.Guild.points))\
        .limit(limit)\
        .all()
    
    result = []
    for g in guilds:
        member_count = db.query(guild_models.GuildMembership)\
            .filter(guild_models.GuildMembership.guild_id == g.id)\
            .count()
        
        result.append({
            "name": g.name,
            "members": member_count,
            "points": f"{g.points}k" if g.points < 1000 else f"{g.points/1000:.1f}M",
            "tag": "Competitive"
        })
    
    return result

def get_support_staff():
    return [
        {
            "name": "Admin_Sylarnal",
            "role": "Head Administrator",
            "availability": "10:00 - 22:00 UTC",
            "languages": ["ES", "EN"]
        },
        {
            "name": "MistyTrainer",
            "role": "Support Moderator",
            "availability": "14:00 - 02:00 UTC",
            "languages": ["EN", "PT"]
        }
    ]

def get_downloads():
    return [
        {
            "name": "PEvolutions Client",
            "version": "1.0.0",
            "size": "250 MB",
            "url": "/downloads/pevolutions-client-1.0.0.exe",
            "platform": "Windows"
        },
        {
            "name": "PEvolutions Client",
            "version": "1.0.0",
            "size": "280 MB",
            "url": "/downloads/pevolutions-client-1.0.0.dmg",
            "platform": "macOS"
        }
    ]
