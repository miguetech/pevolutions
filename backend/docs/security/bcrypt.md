# 🔒 bcrypt - Hashing de Contraseñas

## Ubicación
`app/shared/auth/password.py`

---

## ¿Qué es bcrypt?

Algoritmo de hashing diseñado específicamente para contraseñas:
- **Lento por diseño** → Resistente a fuerza bruta
- **Salt automático** → Cada hash es único
- **Irreversible** → No se puede obtener la contraseña original

---

## Implementación

```python
import bcrypt

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
```

---

## Funcionamiento

### 1. Registro (Crear Hash)
```python
password = "test123"
hash = get_password_hash(password)
# Resultado: "$2b$12$sSEM38RG3dKDa32/gjcM8.WddSBoUjE3DOULPc.Z1nl/6iRrA/kkm"
```

**Estructura del hash:**
```
$2b$12$sSEM38RG3dKDa32/gjcM8.WddSBoUjE3DOULPc.Z1nl/6iRrA/kkm
│  │  │                    │
│  │  │                    └─ Hash (31 chars)
│  │  └─ Salt (22 chars)
│  └─ Cost factor (12 rounds = 2^12 iteraciones)
└─ Algoritmo (2b = bcrypt)
```

### 2. Login (Verificar)
```python
plain_password = "test123"
hash_from_db = "$2b$12$sSEM38RG3dKDa32/gjcM8..."

is_valid = verify_password(plain_password, hash_from_db)
# Resultado: True
```

---

## Características de Seguridad

### Salt Automático
Cada vez que hasheas la misma contraseña, obtienes un hash diferente:

```python
hash1 = get_password_hash("test123")
# $2b$12$abc...

hash2 = get_password_hash("test123")
# $2b$12$xyz...  ← Diferente!
```

Esto previene:
- **Rainbow tables** (tablas precalculadas)
- **Ataques de diccionario** masivos

### Cost Factor (Rounds)
Por defecto usa 12 rounds = 2^12 = 4,096 iteraciones

```python
# Más rounds = más seguro pero más lento
bcrypt.gensalt(rounds=14)  # 16,384 iteraciones
```

**Recomendación:** 12 rounds es el estándar actual (2026)

---

## Uso en la API

### Registro
```python
# app/modules/auth/repository.py
def create_account(db: Session, account: AccountCreate):
    hashed_password = get_password_hash(account.password)
    db_account = Account(
        name=account.name,
        password=hashed_password,  # ← Hash, no texto plano
        email=account.email
    )
    db.add(db_account)
    db.commit()
    return db_account
```

### Login
```python
# app/modules/auth/router.py
def login(credentials: LoginRequest, db: Session):
    account = get_account_by_name(db, credentials.name)
    if not account or not verify_password(credentials.password, account.password):
        raise HTTPException(401, "Invalid credentials")
    
    token = create_access_token({"sub": account.name})
    return {"access_token": token}
```

---

## Ventajas vs Otros Algoritmos

| Algoritmo | Velocidad | Seguridad | Uso |
|-----------|-----------|-----------|-----|
| MD5 | Muy rápido | ❌ Inseguro | Obsoleto |
| SHA256 | Rápido | ⚠️ No diseñado para passwords | Hashing general |
| **bcrypt** | **Lento** | **✅ Muy seguro** | **Contraseñas** |
| Argon2 | Lento | ✅ Muy seguro | Contraseñas (más nuevo) |

**bcrypt es lento intencionalmente** para dificultar ataques de fuerza bruta.

---

## Debugging

### Ver estructura del hash
```python
import bcrypt

password = "test123"
hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
print(hash.decode())
# $2b$12$abc...xyz
```

### Verificar manualmente
```python
import bcrypt

password = "test123"
hash_from_db = "$2b$12$..."

is_valid = bcrypt.checkpw(password.encode(), hash_from_db.encode())
print(f"Password válido: {is_valid}")
```

---

## Errores Comunes

### ❌ Guardar contraseña en texto plano
```python
# MAL
account.password = "test123"
```

### ✅ Hashear antes de guardar
```python
# BIEN
account.password = get_password_hash("test123")
```

### ❌ Comparar hashes directamente
```python
# MAL
if password == account.password:  # Nunca funcionará
```

### ✅ Usar verify_password
```python
# BIEN
if verify_password(password, account.password):
```

---

## Migración desde passlib

Si usabas passlib antes:

```python
# Antes (passlib)
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"])
pwd_context.hash(password)

# Ahora (bcrypt directo)
import bcrypt
bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
```

**Ventaja:** Compatibilidad con Python 3.14+

---

## Referencias

- **Documentación oficial:** https://github.com/pyca/bcrypt/
- **Especificación:** https://en.wikipedia.org/wiki/Bcrypt
- **OWASP Password Storage:** https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
