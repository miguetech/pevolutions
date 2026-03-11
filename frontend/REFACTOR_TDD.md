# TDD: Refactorización de Arquitectura Frontend

## 🎯 Objetivo
Refactorizar la estructura actual del frontend a una arquitectura escalable basada en:
- Separación por aplicaciones (public, user, admin)
- Dominio de autenticación aislado
- Componentes compartidos centralizados
- Organización por features

## 📊 Estado Actual vs Estado Deseado

### Estado Actual
```
src/
├── components/          # Todos los componentes mezclados
├── pages/              # Páginas sin organización clara
├── hooks/              # Hooks mezclados
├── stores/             # Stores sin separación
├── lib/                # Utilidades básicas
└── layouts/            # Layouts genéricos
```

### Estado Deseado
```
src/
├── apps/               # Separación por rol (public, user, admin)
├── auth/               # Dominio de autenticación aislado
├── shared/             # Código compartido
└── pages/              # Páginas organizadas por rol
```

---

## 📝 Plan de Refactorización

### **Fase 1: Preparación y Configuración** ⏱️ 30 min

#### 1.1 Crear estructura de directorios base
- [ ] Crear `/src/apps/public/`
- [ ] Crear `/src/apps/user/`
- [ ] Crear `/src/apps/admin/`
- [ ] Crear `/src/auth/`
- [ ] Crear `/src/shared/`

#### 1.2 Configurar TypeScript paths
- [ ] Actualizar `tsconfig.json` con aliases:
  ```json
  {
    "compilerOptions": {
      "paths": {
        "@/auth/*": ["./src/auth/*"],
        "@/apps/*": ["./src/apps/*"],
        "@/shared/*": ["./src/shared/*"]
      }
    }
  }
  ```

#### 1.3 Actualizar Astro config
- [ ] Verificar que los aliases funcionen en `astro.config.mjs`

---

### **Fase 2: Migrar Dominio de Autenticación** ⏱️ 1 hora

#### 2.1 Crear estructura auth
- [ ] Crear `/src/auth/components/`
- [ ] Crear `/src/auth/hooks/`
- [ ] Crear `/src/auth/stores/`
- [ ] Crear `/src/auth/api/`
- [ ] Crear `/src/auth/types/`
- [ ] Crear `/src/auth/utils/`
- [ ] Crear `/src/auth/layouts/`

#### 2.2 Migrar tipos de autenticación
- [ ] Crear `auth/types/user.ts` con `User` y `Role`
- [ ] Crear `auth/types/auth.ts` con `LoginCredentials`, `RegisterData`, `AuthResponse`

#### 2.3 Migrar stores de autenticación
- [ ] Mover `stores/authAtoms.ts` → `auth/stores/authAtoms.ts`
- [ ] Actualizar imports en componentes que usen `authAtoms`

#### 2.4 Migrar API de autenticación
- [ ] Extraer funciones auth de `lib/api.ts` → `auth/api/authAPI.ts`
- [ ] Mantener solo `authAPI.login`, `authAPI.register`, `authAPI.logout`, `authAPI.refresh`

#### 2.5 Migrar hooks de autenticación
- [ ] Mover `hooks/useAuth.ts` → `auth/hooks/useAuth.ts`
- [ ] Crear `auth/hooks/useLogin.ts`
- [ ] Crear `auth/hooks/useRegister.ts`
- [ ] Crear `auth/hooks/useLogout.ts`
- [ ] Crear `auth/hooks/usePermissions.ts`

#### 2.6 Migrar componentes de autenticación
- [ ] Mover `LoginForm.tsx` → `auth/components/LoginForm.tsx`
- [ ] Mover `RegisterForm.tsx` → `auth/components/RegisterForm.tsx`
- [ ] Mover `ChangePasswordForm.tsx` → `auth/components/ChangePasswordForm.tsx`
- [ ] Crear `auth/components/ProtectedRoute.tsx`
- [ ] Crear `auth/components/RoleGuard.tsx`
- [ ] Eliminar componentes `*WithProvider.tsx` (redundantes)

#### 2.7 Crear utilidades RBAC
- [ ] Crear `auth/utils/rbac.ts` con sistema de permisos
- [ ] Crear `auth/utils/permissions.ts` con definición de permisos por rol
- [ ] Crear `auth/utils/tokenManager.ts` para manejo de tokens

#### 2.8 Crear layout de autenticación
- [ ] Crear `auth/layouts/AuthLayout.astro` para páginas login/register

#### 2.9 Tests de autenticación
- [ ] Mover tests de auth a `auth/components/__tests__/`
- [ ] Mover tests de hooks a `auth/hooks/__tests__/`
- [ ] Mover tests de stores a `auth/stores/__tests__/`
- [ ] Ejecutar tests: `npm run test`

---

### **Fase 3: Migrar Shared (Componentes Compartidos)** ⏱️ 1 hora

#### 3.1 Crear estructura shared
- [ ] Crear `/src/shared/components/ui/`
- [ ] Crear `/src/shared/components/forms/`
- [ ] Crear `/src/shared/components/navigation/`
- [ ] Crear `/src/shared/components/feedback/`
- [ ] Crear `/src/shared/hooks/`
- [ ] Crear `/src/shared/stores/`
- [ ] Crear `/src/shared/lib/`
- [ ] Crear `/src/shared/types/`
- [ ] Crear `/src/shared/utils/`

#### 3.2 Migrar componentes UI base
- [ ] Identificar componentes reutilizables (Button, Input, Modal, Card, etc.)
- [ ] Mover a `shared/components/ui/`
- [ ] Actualizar imports en todos los archivos que los usen

#### 3.3 Migrar componentes de navegación
- [ ] Mover `Navbar.tsx` → `shared/components/navigation/Navbar.tsx`
- [ ] Mover `Footer.tsx` → `shared/components/navigation/Footer.tsx`
- [ ] Mover `Sidebar.tsx` → `shared/components/navigation/Sidebar.tsx`

#### 3.4 Migrar stores compartidos
- [ ] Mover `stores/uiAtoms.ts` → `shared/stores/uiAtoms.ts`
- [ ] Actualizar imports

#### 3.5 Migrar lib compartido
- [ ] Mover `lib/api.ts` → `shared/lib/api.ts`
- [ ] Mover `lib/queryClient.ts` → `shared/lib/queryClient.ts`
- [ ] Actualizar imports

#### 3.6 Migrar tipos compartidos
- [ ] Crear `shared/types/player.ts` con tipo `Player`
- [ ] Crear `shared/types/api.ts` con tipos de respuestas API
- [ ] Crear `shared/types/common.ts` con tipos genéricos

#### 3.7 Migrar utilidades
- [ ] Crear `shared/utils/formatters.ts`
- [ ] Crear `shared/utils/validators.ts`
- [ ] Crear `shared/utils/constants.ts`

---

### **Fase 4: Migrar App Pública** ⏱️ 45 min

#### 4.1 Crear estructura public
- [ ] Crear `/src/apps/public/features/home/`
- [ ] Crear `/src/apps/public/features/downloads/`
- [ ] Crear `/src/apps/public/features/community/`
- [ ] Crear `/src/apps/public/features/support/`
- [ ] Crear `/src/apps/public/layouts/`

#### 4.2 Migrar feature Home
- [ ] Crear `apps/public/features/home/components/Hero.tsx`
- [ ] Mover `Hero.tsx` → `apps/public/features/home/components/`
- [ ] Crear `apps/public/features/home/Home.tsx` (componente principal)

#### 4.3 Migrar feature Downloads
- [ ] Mover `Downloads.tsx` → `apps/public/features/downloads/Downloads.tsx`
- [ ] Mover `DownloadCard.tsx` → `apps/public/features/downloads/components/`

#### 4.4 Migrar feature Community
- [ ] Mover `Community.tsx` → `apps/public/features/community/Community.tsx`

#### 4.5 Migrar feature Support
- [ ] Mover `Support.tsx` → `apps/public/features/support/Support.tsx`

#### 4.6 Crear layout público
- [ ] Crear `apps/public/layouts/PublicLayout.astro`

#### 4.7 Actualizar páginas públicas
- [ ] Actualizar `pages/index.astro` para usar nuevo layout
- [ ] Actualizar `pages/downloads.astro`
- [ ] Actualizar `pages/community.astro`
- [ ] Actualizar `pages/support.astro`

---

### **Fase 5: Migrar App de Usuario** ⏱️ 1 hora

#### 5.1 Crear estructura user
- [ ] Crear `/src/apps/user/features/account/`
- [ ] Crear `/src/apps/user/features/players/`
- [ ] Crear `/src/apps/user/features/profile/`
- [ ] Crear `/src/apps/user/layouts/`

#### 5.2 Migrar feature Account
- [ ] Crear `apps/user/features/account/components/`
- [ ] Crear `apps/user/features/account/hooks/`
- [ ] Crear `apps/user/features/account/api/`
- [ ] Mover `Account.tsx` → `apps/user/features/account/Account.tsx`
- [ ] Extraer `accountAPI` de `lib/api.ts` → `apps/user/features/account/api/accountAPI.ts`
- [ ] Crear `apps/user/features/account/hooks/useAccountStats.ts`

#### 5.3 Migrar feature Players
- [ ] Crear `apps/user/features/players/components/`
- [ ] Crear `apps/user/features/players/hooks/`
- [ ] Crear `apps/user/features/players/api/`
- [ ] Mover `OnlinePlayers.tsx` → `apps/user/features/players/components/`
- [ ] Mover `hooks/usePlayers.ts` → `apps/user/features/players/hooks/`
- [ ] Extraer `playersAPI` de `lib/api.ts` → `apps/user/features/players/api/playersAPI.ts`

#### 5.4 Migrar feature Profile
- [ ] Crear `apps/user/features/profile/components/`
- [ ] Crear componentes de perfil si existen

#### 5.5 Crear layout de usuario
- [ ] Crear `apps/user/layouts/UserLayout.astro`

#### 5.6 Actualizar páginas de usuario
- [ ] Actualizar `pages/account/index.astro`
- [ ] Crear `pages/account/players.astro`
- [ ] Crear `pages/account/profile.astro`

#### 5.7 Tests de features de usuario
- [ ] Mover tests a estructura correspondiente
- [ ] Ejecutar tests: `npm run test`

---

### **Fase 6: Crear App de Admin** ⏱️ 1.5 horas

#### 6.1 Crear estructura admin
- [ ] Crear `/src/apps/admin/features/dashboard/`
- [ ] Crear `/src/apps/admin/features/users/`
- [ ] Crear `/src/apps/admin/features/players/`
- [ ] Crear `/src/apps/admin/features/logs/`
- [ ] Crear `/src/apps/admin/features/settings/`
- [ ] Crear `/src/apps/admin/layouts/`

#### 6.2 Crear feature Dashboard
- [ ] Crear `apps/admin/features/dashboard/components/StatsCard.tsx`
- [ ] Crear `apps/admin/features/dashboard/components/RecentActivity.tsx`
- [ ] Crear `apps/admin/features/dashboard/Dashboard.tsx`
- [ ] Crear `apps/admin/features/dashboard/hooks/useDashboardStats.ts`
- [ ] Crear `apps/admin/features/dashboard/api/dashboardAPI.ts`

#### 6.3 Crear feature Users (Admin)
- [ ] Crear `apps/admin/features/users/components/UserTable.tsx`
- [ ] Crear `apps/admin/features/users/components/UserFilters.tsx`
- [ ] Crear `apps/admin/features/users/components/EditUserModal.tsx`
- [ ] Crear `apps/admin/features/users/Users.tsx`
- [ ] Crear `apps/admin/features/users/hooks/useUsers.ts`
- [ ] Crear `apps/admin/features/users/api/usersAPI.ts`

#### 6.4 Crear feature Players (Admin)
- [ ] Crear `apps/admin/features/players/components/PlayerTable.tsx`
- [ ] Crear `apps/admin/features/players/components/BanPlayerModal.tsx`
- [ ] Crear `apps/admin/features/players/Players.tsx`
- [ ] Crear `apps/admin/features/players/hooks/useAdminPlayers.ts`
- [ ] Crear `apps/admin/features/players/api/adminPlayersAPI.ts`

#### 6.5 Crear feature Logs
- [ ] Crear `apps/admin/features/logs/components/LogsTable.tsx`
- [ ] Crear `apps/admin/features/logs/Logs.tsx`
- [ ] Crear `apps/admin/features/logs/hooks/useLogs.ts`
- [ ] Crear `apps/admin/features/logs/api/logsAPI.ts`

#### 6.6 Crear feature Settings
- [ ] Crear `apps/admin/features/settings/Settings.tsx`
- [ ] Crear componentes de configuración

#### 6.7 Crear layout de admin
- [ ] Crear `apps/admin/layouts/AdminLayout.astro`

#### 6.8 Crear páginas de admin
- [ ] Crear `pages/admin/index.astro` (Dashboard)
- [ ] Crear `pages/admin/users.astro`
- [ ] Crear `pages/admin/players.astro`
- [ ] Crear `pages/admin/logs.astro`
- [ ] Crear `pages/admin/settings.astro`

---

### **Fase 7: Implementar Protección de Rutas** ⏱️ 45 min

#### 7.1 Crear middleware
- [ ] Crear `middleware.ts` en raíz del proyecto
- [ ] Implementar protección para rutas `/account/*`
- [ ] Implementar protección para rutas `/admin/*`
- [ ] Verificar roles desde JWT

#### 7.2 Actualizar backend para incluir rol en JWT
- [ ] Modificar backend para incluir `role` en el token
- [ ] Actualizar endpoint `/api/auth/me` para retornar rol

#### 7.3 Implementar componentes de protección
- [ ] Usar `auth/components/ProtectedRoute.tsx` en componentes
- [ ] Usar `auth/components/RoleGuard.tsx` para admin

---

### **Fase 8: Limpieza y Optimización** ⏱️ 30 min

#### 8.1 Eliminar archivos antiguos
- [ ] Eliminar `/src/components/` (ya migrados)
- [ ] Eliminar `/src/hooks/` (ya migrados)
- [ ] Eliminar `/src/stores/` (ya migrados)
- [ ] Eliminar componentes `*WithProvider.tsx`

#### 8.2 Actualizar imports
- [ ] Buscar y reemplazar imports antiguos
- [ ] Verificar que no haya imports rotos

#### 8.3 Optimizar componentes
- [ ] Implementar `React.lazy()` para componentes pesados
- [ ] Agregar `client:load` o `client:visible` en Astro según necesidad

#### 8.4 Actualizar documentación
- [ ] Actualizar `README.md` con nueva estructura
- [ ] Documentar convenciones de imports
- [ ] Documentar estructura de features

---

### **Fase 9: Testing Completo** ⏱️ 1 hora

#### 9.1 Ejecutar tests unitarios
- [ ] `npm run test`
- [ ] Verificar que todos los tests pasen
- [ ] Corregir tests rotos por cambios de imports

#### 9.2 Testing manual
- [ ] Probar flujo de login
- [ ] Probar flujo de registro
- [ ] Probar navegación en área pública
- [ ] Probar navegación en área de usuario
- [ ] Probar navegación en área de admin (si ya existe backend)
- [ ] Probar protección de rutas

#### 9.3 Testing de performance
- [ ] Verificar tiempos de carga
- [ ] Verificar bundle size
- [ ] Optimizar si es necesario

---

### **Fase 10: Deploy y Validación** ⏱️ 30 min

#### 10.1 Build de producción
- [ ] `npm run build`
- [ ] Verificar que no haya errores de build
- [ ] Verificar que los paths se resuelvan correctamente

#### 10.2 Preview
- [ ] `npm run preview`
- [ ] Probar en navegador

#### 10.3 Commit y documentación
- [ ] Commit con mensaje descriptivo
- [ ] Actualizar changelog si existe
- [ ] Crear PR si es necesario

---

## ⏱️ Tiempo Total Estimado: 8-10 horas

## 🎯 Criterios de Éxito

- [ ] Todos los tests pasan
- [ ] No hay imports rotos
- [ ] La aplicación funciona igual que antes
- [ ] La estructura es clara y escalable
- [ ] El código está organizado por dominio
- [ ] Auth está completamente aislado
- [ ] Componentes compartidos están centralizados
- [ ] Las rutas están protegidas correctamente

## 📚 Recursos

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Astro Islands](https://docs.astro.build/en/concepts/islands/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Jotai](https://jotai.org/)

## 🚨 Notas Importantes

1. **Hacer commits frecuentes** después de cada fase
2. **Ejecutar tests** después de cada migración importante
3. **No eliminar archivos antiguos** hasta verificar que todo funciona
4. **Mantener backup** antes de empezar
5. **Trabajar en una rama separada** (`feature/refactor-architecture`)
