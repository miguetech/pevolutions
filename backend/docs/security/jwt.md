# 🎫 JWT - JSON Web Tokens

## Ubicación
`app/shared/auth/jwt.py`

---

## ¿Qué es JWT?

Token firmado digitalmente que contiene información del usuario:
- **Stateless** → No se guarda en servidor
- **Firmado** → No se puede modificar sin invalidar
- **Temporal** → Expira automáticamente

---

## Estructura de un JWT

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VybmFtZSIsImV4cCI6MTc3MzE2MDgwMH0.signature
│                                      │                                        │
└─ Header (algoritmo)                  └─ Payload (datos)                      └─ Signature (firma)
```

### Decodificado:

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "sub": "username",
  "exp": 1773160800
}
```

**Signature:**
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  SECRET_KEY
)
```

---

## Implementación

```python
from jose import jwt
from datetime import datetime, timedelta
from ...config import settings

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    return encoded_jwt
```

---

## Uso en la API

### 1. Generar Token (Login)

```python
# app/modules/auth/router.py
from datetime import timedelta
from ...shared.auth.jwt import create_access_token
from ...config import settings

@router.post("/login")
def login(credentials: LoginRequest, db: Session):
    # Verificar credenciales
    account = get_account_by_name(db, credentials.name)
    if not account or not verify_password(credentials.password, account.password):
        raise HTTPException(401, "Invalid credentials")
    
    # Crear token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": account.name},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

### 2. Usar Token (Request)

```bash
curl http://localhost:8000/api/players/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

## Campos del Token

### Campo `sub` (Subject)
Identifica al usuario:
```python
{"sub": "username"}
```

### Campo `exp` (Expiration)
Timestamp UNIX de expiración:
```python
{"exp": 1773160800}  # 2026-03-10 12:00:00 UTC
```

### Campos Opcionales
```python
{
  "sub": "username",
  "exp": 1773160800,
  "iat": 1773159000,  # Issued At (cuándo se creó)
  "jti": "unique-id",  # JWT ID (identificador único)
  "role": "admin"      # Datos personalizados
}
```

---

## Configuración

### Variables de Entorno (.env)

```env
SECRET_KEY=tu_clave_secreta_super_segura_de_al_menos_32_caracteres
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Generar SECRET_KEY

```bash
# Opción 1: OpenSSL
openssl rand -hex 32

# Opción 2: Python
python -c "import secrets; print(secrets.token_hex(32))"
```

**Resultado:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

---

## Seguridad

### ✅ Ventajas

1. **Stateless**: No requiere almacenamiento en servidor
2. **Escalable**: Funciona en múltiples servidores
3. **Portable**: Se puede usar en diferentes dominios
4. **Autocontenido**: Incluye toda la información necesaria

### ⚠️ Consideraciones

1. **No se puede revocar**: Una vez emitido, es válido hasta que expire
2. **Tamaño**: Más grande que un session ID simple
3. **Datos visibles**: El payload NO está encriptado (solo firmado)

### 🔒 Mejores Prácticas

```python
# ✅ BIEN: Datos no sensibles
{"sub": "username", "exp": 1773160800}

# ❌ MAL: Datos sensibles
{"sub": "username", "password": "test123", "credit_card": "1234"}
```

**Regla:** Solo incluir datos que puedan ser públicos (el token puede ser decodificado)

---

## Expiración

### Tiempo de Vida

```python
# Corto (15 min) - Más seguro
timedelta(minutes=15)

# Medio (30 min) - Balance
timedelta(minutes=30)  # ← Usado en la API

# Largo (24 horas) - Menos seguro
timedelta(hours=24)
```

### Verificación Automática

```python
# app/dependencies.py
try:
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    # Si el token expiró, jwt.decode() lanza JWTError automáticamente
except JWTError:
    raise HTTPException(401, "Token expired or invalid")
```

---

## Debugging

### Decodificar Token (sin verificar)

```python
import jwt

token = "eyJhbGciOiJIUzI1NiIs..."
payload = jwt.decode(token, options={"verify_signature": False})
print(payload)
# {'sub': 'username', 'exp': 1773160800}
```

### Verificar Token Manualmente

```python
from jose import jwt, JWTError

token = "eyJhbGciOiJIUzI1NiIs..."
secret_key = "tu_secret_key"

try:
    payload = jwt.decode(token, secret_key, algorithms=["HS256"])
    print(f"Token válido: {payload}")
except JWTError as e:
    print(f"Token inválido: {e}")
```

### Ver Expiración

```python
from datetime import datetime

payload = jwt.decode(token, options={"verify_signature": False})
exp_timestamp = payload["exp"]
exp_datetime = datetime.fromtimestamp(exp_timestamp)

print(f"Expira: {exp_datetime}")
# Expira: 2026-03-10 12:00:00
```

---

## Herramientas Online

### jwt.io
Decodificar y verificar tokens: https://jwt.io/

**Ejemplo:**
1. Pega tu token
2. Ve el header y payload decodificados
3. Verifica la firma con tu SECRET_KEY

---

## Errores Comunes

### ❌ Token sin "Bearer"
```python
# MAL
headers = {"Authorization": "eyJhbGciOiJIUzI1NiIs..."}
```

### ✅ Token con "Bearer"
```python
# BIEN
headers = {"Authorization": "Bearer eyJhbGciOiJIUzI1NiIs..."}
```

### ❌ SECRET_KEY en código
```python
# MAL
SECRET_KEY = "mi_clave_secreta"
```

### ✅ SECRET_KEY en .env
```python
# BIEN
from .config import settings
SECRET_KEY = settings.SECRET_KEY
```

---

## Refresh Tokens (Opcional)

Para sesiones más largas sin comprometer seguridad:

```python
# Access Token: 15 minutos
access_token = create_access_token({"sub": username}, timedelta(minutes=15))

# Refresh Token: 7 días
refresh_token = create_access_token({"sub": username, "type": "refresh"}, timedelta(days=7))
```

**Flujo:**
1. Login → Retorna access_token + refresh_token
2. Access token expira → Usar refresh_token para obtener nuevo access_token
3. Refresh token expira → Hacer login nuevamente

---

## Referencias

- **JWT.io:** https://jwt.io/
- **RFC 7519:** https://tools.ietf.org/html/rfc7519
- **python-jose:** https://github.com/mpdavis/python-jose
