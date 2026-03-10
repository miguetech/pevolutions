# API Endpoints - PEvolutions

## Estructura de la Base de Datos

### Tablas Principales
- **accounts**: Cuentas de usuario para login
- **players**: Personajes del juego (cada cuenta puede tener múltiples players)
- **pokemonteam**: Equipo de 6 pokemon por jugador

## Endpoints Implementados

### 1. Autenticación (`/api/auth`)

#### POST `/api/auth/register`
Registrar una nueva cuenta.

**Request:**
```json
{
  "name": "username",
  "password": "password123",
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "username",
  "email": "user@example.com",
  "creation": 1710123456
}
```

#### POST `/api/auth/login`
Iniciar sesión y obtener token JWT.

**Request:**
```json
{
  "name": "username",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 2. Players (`/api/players`)

#### GET `/api/players/`
Obtener todos los personajes de la cuenta autenticada.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "PlayerName",
    "level": 10,
    "vocation": 1,
    "health": 200,
    "healthmax": 200,
    "experience": 5000
  }
]
```

#### POST `/api/players/`
Crear un nuevo personaje.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "name": "NewPlayer",
  "sex": 0
}
```

**Response:**
```json
{
  "id": 2,
  "name": "NewPlayer",
  "level": 1,
  "vocation": 0,
  "health": 150,
  "healthmax": 150,
  "experience": 0
}
```

#### GET `/api/players/{player_name}`
Obtener información de un jugador específico.

**Response:**
```json
{
  "id": 1,
  "name": "PlayerName",
  "level": 10,
  "vocation": 1,
  "health": 200,
  "healthmax": 200,
  "experience": 5000
}
```

#### GET `/api/players/{player_name}/pokemon`
Obtener el equipo pokemon de un jugador.

**Response:**
```json
{
  "name": "PlayerName",
  "pokemon1": 25,
  "pokemon2": 6,
  "pokemon3": 1,
  "pokemon4": null,
  "pokemon5": null,
  "pokemon6": null
}
```

## Flujo de Autenticación

1. **Registro**: `POST /api/auth/register` → Crear cuenta
2. **Login**: `POST /api/auth/login` → Obtener token JWT
3. **Usar token**: Incluir en header `Authorization: Bearer {token}` para endpoints protegidos

## Próximos Endpoints a Implementar

- [ ] Actualizar información del player
- [ ] Gestionar equipo pokemon (agregar/remover)
- [ ] Sistema de inventario
- [ ] Sistema de guilds
- [ ] Ranking de jugadores
- [ ] Estadísticas del jugador

## Iniciar el Servidor

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Probar la API

```bash
# Probar health check
curl http://localhost:8000/health

# Registrar usuario
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"testuser","password":"test123","email":"test@example.com"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"name":"testuser","password":"test123"}'

# Usar el script de prueba
python tests/test_all_endpoints.py
```


### 3. Gestión de Cuenta (`/api/account`)

#### PUT `/api/account/password`
Cambiar contraseña de la cuenta.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "current_password": "oldpass123",
  "new_password": "newpass456"
}
```

**Response:**
```json
{
  "message": "Password updated successfully"
}
```

#### PUT `/api/account/settings`
Actualizar configuración de la cuenta.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "email": "newemail@example.com",
  "flag": "US"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "username",
  "email": "newemail@example.com",
  "creation": 1710123456
}
```

#### GET `/api/account/stats`
Obtener estadísticas de la cuenta.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "total_playing_time": 45000,
  "pokemon_caught": 1240,
  "world_ranking": 4520
}
```

### 4. Jugadores Online (`/api/players/online`)

#### GET `/api/players/online`
Obtener lista de jugadores (público).

**Query Params:**
- `sort_by`: level | captures | fishing_level (default: level)
- `search`: string (filtrar por nombre)
- `limit`: number (default: 50)

**Response:**
```json
[
  {
    "id": 1,
    "name": "Sylarnal",
    "level": 85,
    "vocation": 1,
    "sex": 0,
    "captures": 120,
    "fishing_level": 45
  }
]
```

## Ejemplos de Uso

```bash
# Obtener jugadores online
curl http://localhost:8000/api/players/online?sort_by=level&limit=10

# Cambiar contraseña (requiere token)
curl -X PUT http://localhost:8000/api/account/password \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"current_password":"old123","new_password":"new456"}'

# Obtener estadísticas
curl http://localhost:8000/api/account/stats \
  -H "Authorization: Bearer {token}"
```


## FASE 2 - Gestión Avanzada de Personajes

### PUT `/api/players/{name}`
Actualizar personaje (solo el dueño).

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "level": 50,
  "vocation": 2,
  "health": 500,
  "healthmax": 500
}
```

**Response:**
```json
{
  "id": 1,
  "name": "PlayerName",
  "level": 50,
  "vocation": 2,
  "health": 500,
  "healthmax": 500,
  "experience": 5000
}
```

### DELETE `/api/players/{name}`
Eliminar personaje (solo el dueño).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Player deleted successfully"
}
```

### GET `/api/players/{name}/stats`
Estadísticas detalladas del personaje (público).

**Response:**
```json
{
  "id": 1,
  "name": "PlayerName",
  "level": 85,
  "vocation": 1,
  "experience": 50000,
  "health": 200,
  "healthmax": 200,
  "sex": 0,
  "skill_fishing": 45,
  "onlinetime": 45000,
  "lastlogin": 1710123456,
  "lastlogout": 1710120000,
  "pokemon_count": 3
}
```
