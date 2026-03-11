# 💻 Ejemplos de Código - Refactorización

## 🔐 Auth - Componente ProtectedRoute

```typescript
// src/auth/components/ProtectedRoute.tsx
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';

interface Props {
  children: React.ReactNode;
  permission?: string;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  permission, 
  requireAdmin, 
  fallback 
}: Props) {
  const { isAuthenticated } = useAuth();
  const { can, isAdmin } = usePermissions();

  if (!isAuthenticated) {
    return fallback || <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin) {
    return fallback || <div>Acceso denegado</div>;
  }

  if (permission && !can(permission)) {
    return fallback || <div>Sin permisos</div>;
  }

  return <>{children}</>;
}
```

## 🛡️ Middleware de Protección

```typescript
// middleware.ts
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ url, cookies, redirect }, next) => {
  const token = cookies.get('token')?.value;
  const path = url.pathname;

  // Proteger rutas admin
  if (path.startsWith('/admin')) {
    if (!token) {
      return redirect('/login?redirect=' + path);
    }
    
    // Verificar rol (decodificar JWT)
    const user = await verifyToken(token);
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return redirect('/account');
    }
  }

  // Proteger rutas de usuario
  if (path.startsWith('/account')) {
    if (!token) {
      return redirect('/login?redirect=' + path);
    }
  }

  return next();
});
```

## 📱 Feature - Account API

```typescript
// src/apps/user/features/account/api/accountAPI.ts
import { api } from '@/shared/lib/api';

export interface AccountStats {
  total_players: number;
  online_players: number;
  total_playtime: number;
}

export const accountAPI = {
  getStats: () => 
    api.get('api/account/stats').json<AccountStats>(),
  
  getMe: () => 
    api.get('api/account/me').json<User>(),
  
  changePassword: (current_password: string, new_password: string) =>
    api.put('api/account/password', { 
      json: { current_password, new_password } 
    }).json(),
};
```

## 🎣 Feature - Account Hook

```typescript
// src/apps/user/features/account/hooks/useAccountStats.ts
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

## 🎨 Feature - Account Component

```typescript
// src/apps/user/features/account/Account.tsx
import { useAccountStats } from './hooks/useAccountStats';

export function Account() {
  const { data: stats, isLoading, error } = useAccountStats();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Mi Cuenta</h1>
      <div>
        <p>Jugadores totales: {stats?.total_players}</p>
        <p>Jugadores online: {stats?.online_players}</p>
      </div>
    </div>
  );
}
```

## 📄 Página de Usuario

```astro
---
// src/pages/account/index.astro
import UserLayout from '@/apps/user/layouts/UserLayout.astro';
import { Account } from '@/apps/user/features/account/Account';
import { Providers } from '@/shared/components/providers/Providers';
---

<UserLayout>
  <Providers>
    <Account client:load />
  </Providers>
</UserLayout>
```

## 👨‍💼 Admin - Dashboard Component

```typescript
// src/apps/admin/features/dashboard/Dashboard.tsx
import { useDashboardStats } from './hooks/useDashboardStats';
import { StatsCard } from './components/StatsCard';

export function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatsCard 
        title="Total Usuarios" 
        value={stats?.total_users} 
        icon="users"
      />
      <StatsCard 
        title="Usuarios Online" 
        value={stats?.online_users} 
        icon="activity"
      />
      <StatsCard 
        title="Total Jugadores" 
        value={stats?.total_players} 
        icon="gamepad"
      />
    </div>
  );
}
```

## 🔧 Admin - Users API

```typescript
// src/apps/admin/features/users/api/usersAPI.ts
import { api } from '@/shared/lib/api';
import type { User } from '@/auth/types/user';

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: string;
}

export const usersAPI = {
  getAll: (params?: { limit?: number; offset?: number }) =>
    api.get('api/admin/users', { searchParams: params }).json<User[]>(),
  
  getById: (id: number) =>
    api.get(`api/admin/users/${id}`).json<User>(),
  
  update: (id: number, data: UpdateUserData) =>
    api.put(`api/admin/users/${id}`, { json: data }).json<User>(),
  
  delete: (id: number) =>
    api.delete(`api/admin/users/${id}`).json(),
};
```

## 🎣 Admin - Users Hook

```typescript
// src/apps/admin/features/users/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI } from '../api/usersAPI';

export function useUsers() {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => usersAPI.getAll(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      usersAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => usersAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  return {
    users: usersQuery.data,
    isLoading: usersQuery.isLoading,
    error: usersQuery.error,
    updateUser: updateMutation.mutate,
    deleteUser: deleteMutation.mutate,
  };
}
```

## 🎨 Shared - Button Component

```typescript
// src/shared/components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'rounded font-medium transition-colors';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };
  
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

## 🔄 Uso de Componentes Compartidos

```typescript
// Ejemplo de uso en cualquier feature
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { useToast } from '@/shared/hooks/useToast';

export function MyFeature() {
  const { showToast } = useToast();

  const handleClick = () => {
    showToast('Acción completada', 'success');
  };

  return (
    <div>
      <Button variant="primary" onClick={handleClick}>
        Guardar
      </Button>
    </div>
  );
}
```

## 📝 Convenciones de Imports

```typescript
// ✅ CORRECTO - Usar aliases
import { useAuth } from '@/auth/hooks/useAuth';
import { Button } from '@/shared/components/ui/Button';
import { Account } from '@/apps/user/features/account/Account';
import { Dashboard } from '@/apps/admin/features/dashboard/Dashboard';

// ❌ INCORRECTO - Imports relativos largos
import { useAuth } from '../../../auth/hooks/useAuth';
import { Button } from '../../shared/components/ui/Button';
```

## 🧪 Ejemplo de Test

```typescript
// src/auth/components/__tests__/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../LoginForm';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/lib/queryClient';

describe('LoginForm', () => {
  it('should submit login form', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <LoginForm />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: 'testuser' },
    });
    
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });
});
```

---

**Nota:** Estos son ejemplos de referencia. Adapta según las necesidades específicas de tu proyecto.
