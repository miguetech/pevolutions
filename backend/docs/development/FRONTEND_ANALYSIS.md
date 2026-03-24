# Análisis Frontend → Backend Endpoints

## 📋 Resumen Ejecutivo

Basado en el análisis del frontend (Astro + React), he identificado los endpoints necesarios para cada página/componente.

---

## 🎯 Endpoints por Prioridad

### ✅ PRIORIDAD 1 - CRÍTICOS (Ya Implementados)

#### 1. Autenticación
- ✅ `POST /api/auth/register` - Registro de cuenta
- ✅ `POST /api/auth/login` - Inicio de sesión
- ⚠️ `POST /api/auth/logout` - Cerrar sesión (opcional, solo limpia token en frontend)

**Usado en:**
- `AuthForms.tsx` (login/register)
- `Account.tsx` (logout)

---

### 🔥 PRIORIDAD 2 - ESENCIALES (Implementar Ahora)

#### 2. Gestión de Cuenta
- ✅ `GET /api/players/` - Listar personajes de la cuenta
- ✅ `POST /api/players/` - Crear nuevo personaje
- ❌ `PUT /api/account/password` - Cambiar contraseña
- ❌ `PUT /api/account/settings` - Actualizar email/país

**Usado en:**
- `Account.tsx` → DashboardView (listar personajes)
- `Account.tsx` → CreateCharView (crear personaje)
- `Account.tsx` → SettingsView (cambiar password/settings)

#### 3. Jugadores Online
- ❌ `GET /api/players/online` - Lista de jugadores conectados
- ❌ `GET /api/players/{name}/stats` - Estadísticas detalladas de jugador

**Usado en:**
- `OnlinePlayers.tsx` (lista completa con filtros)

**Datos necesarios:**
```typescript
{
  id: number,
  name: string,
  level: number,
  captures: number,      // Total de pokemon capturados
  fishingLevel: number,  // Nivel de pesca
  gender: 'boy' | 'girl',
  isOnline: boolean
}
```

---

### 🎮 PRIORIDAD 3 - IMPORTANTES (Siguiente Sprint)

#### 4. Estadísticas del Dashboard
- ❌ `GET /api/account/stats` - Estadísticas generales de la cuenta

**Usado en:**
- `Account.tsx` → DashboardView

**Datos necesarios:**
```typescript
{
  totalPlayingTime: number,    // En segundos
  pokemonCaught: number,        // Total capturados
  worldRanking: number          // Posición en ranking
}
```

#### 5. Personajes Detallados
- ✅ `GET /api/players/{name}` - Info básica del personaje
- ✅ `GET /api/players/{name}/pokemon` - Equipo pokemon
- ❌ `PUT /api/players/{name}` - Actualizar personaje
- ❌ `DELETE /api/players/{name}` - Eliminar personaje

**Usado en:**
- `Account.tsx` → DashboardView (ver detalles)

---

### 🌐 PRIORIDAD 4 - COMUNIDAD (Futuro)

#### 6. Eventos y Noticias
- ❌ `GET /api/events` - Lista de eventos próximos
- ❌ `GET /api/news` - Últimas noticias

**Usado en:**
- `Community.tsx` (eventos y actualizaciones)

**Datos necesarios:**
```typescript
Event {
  id: number,
  title: string,
  date: string,
  description: string,
  tag: 'Contest' | 'Tournament' | 'Update'
}
```

#### 7. Guilds (Gremios)
- ❌ `GET /api/guilds` - Lista de guilds
- ❌ `GET /api/guilds/{id}` - Detalles de guild
- ❌ `POST /api/guilds` - Crear guild
- ❌ `POST /api/guilds/{id}/join` - Unirse a guild

**Usado en:**
- `Community.tsx` (top guilds)

**Datos necesarios:**
```typescript
Guild {
  id: number,
  name: string,
  members: number,
  points: number,
  tag: string
}
```

---

### 💎 PRIORIDAD 5 - MONETIZACIÓN (Futuro)

#### 8. Donaciones/Premium
- ❌ `GET /api/shop/packages` - Paquetes de puntos premium
- ❌ `POST /api/shop/purchase` - Comprar puntos
- ❌ `GET /api/account/premium` - Estado premium de la cuenta

**Usado en:**
- `Account.tsx` → DonationsView

**Datos necesarios:**
```typescript
Package {
  price: string,
  points: number,
  bonus: string
}
```

---

### 📊 PRIORIDAD 6 - SOPORTE (Futuro)

#### 9. Sistema de Tickets
- ❌ `GET /api/support/tickets` - Mis tickets
- ❌ `POST /api/support/tickets` - Crear ticket
- ❌ `GET /api/support/staff` - Lista de staff disponible

**Usado en:**
- `Support.tsx`

---

## 🚀 Plan de Implementación Recomendado

### FASE 1 - MVP (Esta Semana)
```
1. ✅ POST /api/auth/register
2. ✅ POST /api/auth/login
3. ✅ GET /api/players/
4. ✅ POST /api/players/
5. ❌ PUT /api/account/password
6. ❌ PUT /api/account/settings
7. ❌ GET /api/players/online
```

### FASE 2 - Funcionalidad Completa (Próxima Semana)
```
8. ❌ GET /api/account/stats
9. ❌ PUT /api/players/{name}
10. ❌ DELETE /api/players/{name}
11. ❌ GET /api/players/{name}/stats
```

### FASE 3 - Comunidad (Semana 3)
```
12. ❌ GET /api/events
13. ❌ GET /api/guilds
14. ❌ POST /api/guilds
15. ❌ POST /api/guilds/{id}/join
```

### FASE 4 - Monetización (Semana 4)
```
16. ❌ GET /api/shop/packages
17. ❌ POST /api/shop/purchase
18. ❌ GET /api/account/premium
```

---

## 📝 Endpoints Detallados para FASE 1

### 1. PUT /api/account/password
**Protegido:** Sí (JWT)

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

---

### 2. PUT /api/account/settings
**Protegido:** Sí (JWT)

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
  "flag": "US"
}
```

---

### 3. GET /api/players/online
**Protegido:** No

**Query Params:**
- `sort_by`: level | captures | fishing (default: level)
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
    "lastlogin": 1710123456,
    "stats": {
      "captures": 120,
      "fishingLevel": 45
    }
  }
]
```

**Nota:** Necesita JOIN con tabla `players_online` y calcular stats desde otras tablas.

---

## 🗄️ Tablas de BD Necesarias

### Tablas Existentes Usadas:
- ✅ `accounts` - Cuentas de usuario
- ✅ `players` - Personajes
- ✅ `pokemonteam` - Equipo pokemon
- ✅ `players_online` - Jugadores conectados
- ⚠️ `guilds` - Gremios (existe pero no implementado)
- ⚠️ `guild_members` - Miembros de gremios

### Tablas Faltantes (Crear):
- ❌ `events` - Eventos del juego
- ❌ `news` - Noticias/actualizaciones
- ❌ `shop_packages` - Paquetes de puntos
- ❌ `transactions` - Historial de compras
- ❌ `support_tickets` - Tickets de soporte

---

## 🔍 Campos Adicionales Necesarios

### En tabla `players`:
- ❌ `captures_total` - Total de pokemon capturados
- ❌ `fishing_level` - Nivel de pesca
- ⚠️ Estos datos pueden calcularse desde otras tablas existentes

### En tabla `accounts`:
- ⚠️ `premium_points` - Ya existe como `premium_points`
- ⚠️ `flag` - Ya existe para país

---

## 📊 Métricas de Implementación

**Total Endpoints Identificados:** 18
**Ya Implementados:** 4 (22%)
**Prioridad Alta (FASE 1):** 7 endpoints
**Estimación FASE 1:** 4-6 horas de desarrollo

---

## 🎯 Recomendación Final

**Empezar con estos 3 endpoints:**

1. `GET /api/players/online` - Crítico para página de jugadores online
2. `PUT /api/account/password` - Seguridad básica
3. `GET /api/account/stats` - Dashboard funcional

Estos 3 endpoints + los 4 ya implementados darán funcionalidad completa a:
- ✅ Login/Register
- ✅ Dashboard de cuenta
- ✅ Crear personajes
- ✅ Ver jugadores online
- ✅ Cambiar contraseña

**Tiempo estimado:** 3-4 horas
