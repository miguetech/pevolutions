# 🚀 Guía Rápida de Refactorización

## Antes de Empezar

1. **Crear rama de trabajo:**
   ```bash
   git checkout -b feature/refactor-architecture
   ```

2. **Hacer backup:**
   ```bash
   cp -r src src.backup
   ```

3. **Asegurar que los tests pasen:**
   ```bash
   npm run test
   ```

## Ejecución Paso a Paso

### Fase 1: Preparación (30 min)

```bash
# Ejecutar script helper
./refactor-helper.sh fase1

# Verificar que se crearon los directorios
ls -la src/apps
ls -la src/auth
ls -la src/shared
```

**Resultado esperado:**
- ✅ Estructura de directorios creada
- ✅ `tsconfig.json` actualizado con paths
- ✅ `ARCHITECTURE.md` creado

### Fase 2: Migrar Auth (1 hora)

```bash
# Crear archivos base
./refactor-helper.sh fase2
```

**Migración manual:**

1. **Mover stores:**
   ```bash
   mv src/stores/authAtoms.ts src/auth/stores/authAtoms.ts
   ```

2. **Mover hooks:**
   ```bash
   mv src/hooks/useAuth.ts src/auth/hooks/useAuth.ts
   ```

3. **Mover componentes:**
   ```bash
   mv src/components/LoginForm.tsx src/auth/components/LoginForm.tsx
   mv src/components/RegisterForm.tsx src/auth/components/RegisterForm.tsx
   mv src/components/ChangePasswordForm.tsx src/auth/components/ChangePasswordForm.tsx
   ```

4. **Actualizar imports en cada archivo movido:**
   - Cambiar `@/stores/authAtoms` → `@/auth/stores/authAtoms`
   - Cambiar `@/lib/api` → `@/shared/lib/api`

5. **Mover tests:**
   ```bash
   mv src/components/__tests__/LoginForm.test.tsx src/auth/components/__tests__/
   mv src/components/__tests__/RegisterForm.test.tsx src/auth/components/__tests__/
   mv src/hooks/__tests__/useAuth.test.tsx src/auth/hooks/__tests__/
   mv src/stores/__tests__/authAtoms.test.ts src/auth/stores/__tests__/
   ```

6. **Ejecutar tests:**
   ```bash
   npm run test
   ```

### Fase 3: Migrar Shared (1 hora)

1. **Mover lib:**
   ```bash
   mv src/lib/api.ts src/shared/lib/api.ts
   mv src/lib/queryClient.ts src/shared/lib/queryClient.ts
   ```

2. **Mover stores UI:**
   ```bash
   mv src/stores/uiAtoms.ts src/shared/stores/uiAtoms.ts
   ```

3. **Mover componentes de navegación:**
   ```bash
   mv src/components/Navbar.tsx src/shared/components/navigation/Navbar.tsx
   mv src/components/Footer.tsx src/shared/components/navigation/Footer.tsx
   mv src/components/Sidebar.tsx src/shared/components/navigation/Sidebar.tsx
   ```

4. **Actualizar imports en todos los archivos que usen estos componentes**

5. **Ejecutar tests:**
   ```bash
   npm run test
   ```

### Fase 4: Migrar App Pública (45 min)

1. **Mover componentes:**
   ```bash
   mv src/components/Hero.tsx src/apps/public/features/home/components/
   mv src/components/Downloads.tsx src/apps/public/features/downloads/Downloads.tsx
   mv src/components/DownloadCard.tsx src/apps/public/features/downloads/components/
   mv src/components/Community.tsx src/apps/public/features/community/Community.tsx
   mv src/components/Support.tsx src/apps/public/features/support/Support.tsx
   ```

2. **Actualizar páginas:**
   - Editar `src/pages/index.astro`
   - Editar `src/pages/downloads.astro`
   - Editar `src/pages/community.astro`
   - Editar `src/pages/support.astro`

### Fase 5: Migrar App de Usuario (1 hora)

1. **Mover componentes de account:**
   ```bash
   mv src/components/Account.tsx src/apps/user/features/account/Account.tsx
   mv src/components/AuthenticatedAccount.tsx src/apps/user/features/account/components/
   ```

2. **Mover componentes de players:**
   ```bash
   mv src/components/OnlinePlayers.tsx src/apps/user/features/players/components/
   mv src/hooks/usePlayers.ts src/apps/user/features/players/hooks/
   ```

3. **Crear API separada:**
   - Extraer funciones de `shared/lib/api.ts` relacionadas con account
   - Crear `src/apps/user/features/account/api/accountAPI.ts`
   - Extraer funciones de players
   - Crear `src/apps/user/features/players/api/playersAPI.ts`

4. **Actualizar páginas:**
   - Editar `src/pages/account/index.astro`

5. **Ejecutar tests:**
   ```bash
   npm run test
   ```

### Fase 6: Crear App de Admin (1.5 horas)

Esta fase es nueva, así que crearás componentes desde cero:

1. **Crear Dashboard:**
   ```bash
   # Crear archivo
   touch src/apps/admin/features/dashboard/Dashboard.tsx
   touch src/apps/admin/features/dashboard/components/StatsCard.tsx
   ```

2. **Crear gestión de usuarios:**
   ```bash
   touch src/apps/admin/features/users/Users.tsx
   touch src/apps/admin/features/users/components/UserTable.tsx
   ```

3. **Crear páginas admin:**
   ```bash
   mkdir -p src/pages/admin
   touch src/pages/admin/index.astro
   touch src/pages/admin/users.astro
   ```

### Fase 7: Protección de Rutas (45 min)

1. **Crear middleware:**
   ```bash
   touch middleware.ts
   ```

2. **Implementar protección** (ver TDD para código)

### Fase 8: Limpieza (30 min)

```bash
# ⚠️ SOLO después de verificar que todo funciona
./refactor-helper.sh clean
```

### Fase 9: Testing (1 hora)

```bash
# Tests unitarios
npm run test

# Build
npm run build

# Preview
npm run preview
```

### Fase 10: Deploy

```bash
# Commit
git add .
git commit -m "refactor: migrate to scalable architecture with apps/auth/shared structure"

# Push
git push origin feature/refactor-architecture

# Crear PR
```

## 🔍 Verificación en Cada Fase

Después de cada fase, verifica:

```bash
# 1. Tests pasan
npm run test

# 2. No hay errores de TypeScript
npm run astro check

# 3. La app funciona
npm run dev
```

## 🆘 Troubleshooting

### Error: Cannot find module '@/auth/...'

**Solución:** Reiniciar el servidor de desarrollo
```bash
# Ctrl+C para detener
npm run dev
```

### Tests fallan después de mover archivos

**Solución:** Actualizar imports en los archivos de test

### Build falla

**Solución:** Verificar que todos los imports estén correctos
```bash
npm run astro check
```

## 📊 Progreso

Marca las fases completadas:

- [ ] Fase 1: Preparación
- [ ] Fase 2: Auth
- [ ] Fase 3: Shared
- [ ] Fase 4: App Pública
- [ ] Fase 5: App Usuario
- [ ] Fase 6: App Admin
- [ ] Fase 7: Protección
- [ ] Fase 8: Limpieza
- [ ] Fase 9: Testing
- [ ] Fase 10: Deploy

## 💡 Tips

1. **Commits frecuentes:** Haz commit después de cada fase
2. **Tests primero:** Siempre ejecuta tests antes de continuar
3. **Un archivo a la vez:** No muevas todo de golpe
4. **Buscar y reemplazar:** Usa el IDE para actualizar imports automáticamente
5. **Backup:** Mantén `src.backup` hasta que todo funcione

## 🎯 Resultado Final

Al terminar tendrás:
- ✅ Arquitectura escalable por roles
- ✅ Auth completamente aislado
- ✅ Componentes compartidos centralizados
- ✅ Código organizado por features
- ✅ Fácil agregar nuevos roles o features
