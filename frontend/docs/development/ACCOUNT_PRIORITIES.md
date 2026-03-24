# 🎯 Análisis de Prioridades: Conexión Panel de Usuario

## 📊 Estado Actual

### Endpoints Backend Disponibles ✅
1. **Auth** - `/api/auth/*`
   - ✅ POST `/register` - Registro
   - ✅ POST `/login` - Login con JWT
   
2. **Players** - `/api/players/*`
   - ✅ GET `/` - Listar players de la cuenta
   - ✅ POST `/` - Crear nuevo player
   - ✅ GET `/{name}` - Info de player específico
   - ✅ GET `/{name}/pokemon` - Equipo pokemon
   - ✅ GET `/online` - Players online (público)
   - ✅ PUT `/{name}` - Actualizar player
   - ✅ DELETE `/{name}` - Eliminar player
   - ✅ GET `/{name}/stats` - Stats detalladas

3. **Account** - `/api/account/*`
   - ✅ PUT `/password` - Cambiar contraseña
   - ✅ PUT `/settings` - Actualizar email/flag
   - ✅ GET `/stats` - Estadísticas de cuenta

### Panel de Usuario Actual (Frontend)
```
Account Component:
├── Dashboard Tab          ❌ No conectado
├── Create Character Tab   ❌ No conectado
├── Change Password Tab    ✅ Conectado (ChangePasswordForm)
├── Settings Tab           ❌ No conectado
└── Donations Tab          ❌ No conectado
```

---

## 🎯 Prioridades de Conexión

### 🔴 PRIORIDAD CRÍTICA (Implementar YA)

#### 1. Dashboard - Estadísticas de Cuenta
**Endpoint:** `GET /api/account/stats`

**Datos a mostrar:**
```typescript
interface AccountStats {
  total_playing_time: number;    // Tiempo total jugado
  pokemon_caught: number;         // Pokemon capturados
  world_ranking: number;          // Ranking mundial
}
```

**UI Actual:** Tiene espacio para stats pero no muestra datos reales

**Implementación:**
```typescript
// apps/user/features/account/hooks/useAccountStats.ts
import { useQuery } from '@tanstack/react-query';
import { accountAPI } from '../api/accountAPI';

export function useAccountStats() {
  return useQuery({
    queryKey: ['account', 'stats'],
    queryFn: accountAPI.getStats,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
```

**Esfuerzo:** 1-2 horas
**Impacto:** Alto - Primera impresión del usuario

---

#### 2. Dashboard - Lista de Personajes
**Endpoint:** `GET /api/players/`

**Datos a mostrar:**
```typescript
interface Player {
  id: number;
  name: string;
  level: number;
  vocation: number;
  health: number;
  healthmax: number;
  experience: number;
  sex: number;
}
```

**UI Actual:** No existe, necesita crearse

**Componente a crear:**
```
apps/user/features/players/components/
└── PlayersList.tsx
    ├── PlayerCard.tsx
    └── PlayerStats.tsx
```

**Esfuerzo:** 2-3 horas
**Impacto:** Crítico - Core feature

---

#### 3. Create Character - Formulario Funcional
**Endpoint:** `POST /api/players/`

**Request:**
```typescript
interface CreatePlayerRequest {
  name: string;
  sex: 0 | 1;  // 0 = male, 1 = female
}
```

**UI Actual:** Existe formulario pero no está conectado

**Validaciones necesarias:**
- Nombre único
- Longitud del nombre (3-20 caracteres)
- Caracteres permitidos (alfanuméricos)
- Límite de personajes por cuenta

**Esfuerzo:** 2-3 horas
**Impacto:** Crítico - Usuarios no pueden crear personajes

---

### 🟡 PRIORIDAD ALTA (Implementar Pronto)

#### 4. Settings - Actualizar Email y País
**Endpoint:** `PUT /api/account/settings`

**Request:**
```typescript
interface UpdateSettingsRequest {
  email?: string;
  flag?: string;  // Código de país (US, BR, ES, etc.)
}
```

**UI Actual:** Existe formulario pero no está conectado

**Componente:**
```typescript
// apps/user/features/account/components/SettingsForm.tsx
- Email input
- Country selector (usar CountrySelector existente)
- Save button
```

**Esfuerzo:** 2-3 horas
**Impacto:** Medio - Personalización de cuenta

---

#### 5. Dashboard - Información Detallada de Personaje
**Endpoint:** `GET /api/players/{name}/stats`

**Datos adicionales:**
```typescript
interface PlayerDetailedStats {
  skill_fishing: number;
  onlinetime: number;
  lastlogin: number;
  lastlogout: number;
  pokemon_count: number;
}
```

**UI:** Modal o página de detalle al hacer click en personaje

**Esfuerzo:** 3-4 horas
**Impacto:** Medio - Información útil para el usuario

---

#### 6. Dashboard - Equipo Pokemon del Personaje
**Endpoint:** `GET /api/players/{name}/pokemon`

**Datos:**
```typescript
interface PokemonTeam {
  name: string;
  pokemon1: number | null;
  pokemon2: number | null;
  pokemon3: number | null;
  pokemon4: number | null;
  pokemon5: number | null;
  pokemon6: number | null;
}
```

**UI:** Grid de 6 slots mostrando pokemon (usar IDs para mostrar sprites)

**Esfuerzo:** 4-5 horas
**Impacto:** Alto - Feature visual atractiva

---

### 🟢 PRIORIDAD MEDIA (Implementar Después)

#### 7. Dashboard - Gestión de Personajes
**Endpoints:**
- `PUT /api/players/{name}` - Editar (limitado)
- `DELETE /api/players/{name}` - Eliminar

**Features:**
- Botón de eliminar personaje (con confirmación)
- Editar nombre (si el backend lo permite)

**Esfuerzo:** 2-3 horas
**Impacto:** Medio - Gestión básica

---

#### 8. Donations Tab - Integración de Pagos
**Backend:** Necesita implementarse

**Features:**
- Paquetes de donación
- Historial de donaciones
- Beneficios VIP

**Esfuerzo:** 8-10 horas (incluye backend)
**Impacto:** Alto - Monetización

---

## 📋 Plan de Implementación Recomendado

### Sprint 1 (1-2 días) - Core Features
```
✅ Día 1 Mañana:
1. Conectar Dashboard - Account Stats (1-2h)
2. Conectar Dashboard - Players List (2-3h)

✅ Día 1 Tarde:
3. Conectar Create Character Form (2-3h)
4. Testing y ajustes (1h)

✅ Día 2:
5. Conectar Settings Form (2-3h)
6. Player Detailed Stats Modal (3-4h)
```

### Sprint 2 (1-2 días) - Enhanced Features
```
✅ Día 3:
7. Pokemon Team Display (4-5h)
8. Player Management (delete) (2-3h)

✅ Día 4:
9. Polish UI/UX (2-3h)
10. Testing completo (2-3h)
```

---

## 🔧 Estructura de Archivos a Crear/Modificar

### Crear Nuevos
```
apps/user/features/account/
├── hooks/
│   ├── useAccountStats.ts          ✅ Crear
│   └── useUpdateSettings.ts        ✅ Crear
├── components/
│   ├── AccountStats.tsx            ✅ Crear
│   ├── SettingsForm.tsx            ✅ Crear
│   └── PlayersList.tsx             ✅ Crear

apps/user/features/players/
├── components/
│   ├── PlayerCard.tsx              ✅ Crear
│   ├── PlayerDetailModal.tsx       ✅ Crear
│   ├── PokemonTeam.tsx             ✅ Crear
│   └── CreatePlayerForm.tsx        ✅ Crear
├── hooks/
│   ├── usePlayerStats.ts           ✅ Crear
│   ├── useCreatePlayer.ts          ✅ Crear
│   └── useDeletePlayer.ts          ✅ Crear
```

### Modificar Existentes
```
apps/user/features/account/
├── Account.tsx                      🔄 Integrar nuevos componentes
└── api/accountAPI.ts                🔄 Agregar getStats, updateSettings

apps/user/features/players/
└── api/playersAPI.ts                🔄 Ya tiene lo necesario
```

---

## 📊 Matriz de Prioridad vs Esfuerzo

```
Alto Impacto, Bajo Esfuerzo (HACER PRIMERO):
├── Account Stats Display           ⭐⭐⭐⭐⭐
├── Players List                    ⭐⭐⭐⭐⭐
└── Create Character Form           ⭐⭐⭐⭐⭐

Alto Impacto, Medio Esfuerzo:
├── Pokemon Team Display            ⭐⭐⭐⭐
├── Settings Form                   ⭐⭐⭐⭐
└── Player Detailed Stats           ⭐⭐⭐

Medio Impacto, Bajo Esfuerzo:
└── Delete Player                   ⭐⭐⭐

Alto Impacto, Alto Esfuerzo:
└── Donations System                ⭐⭐⭐⭐⭐ (Futuro)
```

---

## 🎨 Mockup de Dashboard Conectado

```
┌─────────────────────────────────────────────────────────┐
│ My Account                                              │
│ ━━━━━━━━━━                                              │
│                                                         │
│ ┌─────────────────┐  ┌─────────────────────────────┐  │
│ │ 🧑🚀 Username    │  │ 📊 Account Stats            │  │
│ │ Welcome back!   │  │ ⏱️  45,000 min played       │  │
│ └─────────────────┘  │ 🎮 1,240 pokemon caught     │  │
│                      │ 🏆 Rank #4,520              │  │
│ ┌─────────────────┐  └─────────────────────────────┘  │
│ │ 📋 Menu         │                                    │
│ │ ▶ Dashboard     │  ┌─────────────────────────────┐  │
│ │   Create Char   │  │ ⚔️  My Characters           │  │
│ │   Change Pwd    │  │                             │  │
│ │   Settings      │  │ ┌─────────────────────────┐ │  │
│ │   Donations     │  │ │ Sylarnal    Lv. 85  ⚡  │ │  │
│ └─────────────────┘  │ │ HP: 200/200  EXP: 50k   │ │  │
│                      │ │ [View] [Delete]         │ │  │
│                      │ └─────────────────────────┘ │  │
│                      │                             │  │
│                      │ ┌─────────────────────────┐ │  │
│                      │ │ Trainer2    Lv. 42  🔥  │ │  │
│                      │ │ HP: 150/150  EXP: 20k   │ │  │
│                      │ │ [View] [Delete]         │ │  │
│                      │ └─────────────────────────┘ │  │
│                      │                             │  │
│                      │ [+ Create New Character]    │  │
│                      └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist de Implementación

### Fase 1: Core (Crítico)
- [ ] Hook `useAccountStats` + integración
- [ ] Hook `usePlayersList` + componente
- [ ] Componente `PlayerCard`
- [ ] Hook `useCreatePlayer` + formulario
- [ ] Validaciones de formulario
- [ ] Manejo de errores
- [ ] Loading states

### Fase 2: Enhanced (Alto)
- [ ] Componente `SettingsForm`
- [ ] Hook `useUpdateSettings`
- [ ] Modal `PlayerDetailModal`
- [ ] Hook `usePlayerStats`
- [ ] Componente `PokemonTeam`
- [ ] Hook `usePokemonTeam`

### Fase 3: Management (Medio)
- [ ] Hook `useDeletePlayer`
- [ ] Confirmación de eliminación
- [ ] Actualización de lista tras eliminar
- [ ] Toast notifications

---

## 🚀 Resultado Esperado

Después de implementar las prioridades críticas y altas:

✅ **Dashboard funcional** con stats reales
✅ **Lista de personajes** con datos del backend
✅ **Crear personajes** funcionando
✅ **Cambiar contraseña** ya funciona
✅ **Actualizar settings** funcionando
✅ **Ver detalles** de personajes
✅ **Ver equipo pokemon** de personajes

**Tiempo estimado total:** 3-4 días de desarrollo

---

**Fecha:** 2026-03-10
**Versión:** 1.0
