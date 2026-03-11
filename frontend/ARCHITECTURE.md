# Arquitectura Frontend - Pevolutions

## 📁 Estructura de Directorios

```
src/
├── apps/               # Aplicaciones por rol
│   ├── public/        # App pública
│   ├── user/          # App de usuario autenticado
│   └── admin/         # App de administración
├── auth/              # Dominio de autenticación
├── shared/            # Código compartido
└── pages/             # Páginas de Astro
```

## 🎯 Convenciones de Imports

```typescript
// Autenticación
import { useAuth } from '@/auth/hooks/useAuth';
import { LoginForm } from '@/auth/components/LoginForm';

// Features de usuario
import { Account } from '@/apps/user/features/account/Account';

// Features de admin
import { Dashboard } from '@/apps/admin/features/dashboard/Dashboard';

// Componentes compartidos
import { Button } from '@/shared/components/ui/Button';
```

## 🔐 Sistema de Permisos

Ver `src/auth/utils/rbac.ts` para la configuración de permisos por rol.

## 📚 Recursos

- [TDD de Refactorización](./REFACTOR_TDD.md)
- [Documentación de Astro](https://docs.astro.build)
