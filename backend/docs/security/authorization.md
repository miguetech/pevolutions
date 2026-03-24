# 🛡️ Autorización y Permisos

## Concepto

**Autenticación** ≠ **Autorización**

- **Autenticación**: ¿Quién eres? (Login)
- **Autorización**: ¿Qué puedes hacer? (Permisos)

---

## Niveles de Autorización

### Nivel 1: Usuario Autenticado

Solo verifica que el usuario tenga un token válido.

```python
@router.get("/api/account/stats")
def get_stats(current_account = Depends(get_current_account)):
    # Cualquier usuario autenticado puede ver sus propias stats
    return repository.get_account_stats(db, current_account.id)
```

### Nivel 2: Propietario del Recurso

Verifica que el recurso pertenezca al usuario.

```python
@router.put("/api/players/{player_name}")
def update_player(
    player_name: str,
    player_update: schemas.PlayerUpdate,
    db: Session = Depends(get_db),
    current_account = Depends(get_current_account)
):
    # 1. Buscar jugador
    db_player = repository.get_player_by_name(db, player_name)
    if not db_player:
        raise HTTPException(404, "Player not found")
    
    # 2. Verificar propiedad
    if db_player.account_id != current_account.id:
        raise HTTPException(403, "Not authorized to update this player")
    
    # 3. Actualizar
    return repository.update_player(db, db_player, player_update)
```

---

## Códigos de Estado HTTP

| Código | Significado | Cuándo usar |
|--------|-------------|-------------|
| **401** | Unauthorized | Token inválido o ausente |
| **403** | Forbidden | Token válido pero sin permisos |
| **404** | Not Found | Recurso no existe |

---

## Patrón de Verificación

```python
# 1. Autenticación (automática con Depends)
current_account = Depends(get_current_account)

# 2. Buscar recurso
resource = repository.get_resource(db, resource_id)
if not resource:
    raise HTTPException(404, "Resource not found")

# 3. Autorización
if resource.account_id != current_account.id:
    raise HTTPException(403, "Not authorized")

# 4. Acción
return repository.update_resource(db, resource, data)
```

---

## Ejemplos por Endpoint

### GET /api/players/ (Mis jugadores)
```python
# Solo autenticación
def get_my_players(current_account = Depends(get_current_account)):
    return repository.get_account_players(db, current_account.id)
```

### PUT /api/players/{name} (Actualizar jugador)
```python
# Autenticación + Autorización
def update_player(player_name: str, current_account = Depends(get_current_account)):
    player = repository.get_player_by_name(db, player_name)
    
    # Verificar propiedad
    if player.account_id != current_account.id:
        raise HTTPException(403, "Not your player")
    
    return repository.update_player(db, player, data)
```

### DELETE /api/players/{name} (Eliminar jugador)
```python
# Autenticación + Autorización
def delete_player(player_name: str, current_account = Depends(get_current_account)):
    player = repository.get_player_by_name(db, player_name)
    
    # Verificar propiedad
    if player.account_id != current_account.id:
        raise HTTPException(403, "Cannot delete other players")
    
    repository.delete_player(db, player)
    return {"message": "Player deleted"}
```

---

## Autorización Avanzada (Opcional)

### Roles y Permisos

```python
# Modelo
class Account(Base):
    id = Column(Integer, primary_key=True)
    name = Column(String)
    role = Column(String, default="user")  # user, admin, moderator

# Dependencia
def get_admin_account(current_account = Depends(get_current_account)):
    if current_account.role != "admin":
        raise HTTPException(403, "Admin access required")
    return current_account

# Endpoint
@router.delete("/api/players/{name}/admin")
def admin_delete_player(
    player_name: str,
    admin = Depends(get_admin_account)  # ← Solo admins
):
    repository.delete_player(db, player_name)
    return {"message": "Player deleted by admin"}
```

---

## Mejores Prácticas

### ✅ Siempre verificar propiedad
```python
if resource.account_id != current_account.id:
    raise HTTPException(403)
```

### ✅ Usar 403 para falta de permisos
```python
raise HTTPException(403, "Not authorized")
```

### ✅ Usar 404 si el recurso no existe
```python
if not resource:
    raise HTTPException(404, "Not found")
```

### ❌ No revelar información sensible
```python
# MAL
raise HTTPException(403, "Player belongs to user ID 123")

# BIEN
raise HTTPException(403, "Not authorized")
```

---

## Resumen

```
┌─────────────────────────────────────────────────────────────┐
│ ENDPOINT PÚBLICO                                            │
│ • No requiere token                                         │
│ • Cualquiera puede acceder                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ENDPOINT AUTENTICADO                                        │
│ • Requiere token válido                                     │
│ • Acceso a recursos propios                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ENDPOINT AUTORIZADO                                         │
│ • Requiere token válido                                     │
│ • Verifica propiedad del recurso                            │
│ • 403 si no es el propietario                               │
└─────────────────────────────────────────────────────────────┘
```
