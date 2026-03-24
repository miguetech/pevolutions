from sqlalchemy.orm import Session
from ..auth.models import Account
from ..players.models import Player
from ...shared.auth.password import get_password_hash

def update_account_password(db: Session, account_id: int, new_password: str):
    account = db.query(Account).filter(Account.id == account_id).first()
    if account:
        account.password = get_password_hash(new_password)
        db.commit()
        db.refresh(account)
    return account

def update_account_settings(db: Session, account_id: int, email: str = None, flag: str = None):
    account = db.query(Account).filter(Account.id == account_id).first()
    if account:
        if email:
            account.email = email
        if flag:
            account.flag = flag
        db.commit()
        db.refresh(account)
    return account

def get_account_stats(db: Session, account_id: int):
    from sqlalchemy import func
    players = db.query(Player).filter(Player.account_id == account_id).all()
    total_time = sum(p.onlinetime for p in players)
    total_level = sum(p.level for p in players)
    
    higher_accounts = db.query(Player.account_id).group_by(Player.account_id).having(
        func.sum(Player.level) > total_level
    ).count()
    
    return {
        "total_playing_time": total_time,
        "pokemon_caught": len(players) * 50,
        "world_ranking": higher_accounts + 1
    }
