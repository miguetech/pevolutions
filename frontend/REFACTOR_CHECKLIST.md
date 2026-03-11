# ✅ Checklist de Refactorización

## 🎯 Preparación
- [ ] Crear rama: `git checkout -b feature/refactor-architecture`
- [ ] Backup: `cp -r src src.backup`
- [ ] Tests pasan: `npm run test`

## 📦 Fase 1: Setup (30 min)
- [ ] `./refactor-helper.sh fase1`
- [ ] Verificar directorios creados
- [ ] Verificar `tsconfig.json` actualizado

## 🔐 Fase 2: Auth (1h)
- [ ] `./refactor-helper.sh fase2`
- [ ] Mover `stores/authAtoms.ts` → `auth/stores/`
- [ ] Mover `hooks/useAuth.ts` → `auth/hooks/`
- [ ] Mover `LoginForm.tsx` → `auth/components/`
- [ ] Mover `RegisterForm.tsx` → `auth/components/`
- [ ] Mover `ChangePasswordForm.tsx` → `auth/components/`
- [ ] Mover tests de auth
- [ ] Actualizar imports
- [ ] `npm run test` ✅

## 🔧 Fase 3: Shared (1h)
- [ ] Mover `lib/api.ts` → `shared/lib/`
- [ ] Mover `lib/queryClient.ts` → `shared/lib/`
- [ ] Mover `stores/uiAtoms.ts` → `shared/stores/`
- [ ] Mover `Navbar.tsx` → `shared/components/navigation/`
- [ ] Mover `Footer.tsx` → `shared/components/navigation/`
- [ ] Actualizar imports
- [ ] `npm run test` ✅

## 🌐 Fase 4: Public (45 min)
- [ ] Mover `Hero.tsx` → `apps/public/features/home/components/`
- [ ] Mover `Downloads.tsx` → `apps/public/features/downloads/`
- [ ] Mover `Community.tsx` → `apps/public/features/community/`
- [ ] Actualizar páginas públicas

## 👤 Fase 5: User (1h)
- [ ] Mover `Account.tsx` → `apps/user/features/account/`
- [ ] Mover `OnlinePlayers.tsx` → `apps/user/features/players/components/`
- [ ] Mover `usePlayers.ts` → `apps/user/features/players/hooks/`
- [ ] Crear APIs separadas
- [ ] Mover tests
- [ ] `npm run test` ✅

## 👨‍💼 Fase 6: Admin (1.5h)
- [ ] Crear Dashboard
- [ ] Crear Users management
- [ ] Crear Players management
- [ ] Crear Logs
- [ ] Crear páginas admin

## 🔒 Fase 7: Protección (45 min)
- [ ] Crear `middleware.ts`
- [ ] Proteger rutas `/account/*`
- [ ] Proteger rutas `/admin/*`

## 🧹 Fase 8: Limpieza (30 min)
- [ ] `./refactor-helper.sh clean`
- [ ] Eliminar `*WithProvider.tsx`

## 🧪 Fase 9: Testing (1h)
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] Probar manualmente

## 🚀 Fase 10: Deploy (30 min)
- [ ] Commit y push
- [ ] Crear PR

---

⏱️ **Tiempo Total: 8-10 horas**
