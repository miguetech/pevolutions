from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models

def get_guilds(db: Session, limit: int = 10):
    guilds = db.query(
        models.Guild.id,
        models.Guild.name,
        func.count(models.GuildMember.player_id).label('members_count')
    ).outerjoin(
        models.GuildMember, models.Guild.id == models.GuildMember.guild_id
    ).group_by(
        models.Guild.id, models.Guild.name
    ).order_by(
        func.count(models.GuildMember.player_id).desc()
    ).limit(limit).all()
    
    result = []
    for guild in guilds:
        result.append({
            "id": guild.id,
            "name": guild.name,
            "members_count": guild.members_count,
            "points": guild.members_count * 10000
        })
    return result
