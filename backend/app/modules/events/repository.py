from sqlalchemy.orm import Session
from . import models

def get_events(db: Session, limit: int = 10):
    return db.query(models.Event).order_by(models.Event.created_at.desc()).limit(limit).all()
