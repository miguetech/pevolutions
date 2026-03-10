# 🎯 Seguridad por Endpoint

## Clasificación de Endpoints

### 🌐 Nivel 0: Públicos (5 endpoints)

No requieren autenticación. Cualquiera puede acceder.

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/players/online` | GET | Lista de jugadores online |
| `/api/players/{name}` | GET | Ver perfil público de jugador |
| `/api/events` | GET | Eventos activos |
| `/api/guilds` | GET | Lista de guilds |
| `/api/shop/packages` | GET | Paquetes disponibles |

**Uso:**
```bash
curl http://localhost:8000/api/players/online
```

---

### 🔐 Nivel 1: Autenticados (10 endpoints)

Requieren token JWT válido. Acceso a recursos propios.

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/players/` | GET | Mis jugadores |
| `/api/players/` | POST | Crear jugador |
| `/api/players/{name}/pokemon` | GET | Pokémon de mi jugador |
| `/api/account/stats` | GET | Estadísticas de mi cuenta |
| `/api/account/password` | PUT | Cambiar mi contraseña |
| `/api/account/settings` | PUT | Actualizar mi configuración |
| `/api/shop/premium` | GET | Mi estado premium |

**Uso:**
```bash
curl http://localhost:8000/api/players/ \
  -H "Authorization: Bearer <token>"
```

**Implementación:**
```python
@router.get("/api/players/")
def get_my_players(current_account = Depends(get_current_account)):
    return repository.get_account_players(db, current_account.id)
```

---

### 🛡️ Nivel 2: Autorizados (2 endpoints)

Requieren token JWT + verificación de propiedad del recurso.

| Endpoint | Método | Descripción | Verificación |
|----------|--------|-------------|--------------|
| `/api/players/{name}` | PUT | Actualizar jugador | Solo si es tuyo |
| `/api/players/{name}` | DELETE | Eliminar jugador | Solo si es tuyo |

**Uso:**
```bash
curl -X PUT http://localhost:8000/api/players/MyPlayer \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"level": 10}'
```

**Implementación:**
```python
@router.put("/api/players/{player_name}")
def update_player(
    player_name: str,
    player_update: schemas.PlayerUpdate,
    current_account = Depends(get_current_account)
):
    player = repository.get_player_by_name(db, player_name)
    if not player:
        raise HTTPException(404, "Player not found")
    
    # Verificar propiedad
    if player.account_id != current_account.id:
        raise HTTPException(403, "Not authorized")
    
    return repository.update_player(db, player, player_update)
```

---

## Matriz de Seguridad

| Endpoint | Público | Autenticado | Autorizado |
|----------|---------|-------------|------------|
| `POST /api/auth/register` | ✅ | - | - |
| `POST /api/auth/login` | ✅ | - | - |
| `GET /api/players/online` | ✅ | - | - |
| `GET /api/players/{name}` | ✅ | - | - |
| `GET /api/events` | ✅ | - | - |
| `GET /api/guilds` | ✅ | - | - |
| `GET /api/shop/packages` | ✅ | - | - |
| `GET /api/players/` | - | ✅ | - |
| `POST /api/players/` | - | ✅ | - |
| `GET /api/players/{name}/stats` | ✅ | - | - |
| `GET /api/players/{name}/pokemon` | - | ✅ | ✅ |
| `PUT /api/players/{name}` | - | ✅ | ✅ |
| `DELETE /api/players/{name}` | - | ✅ | ✅ |
| `GET /api/account/stats` | - | ✅ | - |
| `PUT /api/account/password` | - | ✅ | - |
| `PUT /api/account/settings` | - | ✅ | - |
| `GET /api/shop/premium` | - | ✅ | - |

---

## Respuestas de Error

### 401 Unauthorized
**Cuándo:** Token inválido, expirado o ausente

```json
{
  "detail": "Could not validate credentials"
}
```

**Solución:** Hacer login nuevamente

---

### 403 Forbidden
**Cuándo:** Token válido pero sin permisos sobre el recurso

```json
{
  "detail": "Not authorized"
}
```

**Solución:** Solo puedes modificar tus propios recursos

---

### 404 Not Found
**Cuándo:** Recurso no existe

```json
{
  "detail": "Player not found"
}
```

---

## Ejemplos por Caso de Uso

### Ver jugadores online (Público)
```bash
curl http://localhost:8000/api/players/online
# ✅ Funciona sin token
```

### Ver mis jugadores (Autenticado)
```bash
curl http://localhost:8000/api/players/ \
  -H "Authorization: Bearer <token>"
# ✅ Funciona con token válido
# ❌ 401 sin token
```

### Actualizar mi jugador (Autorizado)
```bash
# Mi jugador
curl -X PUT http://localhost:8000/api/players/MyPlayer \
  -H "Authorization: Bearer <token>" \
  -d '{"level": 10}'
# ✅ Funciona (es mío)

# Jugador de otro usuario
curl -X PUT http://localhost:8000/api/players/OtherPlayer \
  -H "Authorization: Bearer <token>" \
  -d '{"level": 10}'
# ❌ 403 Forbidden (no es mío)
```

---

## Implementación de Niveles

### Nivel 0: Sin Dependencias
```python
@router.get("/api/players/online")
def get_online_players(db: Session = Depends(get_db)):
    return repository.get_online_players(db)
```

### Nivel 1: Con get_current_account
```python
@router.get("/api/players/")
def get_my_players(
    db: Session = Depends(get_db),
    current_account = Depends(get_current_account)
):
    return repository.get_account_players(db, current_account.id)
```

### Nivel 2: Con Verificación Manual
```python
@router.put("/api/players/{name}")
def update_player(
    name: str,
    data: PlayerUpdate,
    db: Session = Depends(get_db),
    current_account = Depends(get_current_account)
):
    player = repository.get_player_by_name(db, name)
    if not player:
        raise HTTPException(404)
    
    if player.account_id != current_account.id:
        raise HTTPException(403)
    
    return repository.update_player(db, player, data)
```

---

## Resumen Visual

```
┌─────────────────────────────────────────────────────────────┐
│ PÚBLICO                                                     │
│ • No requiere token                                         │
│ • Datos generales                                           │
│ • Ejemplo: Ver jugadores online                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ AUTENTICADO                                                 │
│ • Requiere token válido                                     │
│ • Acceso a recursos propios                                 │
│ • Ejemplo: Ver mis jugadores                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ AUTORIZADO                                                  │
│ • Requiere token válido                                     │
│ • Verifica propiedad del recurso                            │
│ • Ejemplo: Actualizar mi jugador                            │
└─────────────────────────────────────────────────────────────┘
```
