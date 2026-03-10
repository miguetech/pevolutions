from sqlalchemy.orm import Session
from ..auth.models import Account
import time

def get_shop_packages():
    return [
        {"price": "5 USD", "points": 10, "bonus": "0%"},
        {"price": "10 USD", "points": 20, "bonus": "0%"},
        {"price": "25 USD", "points": 60, "bonus": "+20%"},
        {"price": "50 USD", "points": 130, "bonus": "+30%"},
        {"price": "100 USD", "points": 280, "bonus": "+40%"}
    ]

def get_premium_status(db: Session, account_id: int):
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        return None
    
    return {
        "premium_points": account.premium_points or 0,
        "premium_ends_at": account.premium_ends_at,
        "is_premium": account.premium_ends_at > int(time.time())
    }
