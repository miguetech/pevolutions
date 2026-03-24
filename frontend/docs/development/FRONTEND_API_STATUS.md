# Frontend API Integration Status

## ✅ Pantallas con API Conectada

### 1. **Home (Inicio)** - `/`
- ✅ `OnlineStats` - Conectado a `/api/players/online`

### 2. **Account** - `/account`
- ✅ `AccountStats` - Conectado a `/api/account/stats`
- ✅ `SettingsForm` - Conectado a `/api/account/settings` (PUT)
- ✅ `ChangePasswordForm` - Conectado a `/api/account/password` (PUT)
- ✅ `PlayersList` - Conectado a `/api/players/`

### 3. **Online Players** - `/online-players`
- ✅ `OnlinePlayers` - Conectado a `/api/players/online`
- ✅ `PlayerSearch` - Conectado a `/api/players/online`

### 4. **Player Profile** - `/player`
- ✅ `PlayerProfile` - Conectado a `/api/players/{name}`
- ✅ `PlayerStatsDetailed` - Conectado a `/api/players/{name}/stats`
- ✅ `PokemonTeam` - Conectado a `/api/players/{name}/pokemon`

### 5. **Login/Register**
- ✅ `LoginForm` - Conectado a `/api/auth/login`
- ✅ `RegisterForm` - Conectado a `/api/auth/register`

---

## ❌ Pantallas SIN Conexión API (Datos Hardcodeados)

### 1. **Community** - `/community`
**Componentes que necesitan API:**

#### `TopPlayers` (Sidebar)
- ❌ Datos hardcodeados: `[{ name: 'Sylarnal', score: 5 }, { name: 'Zaps', score: 3 }]`
- 🔧 **Necesita:** Endpoint para top players por ranking/score
- 📍 **Endpoint sugerido:** `GET /api/players/top?limit=10`

#### `ServerInfo` (Sidebar)
- ❌ Número de jugadores online hardcodeado: `"07"`
- 🔧 **Necesita:** Endpoint para contar jugadores online
- 📍 **Endpoint sugerido:** `GET /api/server/stats` → `{ online_count: number, uptime: string, version: string }`

#### `Community` (Main Content)
- ❌ Social links hardcodeados (Discord, Twitter, YouTube)
- ❌ Upcoming events hardcodeados
- ❌ Top guilds hardcodeados
- 🔧 **Necesita:**
  - `GET /api/events?type=upcoming&limit=5` (ya existe `/api/events/`)
  - `GET /api/guilds/top?limit=5`
  - `GET /api/social-links` (opcional, puede quedar hardcoded)

---

### 2. **Support** - `/support`
**Componentes que necesitan API:**

#### `Support` (Main Content)
- ❌ Staff members hardcodeados
- ❌ Social support links hardcodeados
- 🔧 **Necesita:**
  - `GET /api/support/staff` → Lista de staff con roles, disponibilidad, idiomas
  - `GET /api/support/channels` → Canales de soporte (Discord, WhatsApp, Email)

---

### 3. **Downloads** - `/downloads`
**Componentes que necesitan API:**

#### `RequirementsCard` (Sidebar)
- ❌ System requirements hardcodeados
- 🔧 **Puede quedar hardcoded** (no cambia frecuentemente)

#### `Downloads` (Main Content)
- ❌ Download links hardcodeados
- 🔧 **Necesita:**
  - `GET /api/downloads` → Lista de archivos descargables con versiones, tamaños, links

---

### 4. **Sidebar Components** (Usados en múltiples páginas)

#### `ServerInfo`
- ❌ Players online count: hardcodeado `"07"`
- ❌ Server status: hardcodeado `"Online"`
- 🔧 **Necesita:** `GET /api/server/info`

#### `TopPlayers`
- ❌ Top players list hardcodeada
- 🔧 **Necesita:** `GET /api/players/top`

---

## 📋 Resumen de Endpoints Faltantes

### Alta Prioridad
1. `GET /api/server/info` - Info del servidor (online count, status, uptime)
2. `GET /api/players/top` - Top players por ranking
3. `GET /api/guilds/top` - Top guilds
4. `GET /api/events` - Ya existe, solo conectar al frontend

### Media Prioridad
5. `GET /api/support/staff` - Lista de staff de soporte
6. `GET /api/downloads` - Lista de archivos descargables

### Baja Prioridad (Opcional)
7. `GET /api/social-links` - Links de redes sociales
8. `GET /api/support/channels` - Canales de soporte

---

## 🎯 Endpoints Backend Disponibles (No Usados)

- ✅ `GET /api/events/` - **Existe pero no se usa en frontend**
- ✅ `GET /api/account/premium` - **Existe pero no se usa en frontend**
- ✅ `GET /api/account/packages` - **Existe pero no se usa en frontend**

---

## 📊 Estadísticas

- **Total de pantallas:** 8
- **Pantallas con API:** 5 (62.5%)
- **Pantallas sin API:** 3 (37.5%)
- **Endpoints backend:** 18
- **Endpoints faltantes:** ~6-8
