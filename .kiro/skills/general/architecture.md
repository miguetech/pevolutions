# Code Organization & Architecture

## Project Structure

### Backend Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app initialization
│   ├── config.py            # Configuration settings
│   ├── database.py          # Database connection
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── crud.py              # Database operations
│   ├── auth.py              # Authentication logic
│   ├── dependencies.py      # Shared dependencies
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py          # Auth endpoints
│   │   ├── users.py         # User endpoints
│   │   └── posts.py         # Post endpoints
│   ├── services/            # Business logic
│   │   ├── __init__.py
│   │   ├── user_service.py
│   │   └── email_service.py
│   └── utils/               # Utility functions
│       ├── __init__.py
│       └── helpers.py
├── tests/
│   ├── conftest.py
│   ├── test_auth.py
│   └── test_users.py
├── alembic/                 # Database migrations
├── requirements.txt
├── .env
└── README.md
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/             # Basic UI components
│   │   │   ├── Button.tsx
│   │   │   └── Input.tsx
│   │   ├── layout/         # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── features/       # Feature-specific components
│   │       └── UserCard.tsx
│   ├── pages/              # Astro pages
│   │   ├── index.astro
│   │   └── [lang]/
│   │       └── users.astro
│   ├── layouts/            # Page layouts
│   │   └── BaseLayout.astro
│   ├── hooks/              # Custom React hooks
│   │   ├── useFetch.ts
│   │   └── useAuth.ts
│   ├── services/           # API services
│   │   ├── api.ts
│   │   └── auth.ts
│   ├── types/              # TypeScript types
│   │   ├── user.ts
│   │   └── api.ts
│   ├── utils/              # Utility functions
│   │   └── helpers.ts
│   ├── styles/             # Global styles
│   │   └── global.css
│   └── i18n/               # Internationalization
│       ├── ui.ts
│       └── utils.ts
├── public/                 # Static assets
├── tests/
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

## Separation of Concerns

### Backend Layers

**1. Routes (API Layer)**
```python
# app/routers/users.py
from fastapi import APIRouter, Depends
from app.services.user_service import UserService

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/{user_id}")
def get_user(user_id: int, service: UserService = Depends()):
    return service.get_user(user_id)
```

**2. Services (Business Logic)**
```python
# app/services/user_service.py
from app.crud import get_user, create_user
from app.schemas import UserCreate

class UserService:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db
    
    def get_user(self, user_id: int):
        user = get_user(self.db, user_id)
        if not user:
            raise HTTPException(status_code=404)
        return user
    
    def create_user_with_welcome_email(self, user_data: UserCreate):
        user = create_user(self.db, user_data)
        send_welcome_email(user.email)
        return user
```

**3. CRUD (Data Access)**
```python
# app/crud.py
from sqlalchemy.orm import Session
from app.models import User

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user_data: dict):
    user = User(**user_data)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
```

### Frontend Layers

**1. Components (Presentation)**
```typescript
// src/components/UserCard.tsx
interface UserCardProps {
    user: User;
    onEdit: (id: number) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
    return (
        <div>
            <h2>{user.name}</h2>
            <button onClick={() => onEdit(user.id)}>Edit</button>
        </div>
    );
}
```

**2. Hooks (State & Logic)**
```typescript
// src/hooks/useUser.ts
export function useUser(userId: number) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        UserService.getUser(userId)
            .then(setUser)
            .finally(() => setLoading(false));
    }, [userId]);
    
    return { user, loading };
}
```

**3. Services (API Calls)**
```typescript
// src/services/user.ts
export class UserService {
    static async getUser(userId: number): Promise<User> {
        return apiRequest<User>(`/api/users/${userId}`);
    }
    
    static async updateUser(userId: number, data: Partial<User>): Promise<User> {
        return apiRequest<User>(`/api/users/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }
}
```

## Module Boundaries

### Avoid Circular Dependencies
```python
# Bad - circular dependency
# models.py imports crud.py
# crud.py imports models.py

# Good - one-way dependency
# crud.py imports models.py
# models.py doesn't import crud.py
```

### Dependency Direction
```
Routes → Services → CRUD → Models
  ↓         ↓         ↓
Schemas   Utils   Database
```

## Configuration Management

### Environment-Based Config
```python
# app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # Security
    SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # External Services
    SMTP_HOST: str
    SMTP_PORT: int = 587
    
    # Feature Flags
    ENABLE_REGISTRATION: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

### Frontend Config
```typescript
// src/config.ts
const config = {
    apiUrl: import.meta.env.PUBLIC_API_URL || 'http://localhost:8000',
    environment: import.meta.env.MODE,
    features: {
        enableRegistration: import.meta.env.PUBLIC_ENABLE_REGISTRATION === 'true'
    }
};

export default config;
```

## Dependency Injection

### Backend
```python
# app/dependencies.py
from fastapi import Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    # Verify token and return user
    pass
```

### Frontend (Context)
```typescript
// src/contexts/AuthContext.tsx
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be within AuthProvider');
    return context;
}
```

## Best Practices

1. **Single Responsibility** - each module does one thing
2. **DRY (Don't Repeat Yourself)** - extract common logic
3. **Separation of Concerns** - routes, services, data access
4. **Dependency Injection** - for testability and flexibility
5. **Clear naming** - descriptive file and function names
6. **Consistent structure** - follow project conventions
7. **Avoid circular dependencies** - one-way dependency flow
8. **Keep files small** - split large files into modules
9. **Group by feature** - not by file type (when appropriate)
10. **Document architecture** - README with structure explanation
