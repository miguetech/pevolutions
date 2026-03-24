# ✅ Validación de Tokens

## Ubicación
`app/dependencies.py`

---

## OAuth2PasswordBearer

FastAPI proporciona `OAuth2PasswordBearer` para extraer y validar tokens automáticamente.

```python
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
```

---

## Implementación

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_account(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        account_name: str = payload.get("sub")
        if account_name is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    account = auth_repo.get_account_by_name(db, name=account_name)
    if account is None:
        raise credentials_exception
    
    return account
```

---

## Proceso de Validación

```
1. EXTRACCIÓN → OAuth2PasswordBearer extrae token del header
2. DECODIFICACIÓN → jwt.decode() verifica firma y expiración
3. EXTRACCIÓN DE DATOS → Obtiene username del campo "sub"
4. VERIFICACIÓN EN BD → Busca cuenta en base de datos
5. INYECCIÓN → Retorna objeto Account al endpoint
```

---

## Uso en Endpoints

### Endpoint Protegido
```python
@router.get("/api/players/")
def get_my_players(
    db: Session = Depends(get_db),
    current_account = Depends(get_current_account)  # ← Validación automática
):
    return repository.get_account_players(db, current_account.id)
```

### Endpoint Público
```python
@router.get("/api/players/online")
def get_online_players(db: Session = Depends(get_db)):
    # No usa get_current_account → No requiere token
    return repository.get_online_players(db)
```

---

## Validaciones Automáticas

1. **Firma Digital** - Verifica que el token no fue modificado
2. **Expiración** - Verifica campo `exp`
3. **Algoritmo** - Solo acepta HS256
4. **Usuario existe** - Verifica en base de datos

---

## Respuesta de Error (401)

```json
{
  "detail": "Could not validate credentials"
}
```

**Causas:**
- Token ausente, inválido o expirado
- Usuario no existe en BD
