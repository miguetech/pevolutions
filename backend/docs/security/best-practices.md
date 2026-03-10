# ✨ Mejores Prácticas y Troubleshooting

## Mejores Prácticas

### 🔒 Contraseñas

✅ **Hacer:**
- Usar bcrypt para hashear
- Nunca guardar en texto plano
- Validar longitud mínima (8+ caracteres)
- Requerir complejidad (mayúsculas, números, símbolos)

❌ **No hacer:**
- Guardar contraseñas en logs
- Enviar contraseñas por email
- Usar MD5 o SHA256 para contraseñas
- Permitir contraseñas débiles

```python
# ✅ BIEN
password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

# ❌ MAL
password_plain = "test123"  # Nunca guardar así
```

---

### 🎫 Tokens JWT

✅ **Hacer:**
- Usar HTTPS en producción
- Expiración corta (15-30 min)
- Guardar SECRET_KEY en variables de entorno
- Verificar firma y expiración

❌ **No hacer:**
- Incluir datos sensibles en el payload
- Usar tokens sin expiración
- Compartir SECRET_KEY
- Guardar tokens en cookies sin httpOnly

```python
# ✅ BIEN
{"sub": "username", "exp": 1773160800}

# ❌ MAL
{"sub": "username", "password": "test123", "credit_card": "1234"}
```

---

### 🔐 Endpoints

✅ **Hacer:**
- Proteger endpoints sensibles
- Verificar propiedad de recursos
- Usar códigos HTTP correctos (401, 403, 404)
- Validar datos de entrada

❌ **No hacer:**
- Confiar en datos del cliente
- Revelar información sensible en errores
- Permitir acceso sin validación

```python
# ✅ BIEN
if player.account_id != current_account.id:
    raise HTTPException(403, "Not authorized")

# ❌ MAL
if player.account_id != current_account.id:
    raise HTTPException(403, f"Player belongs to account {player.account_id}")
```

---

### 🌐 CORS

✅ **Hacer:**
- Especificar orígenes permitidos
- Usar allow_credentials=True para cookies
- Restringir en producción

❌ **No hacer:**
- Usar allow_origins=["*"] en producción
- Permitir todos los métodos sin necesidad

```python
# ✅ BIEN (Producción)
allow_origins=["https://mifrontend.com"]

# ⚠️ OK (Desarrollo)
allow_origins=["http://localhost:3000"]

# ❌ MAL (Producción)
allow_origins=["*"]
```

---

## Troubleshooting

### 🔴 Error: "Could not validate credentials"

**Síntomas:**
```json
{
  "detail": "Could not validate credentials"
}
```

**Causas posibles:**

1. **Token ausente**
```bash
# ❌ Sin header
curl http://localhost:8000/api/players/

# ✅ Con header
curl http://localhost:8000/api/players/ \
  -H "Authorization: Bearer <token>"
```

2. **Token expirado**
```bash
# Verificar expiración
python -c "
import jwt
token = 'tu_token'
payload = jwt.decode(token, options={'verify_signature': False})
print(f'Expira: {payload[\"exp\"]}')
"
```

**Solución:** Hacer login nuevamente

3. **SECRET_KEY incorrecta**
```bash
# Verificar SECRET_KEY
python -c "from app.config import settings; print(settings.SECRET_KEY)"
```

**Solución:** Usar la misma SECRET_KEY en toda la app

4. **Token mal formado**
```bash
# ❌ Sin "Bearer"
Authorization: eyJhbGciOiJIUzI1NiIs...

# ✅ Con "Bearer"
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

### 🔴 Error: "Invalid credentials" (Login)

**Síntomas:**
```json
{
  "detail": "Invalid credentials"
}
```

**Causas:**

1. **Usuario no existe**
```bash
# Verificar en BD
mysql -u root -p Pevolutions -e "SELECT name FROM accounts WHERE name='usuario';"
```

2. **Contraseña incorrecta**
```python
# Verificar hash
import bcrypt
password = "test123"
hash_from_db = "$2b$12$..."
is_valid = bcrypt.checkpw(password.encode(), hash_from_db.encode())
print(f"Válido: {is_valid}")
```

---

### 🔴 Error: "Not authorized" (403)

**Síntomas:**
```json
{
  "detail": "Not authorized"
}
```

**Causa:** Intentando modificar recursos de otro usuario

**Solución:** Solo puedes modificar tus propios recursos

```bash
# ✅ Mi jugador
curl -X PUT http://localhost:8000/api/players/MyPlayer \
  -H "Authorization: Bearer <token>"

# ❌ Jugador de otro
curl -X PUT http://localhost:8000/api/players/OtherPlayer \
  -H "Authorization: Bearer <token>"
```

---

### 🔴 Error: CORS

**Síntomas:**
```
Access to fetch at 'http://localhost:8000/api/players/' from origin 
'http://localhost:3000' has been blocked by CORS policy
```

**Solución:**
```python
# app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### 🔴 Error: "Token signature invalid"

**Causa:** SECRET_KEY diferente entre creación y validación

**Solución:**
```bash
# Verificar que SECRET_KEY es la misma
grep SECRET_KEY .env

# Reiniciar servidor después de cambiar .env
pkill -f uvicorn
uvicorn app.main:app --reload
```

---

### 🔴 Tokens expiran muy rápido

**Solución:**
```env
# .env
ACCESS_TOKEN_EXPIRE_MINUTES=60  # Aumentar a 60 minutos
```

**Alternativa:** Implementar refresh tokens (ver jwt.md)

---

## Debugging

### Ver contenido del token

```python
import jwt

token = "eyJhbGciOiJIUzI1NiIs..."
payload = jwt.decode(token, options={"verify_signature": False})
print(payload)
# {'sub': 'username', 'exp': 1773160800}
```

### Verificar hash de contraseña

```python
import bcrypt

password = "test123"
hash_from_db = "$2b$12$..."

is_valid = bcrypt.checkpw(password.encode(), hash_from_db.encode())
print(f"Contraseña válida: {is_valid}")
```

### Probar endpoint con curl

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"name":"testuser","password":"test123"}' \
  | jq -r '.access_token')

# 2. Usar token
curl http://localhost:8000/api/players/ \
  -H "Authorization: Bearer $TOKEN"
```

---

## Checklist de Seguridad

### Desarrollo
- [ ] .env configurado correctamente
- [ ] SECRET_KEY generada aleatoriamente
- [ ] Contraseñas hasheadas con bcrypt
- [ ] Tokens con expiración
- [ ] CORS configurado para localhost

### Producción
- [ ] DEBUG=False
- [ ] SECRET_KEY única y segura (32+ caracteres)
- [ ] HTTPS habilitado
- [ ] CORS restringido a dominio específico
- [ ] ACCESS_TOKEN_EXPIRE_MINUTES razonable (15-30 min)
- [ ] .env no subido a git
- [ ] Logs no contienen contraseñas o tokens
- [ ] Rate limiting implementado (opcional)

---

## Herramientas Útiles

### jwt.io
Decodificar y verificar tokens: https://jwt.io/

### Postman / Thunder Client
Probar endpoints con autenticación

### curl
```bash
# Login y guardar token
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"name":"user","password":"pass"}' \
  | jq -r '.access_token')

# Usar token
curl http://localhost:8000/api/players/ \
  -H "Authorization: Bearer $TOKEN"
```

---

## Referencias

- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **JWT Best Practices:** https://tools.ietf.org/html/rfc8725
- **FastAPI Security:** https://fastapi.tiangolo.com/tutorial/security/
- **bcrypt:** https://github.com/pyca/bcrypt/
