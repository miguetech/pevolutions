from pydantic import BaseModel

class ShopPackage(BaseModel):
    price: str
    points: int
    bonus: str

class PremiumStatus(BaseModel):
    premium_points: int
    premium_ends_at: int
    is_premium: bool
