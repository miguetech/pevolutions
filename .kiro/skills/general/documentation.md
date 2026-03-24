# Documentation Standards

## README Structure

### Project README
```markdown
# Project Name

Brief description of what the project does.

## Features

- Feature 1
- Feature 2
- Feature 3

## Tech Stack

**Backend:**
- FastAPI
- SQLAlchemy
- MySQL

**Frontend:**
- Astro
- React
- TypeScript
- Tailwind CSS

## Prerequisites

- Python 3.11+
- Node.js 18+
- MySQL 8.0+

## Installation

### Backend Setup

1. Create virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. Run migrations:
   ```bash
   alembic upgrade head
   ```

5. Start server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start dev server:
   ```bash
   npm run dev
   ```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing

### Backend Tests
```bash
cd backend
pytest
pytest --cov=app  # With coverage
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Project Structure

```
project/
├── backend/     # FastAPI backend
├── frontend/    # Astro frontend
└── README.md
```

## Environment Variables

See `.env.example` files in backend and frontend directories.

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

[Your License]
```

## Code Comments

### When to Comment
```python
# Good - explain WHY, not WHAT
def calculate_score(user_id: int) -> float:
    # Use weighted average to prioritize recent activity
    recent_weight = 0.7
    historical_weight = 0.3
    return recent_score * recent_weight + historical_score * historical_weight

# Bad - obvious comment
def get_user(user_id: int):
    # Get user by ID
    return db.query(User).filter(User.id == user_id).first()

# Good - complex logic explanation
def process_payment(amount: float):
    # Apply 2.9% + $0.30 fee (Stripe standard pricing)
    # Round up to nearest cent to avoid fractional cents
    fee = math.ceil((amount * 0.029 + 0.30) * 100) / 100
    return amount + fee
```

### TODO Comments
```python
# TODO: Add caching for frequently accessed users
# FIXME: Handle edge case when user has no email
# HACK: Temporary workaround until API v2 is ready
# NOTE: This must run before database migration
```

## Function Documentation

### Python Docstrings
```python
def authenticate_user(email: str, password: str) -> User | None:
    """Authenticate user with email and password.
    
    Args:
        email: User's email address
        password: Plain text password to verify
        
    Returns:
        User object if authentication successful, None otherwise
        
    Raises:
        DatabaseError: If database connection fails
        
    Example:
        >>> user = authenticate_user("john@example.com", "password123")
        >>> print(user.name)
        John Doe
    """
    pass
```

### TypeScript JSDoc
```typescript
/**
 * Fetch user data from API
 * 
 * @param userId - The ID of the user to fetch
 * @returns Promise resolving to User object
 * @throws {Error} If user not found or network error
 * 
 * @example
 * ```typescript
 * const user = await fetchUser(123);
 * console.log(user.name);
 * ```
 */
async function fetchUser(userId: number): Promise<User> {
    // Implementation
}
```

## API Documentation

### OpenAPI/Swagger (FastAPI)
```python
@router.post(
    "/users",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create new user",
    description="Register a new user account with email and password",
    responses={
        201: {"description": "User created successfully"},
        400: {"description": "Invalid input or email already exists"},
        422: {"description": "Validation error"}
    }
)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new user with the following information:
    
    - **username**: Unique username (3-50 characters)
    - **email**: Valid email address
    - **password**: Minimum 8 characters
    """
    pass
```

## Architecture Decision Records (ADRs)

### ADR Template
```markdown
# ADR 001: Use FastAPI for Backend

## Status
Accepted

## Context
We need to choose a Python web framework for our REST API backend.

## Decision
We will use FastAPI instead of Flask or Django.

## Consequences

### Positive
- Automatic OpenAPI documentation
- Built-in data validation with Pydantic
- High performance (async support)
- Modern Python features (type hints)

### Negative
- Smaller ecosystem compared to Django
- Team needs to learn async patterns

## Alternatives Considered
- Flask: More mature but lacks built-in validation
- Django: Too heavy for API-only backend
```

## Changelog

### Keep a Changelog Format
```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- User profile page
- Email verification

### Changed
- Improved error messages

### Fixed
- Login redirect issue

## [1.0.0] - 2024-03-09

### Added
- Initial release
- User authentication
- CRUD operations for users
```

## Best Practices

1. **Keep README up to date** - update when setup changes
2. **Document WHY, not WHAT** - code shows what, comments explain why
3. **Use docstrings** for all public functions and classes
4. **Document complex algorithms** - explain the approach
5. **Keep comments concise** - avoid essay-length explanations
6. **Update docs with code** - don't let them drift apart
7. **Use examples** in documentation
8. **Document environment variables** in .env.example
9. **Maintain changelog** for version tracking
10. **Write ADRs** for important architectural decisions
