# 🔄 Flujo de Autenticación

## Flujo Completo

```
┌─────────────────────────────────────────────────────────────┐
│ 1. REGISTRO                                                 │
├─────────────────────────────────────────────────────────────┤
│ Cliente → POST /api/auth/register                           │
│           {name, password, email}                           │
│                                                             │
│ Servidor → bcrypt.hash(password)                            │
│         → Guardar en BD                                     │
│         → Retornar {id, name, email}                        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. LOGIN                                                    │
├─────────────────────────────────────────────────────────────┤
│ Cliente → POST /api/auth/login                              │
│           {name, password}                                  │
│                                                             │
│ Servidor → Buscar cuenta en BD                              │
│         → bcrypt.verify(password, hash)                     │
│         → create_access_token({sub: name})                  │
│         → Retornar {access_token, token_type}               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. REQUEST PROTEGIDO                                        │
├─────────────────────────────────────────────────────────────┤
│ Cliente → GET /api/players/                                 │
│           Authorization: Bearer <token>                     │
│                                                             │
│ Servidor → OAuth2PasswordBearer extrae token                │
│         → jwt.decode(token, SECRET_KEY)                     │
│         → Buscar cuenta en BD                               │
│         → Inyectar current_account                          │
│         → Ejecutar endpoint                                 │
│         → Retornar datos                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Registro

### Request
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "usuario",
  "password": "contraseña123",
  "email": "usuario@example.com"
}
```

### Proceso Interno
```python
1. Validar datos (email válido, username único)
2. password_hash = bcrypt.hashpw(password, bcrypt.gensalt())
3. account = Account(name, password_hash, email)
4. db.add(account)
5. db.commit()
```

### Response
```json
{
  "id": 1,
  "name": "usuario",
  "email": "usuario@example.com",
  "creation": "2026-03-10T12:00:00"
}
```

---

## 2. Login

### Request
```http
POST /api/auth/login
Content-Type: application/json

{
  "name": "usuario",
  "password": "contraseña123"
}
```

### Proceso Interno
```python
1. account = get_account_by_name(db, name)
2. if not account:
       raise HTTPException(401, "Invalid credentials")
3. if not bcrypt.checkpw(password, account.password):
       raise HTTPException(401, "Invalid credentials")
4. token = create_access_token({"sub": account.name})
5. return {"access_token": token, "token_type": "bearer"}
```

### Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

## 3. Request Protegido

### Request
```http
GET /api/players/
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Proceso Interno
```python
1. OAuth2PasswordBearer extrae token del header
2. payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
3. username = payload.get("sub")
4. account = get_account_by_name(db, username)
5. if not account:
       raise HTTPException(401)
6. current_account = account  # Inyectado en endpoint
7. players = get_account_players(db, current_account.id)
8. return players
```

### Response
```json
[
  {
    "id": 1,
    "name": "Player1",
    "level": 10,
    "vocation": 1
  }
]
```

---

## Diagrama de Secuencia

```
Cliente                 API                    Base de Datos
  │                      │                           │
  │──── REGISTRO ────────>│                           │
  │  {name, password}    │                           │
  │                      │──── hash password         │
  │                      │──── INSERT account ──────>│
  │                      │<──── account_id ──────────│
  │<──── {id, name} ─────│                           │
  │                      │                           │
  │──── LOGIN ───────────>│                           │
  │  {name, password}    │──── SELECT account ──────>│
  │                      │<──── account ─────────────│
  │                      │──── verify password       │
  │                      │──── create JWT token      │
  │<──── {token} ────────│                           │
  │                      │                           │
  │──── GET /players/ ───>│                           │
  │  Bearer <token>      │──── decode token          │
  │                      │──── SELECT account ──────>│
  │                      │<──── account ─────────────│
  │                      │──── SELECT players ──────>│
  │                      │<──── players ─────────────│
  │<──── [players] ──────│                           │
```

---

## Casos de Error

### Error 401: Credenciales Inválidas (Login)
```json
{
  "detail": "Invalid credentials"
}
```

**Causas:**
- Usuario no existe
- Contraseña incorrecta

### Error 401: Token Inválido
```json
{
  "detail": "Could not validate credentials"
}
```

**Causas:**
- Token ausente
- Token expirado
- Token modificado
- Usuario eliminado

### Error 403: Sin Permisos
```json
{
  "detail": "Not authorized"
}
```

**Causas:**
- Intentar modificar recursos de otro usuario

---

## Ejemplo Completo con curl

```bash
# 1. Registro
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"testuser","password":"test123","email":"test@test.com"}'

# 2. Login (guardar token)
TOKEN=$(curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"name":"testuser","password":"test123"}' \
  | jq -r '.access_token')

# 3. Request protegido
curl http://localhost:8000/api/players/ \
  -H "Authorization: Bearer $TOKEN"
```

---

## Ejemplo con JavaScript (Frontend)

```javascript
// 1. Registro
const register = async () => {
  const response = await fetch('http://localhost:8000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'usuario',
      password: 'contraseña123',
      email: 'usuario@example.com'
    })
  });
  const data = await response.json();
  console.log('Registrado:', data);
};

// 2. Login
const login = async () => {
  const response = await fetch('http://localhost:8000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'usuario',
      password: 'contraseña123'
    })
  });
  const data = await response.json();
  
  // Guardar token
  localStorage.setItem('token', data.access_token);
  console.log('Token guardado');
};

// 3. Request protegido
const getPlayers = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:8000/api/players/', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const players = await response.json();
  console.log('Mis jugadores:', players);
};
```

---

## Tiempo de Vida del Token

```
Login → Token creado (exp: now + 30 min)
  ↓
Requests válidos durante 30 minutos
  ↓
Token expira → 401 Unauthorized
  ↓
Login nuevamente → Nuevo token
```

**Recomendación:** Implementar refresh tokens para sesiones largas (ver jwt.md)
