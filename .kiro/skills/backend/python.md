# Python Best Practices

## Code Style

### PEP 8 Compliance
- Use 4 spaces for indentation (never tabs)
- Maximum line length: 88 characters (Black formatter standard)
- Use snake_case for functions and variables
- Use PascalCase for classes
- Use UPPER_CASE for constants

### Naming Conventions
```python
# Good
def calculate_user_score(user_id: int) -> float:
    MAX_SCORE = 100
    user_data = get_user(user_id)
    return user_data.score / MAX_SCORE

class UserRepository:
    pass
```

## Type Hints

### Always Use Type Hints
```python
# Required for all function signatures
def get_user(user_id: int) -> User | None:
    pass

def process_items(items: list[str]) -> dict[str, int]:
    pass

# Use Optional for nullable values
from typing import Optional
def find_user(email: str) -> Optional[User]:
    pass
```

### Complex Types
```python
from typing import TypedDict, Literal

class UserDict(TypedDict):
    id: int
    name: str
    email: str

Status = Literal["active", "inactive", "pending"]
```

## Docstrings

### Use Google Style
```python
def authenticate_user(username: str, password: str) -> User | None:
    """Authenticate user with credentials.
    
    Args:
        username: User's username or email
        password: Plain text password to verify
        
    Returns:
        User object if authentication successful, None otherwise
        
    Raises:
        DatabaseError: If database connection fails
    """
    pass
```

## Error Handling

### Custom Exceptions
```python
class AuthenticationError(Exception):
    """Raised when authentication fails."""
    pass

class ValidationError(Exception):
    """Raised when data validation fails."""
    def __init__(self, field: str, message: str):
        self.field = field
        self.message = message
        super().__init__(f"{field}: {message}")
```

### Proper Exception Handling
```python
# Good - specific exceptions
try:
    user = authenticate(username, password)
except AuthenticationError as e:
    logger.warning(f"Auth failed: {e}")
    raise HTTPException(status_code=401, detail="Invalid credentials")
except DatabaseError as e:
    logger.error(f"DB error: {e}")
    raise HTTPException(status_code=500, detail="Service unavailable")

# Avoid bare except
# Bad
try:
    do_something()
except:  # Never do this
    pass
```

## Context Managers

### Always Use for Resources
```python
# Database sessions
with SessionLocal() as db:
    user = db.query(User).first()

# File operations
with open("file.txt", "r") as f:
    content = f.read()
```

## List Comprehensions

### Use When Appropriate
```python
# Good - simple transformations
active_users = [u for u in users if u.is_active]
user_ids = [u.id for u in users]

# Bad - too complex, use regular loop
# Avoid nested comprehensions with multiple conditions
```

## Best Practices

1. **Avoid mutable default arguments**
```python
# Bad
def add_item(item, items=[]):
    items.append(item)
    return items

# Good
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```

2. **Use pathlib for file paths**
```python
from pathlib import Path

config_path = Path(__file__).parent / "config.json"
```

3. **Use enumerate instead of range(len())**
```python
# Good
for i, item in enumerate(items):
    print(f"{i}: {item}")

# Bad
for i in range(len(items)):
    print(f"{i}: {items[i]}")
```

4. **Use f-strings for formatting**
```python
# Good
message = f"User {user.name} has {user.score} points"

# Avoid
message = "User {} has {} points".format(user.name, user.score)
```
