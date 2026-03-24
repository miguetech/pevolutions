# Stack Recomendado para PEvolutions Frontend

## 📦 Instalación

```bash
cd frontend
npm install jotai @tanstack/react-query ky
npm install @tanstack/react-query-devtools --save-dev
```

---

## 🏗️ Estructura de Carpetas

```
frontend/src/
├── lib/
│   ├── api.ts              # Cliente HTTP (ky)
│   └── queryClient.ts      # Configuración TanStack Query
│
├── stores/
│   ├── authAtoms.ts        # Auth state (Jotai)
│   └── uiAtoms.ts          # UI state (Jotai)
│
├── hooks/
│   ├── useAuth.ts          # Hook personalizado auth
│   └── usePlayers.ts       # Hook para players (TanStack Query)
│
└── components/
    ├── providers/
    │   └── Providers.tsx   # QueryClientProvider
    └── ...
```

---

## 🔧 Configuración

### 1. Cliente HTTP (ky)

```typescript
// src/lib/api.ts
import ky from 'ky';

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000';

export const api = ky.create({
  prefixUrl: API_URL,
  timeout: 10000,
  retry: {
    limit: 2,
    methods: ['get'],
  },
  hooks: {
    beforeRequest: [
      (request) => {
        // Token se agrega desde el hook
        const token = sessionStorage.getItem('token');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          // Token expirado, limpiar y redirigir
          sessionStorage.removeItem('token');
          window.location.href = '/login';
        }
      },
    ],
  },
});

// API functions
export const authAPI = {
  login: (name: string, password: string) =>
    api.post('api/auth/login', { json: { name, password } }).json<{ access_token: string }>(),
  
  register: (name: string, password: string, email: string) =>
    api.post('api/auth/register', { json: { name, password, email } }).json(),
};

export const playersAPI = {
  getAll: () => api.get('api/players/').json<Player[]>(),
  
  getOnline: (params?: { limit?: number; sort_by?: string }) =>
    api.get('api/players/online', { searchParams: params }).json<Player[]>(),
  
  create: (data: { name: string; sex: number }) =>
    api.post('api/players/', { json: data }).json<Player>(),
  
  update: (name: string, data: Partial<Player>) =>
    api.put(`api/players/${name}`, { json: data }).json<Player>(),
  
  delete: (name: string) =>
    api.delete(`api/players/${name}`).json(),
};

export const accountAPI = {
  getStats: () => api.get('api/account/stats').json(),
  
  changePassword: (current_password: string, new_password: string) =>
    api.put('api/account/password', { json: { current_password, new_password } }).json(),
};

// Types
export interface Player {
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

---

### 2. TanStack Query Config

```typescript
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 10, // 10 minutos (antes cacheTime)
      retry: 2,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

---

### 3. Auth State (Jotai)

```typescript
// src/stores/authAtoms.ts
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Atoms
export const tokenAtom = atomWithStorage<string | null>('token', null);
export const userAtom = atom<User | null>(null);

// Derived atoms
export const isAuthenticatedAtom = atom((get) => get(tokenAtom) !== null);

// Types
export interface User {
  id: number;
  name: string;
  email: string;
}
```

---

### 4. UI State (Jotai)

```typescript
// src/stores/uiAtoms.ts
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const themeAtom = atomWithStorage<'light' | 'dark'>('theme', 'dark');
export const languageAtom = atomWithStorage<'en' | 'es' | 'pt'>('language', 'en');
export const sidebarOpenAtom = atom(false);
```

---

### 5. Auth Hook

```typescript
// src/hooks/useAuth.ts
import { useAtom, useSetAtom } from 'jotai';
import { tokenAtom, userAtom } from '@/stores/authAtoms';
import { authAPI, accountAPI } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

export function useAuth() {
  const [token, setToken] = useAtom(tokenAtom);
  const [user, setUser] = useAtom(userAtom);
  const queryClient = useQueryClient();

  const login = async (username: string, password: string) => {
    try {
      const { access_token } = await authAPI.login(username, password);
      
      // Guardar token
      setToken(access_token);
      sessionStorage.setItem('token', access_token);
      
      // Fetch user data
      const userData = await accountAPI.getStats();
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('token');
    queryClient.clear(); // Limpiar cache
  };

  return {
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout,
  };
}
```

---

### 6. Players Hook (TanStack Query)

```typescript
// src/hooks/usePlayers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { playersAPI } from '@/lib/api';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '@/stores/authAtoms';

export function usePlayers() {
  const token = useAtomValue(tokenAtom);

  return useQuery({
    queryKey: ['players'],
    queryFn: playersAPI.getAll,
    enabled: !!token, // Solo fetch si hay token
  });
}

export function useOnlinePlayers(params?: { limit?: number; sort_by?: string }) {
  return useQuery({
    queryKey: ['players', 'online', params],
    queryFn: () => playersAPI.getOnline(params),
    refetchInterval: 30000, // Refetch cada 30 segundos
  });
}

export function useCreatePlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: playersAPI.create,
    onSuccess: () => {
      // Invalidar cache para refetch
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
}

export function useUpdatePlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, data }: { name: string; data: any }) =>
      playersAPI.update(name, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
}

export function useDeletePlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: playersAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
}
```

---

### 7. Providers Component

```typescript
// src/components/providers/Providers.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/queryClient';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

## 🎨 Uso en Componentes

### Login Component

```typescript
// src/components/LoginForm.tsx
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(username, password);
    
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
  };

  if (isAuthenticated) {
    return <div>Already logged in</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <div className="error">{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
}
```

---

### Players List Component

```typescript
// src/components/PlayersList.tsx
import { usePlayers, useCreatePlayer, useDeletePlayer } from '@/hooks/usePlayers';

export function PlayersList() {
  const { data: players, isLoading, error } = usePlayers();
  const createMutation = useCreatePlayer();
  const deleteMutation = useDeletePlayer();

  const handleCreate = () => {
    createMutation.mutate({
      name: 'NewPlayer',
      sex: 0,
    });
  };

  const handleDelete = (name: string) => {
    if (confirm(`Delete ${name}?`)) {
      deleteMutation.mutate(name);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={handleCreate} disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Creating...' : 'Create Player'}
      </button>

      <ul>
        {players?.map((player) => (
          <li key={player.id}>
            {player.name} - Level {player.level}
            <button
              onClick={() => handleDelete(player.name)}
              disabled={deleteMutation.isPending}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### Online Players Component

```typescript
// src/components/OnlinePlayers.tsx
import { useState } from 'react';
import { useOnlinePlayers } from '@/hooks/usePlayers';

export function OnlinePlayers() {
  const [sortBy, setSortBy] = useState<'level' | 'captures'>('level');
  const { data: players, isLoading } = useOnlinePlayers({
    limit: 10,
    sort_by: sortBy,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
        <option value="level">Level</option>
        <option value="captures">Captures</option>
      </select>

      <ul>
        {players?.map((player) => (
          <li key={player.id}>
            {player.name} - Level {player.level}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### Theme Toggle Component

```typescript
// src/components/ThemeToggle.tsx
import { useAtom } from 'jotai';
import { themeAtom } from '@/stores/uiAtoms';

export function ThemeToggle() {
  const [theme, setTheme] = useAtom(themeAtom);

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}
```

---

## 🚀 Integración con Astro

### Layout con Providers

```astro
---
// src/layouts/Layout.astro
import { Providers } from '@/components/providers/Providers';
---

<html>
  <head>
    <title>PEvolutions</title>
  </head>
  <body>
    <Providers client:load>
      <slot />
    </Providers>
  </body>
</html>
```

### Página con React Islands

```astro
---
// src/pages/players.astro
import Layout from '@/layouts/Layout.astro';
import { PlayersList } from '@/components/PlayersList';
---

<Layout>
  <h1>My Players</h1>
  <PlayersList client:load />
</Layout>
```

---

## 📊 Resumen del Stack

```
┌─────────────────────────────────────────────────────────────┐
│ UI STATE (Jotai)                                            │
│ - theme, language, sidebar                                  │
│ - Granularidad automática                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ AUTH STATE (Jotai)                                          │
│ - token, user, isAuthenticated                              │
│ - Persist en localStorage                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SERVER STATE (TanStack Query)                               │
│ - players, events, guilds                                   │
│ - Cache, revalidación, mutations                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ HTTP CLIENT (ky)                                            │
│ - Retry, timeout, interceptors                              │
│ - Token automático en headers                               │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Ventajas de este Stack

1. **Escalable** - Granularidad automática con Jotai
2. **Performance** - Cache inteligente con TanStack Query
3. **Simple** - Hooks personalizados ocultan complejidad
4. **TypeScript** - Todo tipado
5. **DevTools** - React Query DevTools para debugging
6. **Pequeño** - ~20kb total (Jotai 3kb + TanStack Query 12kb + ky 4kb)
