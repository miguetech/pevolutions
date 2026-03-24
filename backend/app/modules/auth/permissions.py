from functools import wraps
from fastapi import HTTPException, status
from .roles import AccountRole

def require_role(min_role: AccountRole):
    """Decorator to require minimum role level for endpoint access"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Get current_account from kwargs
            current_account = kwargs.get('current_account')
            if not current_account:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            if current_account.role < min_role:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Insufficient permissions"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator
