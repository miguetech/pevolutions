# Arquitectura Backend - PEvolutions

## Patrón: Modular Monolith

El backend utiliza una arquitectura **Modular Monolith** donde cada funcionalidad está organizada en módulos independientes.

---

## Estructura del Proyecto

```
backend/
├── app/
│   ├── main.py              # FastAPI app principal
│   ├── config.py            # Configuración (env vars)
│   ├── database.py          # Conexión SQLAlchemy
│   ├── dependencies.py      # Dependencias compartidas (get_current_account)
│   │
│   ├── modules/             # Módulos de negocio
│   │   ├── auth/
│   │   │   ├── router.py        # Endpoints de autenticación
│   │   │   ├── repository.py    # Operaciones de BD
│   │   │   ├── schemas.py       # Validación Pydantic
│   │   │   ├── models.py        # Modelo Account
│   │   │   └── service.py       # Lógica de negocio
│   │   │
│   │   ├── players/
│   │   │   ├── router.py        # Endpoints de jugadores
│   │   │   ├── repository.py    # Operaciones de BD
│   │   │   ├── schemas.py       # Validación Pydantic
│   │   │   └── models.py        # Modelos Player, PokemonTeam
│   │   │
│   │   ├── account/
│   │   │   ├── router.py        # Endpoints de cuenta
│   │   │   ├── repository.py    # Operaciones de BD
│   │   │   └── schemas.py       # Validación Pydantic
│   │   │
│   │   ├── events/
│   │   │   ├── router.py
│   │   │   ├── repository.py
│   │   │   ├── schemas.py
│   │   │   └── models.py        # Modelo Event
│   │   │
│   │   ├── guilds/
│   │   │   ├── router.py
│   │   │   ├── repository.py
│   │   │   ├── schemas.py
│   │   │   └── models.py        # Modelos Guild, GuildMember
│   │   │
│   │   └── shop/
│   │       ├── router.py
│   │       ├── repository.py
│   │       └── schemas.py
│   │
│   └── shared/              # Código compartido
│       └── auth/
│           ├── password.py      # Hashing con bcrypt
│           └── jwt.py           # Generación de tokens
│
├── tests/                   # Tests automatizados
│   ├── test_all_endpoints.py
│   ├── api-tests.http
│   ├── thunder-collection.json
│   └── quick-test.sh
│
├── docs/                    # Documentación
│   ├── SECURITY.md
│   ├── API_ENDPOINTS.md
│   └── security/
│
├── .env                     # Variables de entorno
├── requirements.txt         # Dependencias Python
└── init_database.py         # Script de inicialización
```

---

## Flujo de Datos

```
┌─────────────┐
│   Cliente   │
│  (Frontend) │
└──────┬──────┘
       │
       │ HTTP Request
       ▼
┌─────────────────────────────────────┐
│         FastAPI (main.py)           │
│  ┌───────────────────────────────┐  │
│  │   CORS Middleware             │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │   Module Routers              │  │
│  │   - /api/auth                 │  │
│  │   - /api/players              │  │
│  │   - /api/account              │  │
│  │   - /api/events               │  │
│  │   - /api/guilds               │  │
│  │   - /api/shop                 │  │
│  └───────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │
               │ Dependencies
               ▼
┌──────────────────────────────────────┐
│      dependencies.py                 │
│  ┌────────────────────────────────┐  │
│  │  get_current_account()         │  │
│  │  - Valida JWT token            │  │
│  │  - Retorna Account actual      │  │
│  └────────────────────────────────┘  │
└──────────────┬───────────────────────┘
               │
               │ Repository Pattern
               ▼
┌──────────────────────────────────────┐
│    modules/*/repository.py           │
│  - Operaciones de base de datos     │
│  - Queries con SQLAlchemy            │
│  - Lógica de acceso a datos          │
└──────────────┬───────────────────────┘
               │
               │ SQLAlchemy ORM
               ▼
┌──────────────────────────────────────┐
│      modules/*/models.py             │
│  - Account (accounts table)          │
│  - Player (players table)            │
│  - PokemonTeam (pokemonteam table)   │
│  - Event (events table)              │
│  - Guild (guilds table)              │
└──────────────┬───────────────────────┘
               │
               │ SQL Queries
               ▼
┌──────────────────────────────────────┐
│      MySQL Database                  │
│      (Pevolutions)                   │
│  - accounts                          │
│  - players                           │
│  - pokemonteam                       │
│  - events                            │
│  - guilds                            │
└──────────────────────────────────────┘
```

---

## Relaciones entre Tablas

```
┌─────────────────┐
│    accounts     │
│─────────────────│
│ id (PK)         │
│ name (unique)   │
│ password        │
│ email           │
│ creation        │
└────────┬────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────┐
│    players      │
│─────────────────│
│ id (PK)         │
│ name (unique)   │
│ account_id (FK) │
│ level           │
│ vocation        │
│ health          │
│ experience      │
└────────┬────────┘
         │
         │ 1:1
         │
         ▼
┌─────────────────┐
│  pokemonteam    │
│─────────────────│
│ name (PK, FK)   │
│ pokemon1        │
│ pokemon2        │
│ pokemon3        │
│ pokemon4        │
│ pokemon5        │
│ pokemon6        │
└─────────────────┘
```

---

## Autenticación JWT

```
1. Usuario hace login
   POST /api/auth/login
   { "name": "user", "password": "pass" }
   
2. Backend valida credenciales
   - modules/auth/repository.py busca account
   - shared/auth/password.py verifica con bcrypt
   
3. Backend genera JWT token
   - shared/auth/jwt.py crea token
   - Payload: { "sub": "username", "exp": timestamp }
   - Firma con SECRET_KEY
   
4. Cliente recibe token
   { "access_token": "eyJ...", "token_type": "bearer" }
   
5. Cliente usa token en requests
   Authorization: Bearer eyJ...
   
6. Backend valida token
   - dependencies.py decodifica JWT
   - Verifica firma y expiración
   - Extrae username
   - Busca account en BD
   - Inyecta current_account en endpoint
```

---

## Niveles de Seguridad

### Nivel 0: Públicos (5 endpoints)
No requieren autenticación
- `GET /api/players/online`
- `GET /api/players/{name}`
- `GET /api/events`
- `GET /api/guilds`
- `GET /api/shop/packages`

### Nivel 1: Autenticados (10 endpoints)
Requieren token JWT válido
- `GET /api/players/` - Mis jugadores
- `POST /api/players/` - Crear jugador
- `GET /api/account/stats`
- `PUT /api/account/password`
- `PUT /api/account/settings`

### Nivel 2: Autorizados (2 endpoints)
Requieren token + verificación de propiedad
- `PUT /api/players/{name}` - Solo si es tuyo
- `DELETE /api/players/{name}` - Solo si es tuyo

**Ver:** `docs/security/endpoint-security.md` para detalles

---

## Variables de Entorno (.env)

```env
# Base de datos
DATABASE_URL=mysql+pymysql://root:123456@localhost:3306/Pevolutions

# Seguridad (generar con: openssl rand -hex 32)
SECRET_KEY=<tu_clave_secreta_aqui>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
FRONTEND_URL=http://localhost:4321

# Servidor
HOST=0.0.0.0
PORT=8000
DEBUG=True
```

**Ver:** `docs/security/configuration.md` para detalles

---

## Dependencias (requirements.txt)

```
fastapi
uvicorn[standard]
sqlalchemy
pymysql
python-jose[cryptography]
bcrypt
python-multipart
pydantic[email]
pydantic-settings
email-validator
requests
```

---

## Ventajas de la Arquitectura Modular

✅ **Separación de responsabilidades** - Cada módulo es independiente  
✅ **Escalabilidad** - Fácil agregar nuevos módulos  
✅ **Mantenibilidad** - Cambios aislados por módulo  
✅ **Testeable** - Tests por módulo  
✅ **Reutilizable** - Código compartido en shared/  

**Ver:** `docs/architecture/MODULAR_MONOLITH.md` para detalles
