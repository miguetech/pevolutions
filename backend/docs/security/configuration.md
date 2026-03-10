# ⚙️ Configuración de Seguridad

## Variables de Entorno

### Archivo .env

```env
# Base de datos
DATABASE_URL=mysql+pymysql://root:123456@localhost:3306/Pevolutions

# Seguridad JWT
SECRET_KEY=tu_clave_secreta_super_segura_de_al_menos_32_caracteres
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Aplicación
FRONTEND_URL=http://localhost:3000
HOST=0.0.0.0
PORT=8000
DEBUG=True
```

---

## SECRET_KEY

### ¿Qué es?

Clave secreta usada para firmar los tokens JWT. **Nunca debe ser compartida o subida a git.**

### Generar SECRET_KEY

**Opción 1: OpenSSL**
```bash
openssl rand -hex 32
```

**Opción 2: Python**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

**Resultado:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

### Requisitos

- **Mínimo 32 caracteres** (256 bits)
- **Aleatorio** (no usar palabras o patrones)
- **Único por proyecto**
- **Secreto** (no compartir, no subir a git)

---

## ALGORITHM

Algoritmo de firma JWT.

```env
ALGORITHM=HS256
```

**Opciones:**
- `HS256` - HMAC con SHA-256 (recomendado, simétrico)
- `HS384` - HMAC con SHA-384
- `HS512` - HMAC con SHA-512
- `RS256` - RSA con SHA-256 (asimétrico, más complejo)

**Recomendación:** Usar `HS256` para la mayoría de casos.

---

## ACCESS_TOKEN_EXPIRE_MINUTES

Tiempo de vida del token en minutos.

```env
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Recomendaciones:**

| Tiempo | Seguridad | Experiencia | Uso |
|--------|-----------|-------------|-----|
| 5 min | ⭐⭐⭐⭐⭐ | ⭐ | APIs críticas |
| 15 min | ⭐⭐⭐⭐ | ⭐⭐ | Alta seguridad |
| 30 min | ⭐⭐⭐ | ⭐⭐⭐ | **Balance (recomendado)** |
| 60 min | ⭐⭐ | ⭐⭐⭐⭐ | Aplicaciones internas |
| 24 horas | ⭐ | ⭐⭐⭐⭐⭐ | No recomendado |

**Regla:** Más corto = más seguro, pero más logins

---

## Configuración en Código

### app/config.py

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    FRONTEND_URL: str
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True

    class Config:
        env_file = ".env"

settings = Settings()
```

### Uso

```python
from app.config import settings

# Crear token
token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

# Decodificar token
payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

# Tiempo de expiración
expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
```

---

## Seguridad del .env

### ✅ Buenas Prácticas

1. **Nunca subir .env a git**
```bash
# .gitignore
.env
*.env
```

2. **Crear .env.example**
```env
# .env.example (sin valores reales)
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/database
SECRET_KEY=generate_with_openssl_rand_hex_32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

3. **Diferentes .env por entorno**
```
.env.development
.env.staging
.env.production
```

4. **Permisos restrictivos**
```bash
chmod 600 .env
```

---

## Entornos

### Desarrollo
```env
DEBUG=True
SECRET_KEY=dev_key_not_for_production
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Producción
```env
DEBUG=False
SECRET_KEY=<clave_super_segura_generada>
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## CORS (Frontend)

Si el frontend está en otro dominio:

```python
# app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],  # http://localhost:3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Verificar Configuración

```python
# test_config.py
from app.config import settings

print(f"SECRET_KEY length: {len(settings.SECRET_KEY)}")
print(f"Algorithm: {settings.ALGORITHM}")
print(f"Token expires in: {settings.ACCESS_TOKEN_EXPIRE_MINUTES} minutes")

# Verificar que SECRET_KEY no sea la de ejemplo
if "example" in settings.SECRET_KEY.lower():
    print("⚠️  WARNING: Using example SECRET_KEY!")
```

---

## Rotación de SECRET_KEY

Si necesitas cambiar la SECRET_KEY:

1. **Todos los tokens existentes se invalidan**
2. Usuarios deben hacer login nuevamente
3. Planificar en horario de bajo tráfico

```bash
# Generar nueva clave
NEW_KEY=$(openssl rand -hex 32)

# Actualizar .env
sed -i "s/SECRET_KEY=.*/SECRET_KEY=$NEW_KEY/" .env

# Reiniciar servidor
systemctl restart pevolutions-api
```

---

## Checklist de Seguridad

- [ ] SECRET_KEY tiene al menos 32 caracteres
- [ ] SECRET_KEY es aleatorio (no palabras)
- [ ] .env está en .gitignore
- [ ] Permisos de .env son 600
- [ ] DEBUG=False en producción
- [ ] ACCESS_TOKEN_EXPIRE_MINUTES es razonable (15-30 min)
- [ ] CORS configurado correctamente
- [ ] .env.example creado (sin valores reales)

---

## Troubleshooting

### Error: "SECRET_KEY not found"
```bash
# Verificar que .env existe
ls -la .env

# Verificar contenido
cat .env | grep SECRET_KEY
```

### Error: "Token signature invalid"
```bash
# Verificar que SECRET_KEY es la misma en toda la app
python -c "from app.config import settings; print(settings.SECRET_KEY)"
```

### Tokens expiran muy rápido
```bash
# Aumentar tiempo de expiración
# .env
ACCESS_TOKEN_EXPIRE_MINUTES=60
```
