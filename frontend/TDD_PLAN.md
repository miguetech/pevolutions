# TDD Plan: Conectar Frontend con Backend

## 🎯 Objetivo
Conectar frontend (Astro + React) con backend (FastAPI) usando TDD.

---

## 📋 Plan de Implementación (TDD)

### Fase 1: Setup Inicial ✅
**Tiempo estimado:** 15 minutos

#### 1.1 Instalar dependencias
```bash
cd frontend
npm install jotai @tanstack/react-query ky
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

#### 1.2 Configurar Vitest
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
```

#### 1.3 Setup de tests
```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

---

### Fase 2: API Client (ky) 🔴 RED → 🟢 GREEN
**Tiempo estimado:** 20 minutos

#### Test 2.1: Cliente API básico
```typescript
// src/lib/__tests__/api.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { api, authAPI } from '../api';

describe('API Client', () => {
  it('should have correct base URL', () => {
    expect(api.defaults.prefixUrl).toBe('http://localhost:8000');
  });

  it('should have timeout configured', () => {
    expect(api.defaults.timeout).toBe(10000);
  });
});

describe('Auth API', () => {
  it('should login successfully', async () => {
    // Este test fallará primero (RED)
    const result = await authAPI.login('testuser', 'test123');
    expect(result).toHaveProperty('access_token');
    expect(typeof result.access_token).toBe('string');
  });
});
```

#### Implementación 2.1: Cliente API
```typescript
// src/lib/api.ts
import ky from 'ky';

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000';

export const api = ky.create({
  prefixUrl: API_URL,
  timeout: 10000,
  retry: 2,
});

export const authAPI = {
  login: (name: string, password: string) =>
    api.post('api/auth/login', { json: { name, password } }).json<{ access_token: string }>(),
};
```

**Ejecutar test:**
```bash
npm run test
```

---

### Fase 3: Auth Store (Jotai) 🔴 RED → 🟢 GREEN
**Tiempo estimado:** 15 minutos

#### Test 3.1: Auth atoms
```typescript
// src/stores/__tests__/authAtoms.test.ts
import { describe, it, expect } from 'vitest';
import { createStore } from 'jotai';
import { tokenAtom, userAtom, isAuthenticatedAtom } from '../authAtoms';

describe('Auth Atoms', () => {
  it('should initialize with null token', () => {
    const store = createStore();
    expect(store.get(tokenAtom)).toBeNull();
  });

  it('should set token', () => {
    const store = createStore();
    store.set(tokenAtom, 'test-token');
    expect(store.get(tokenAtom)).toBe('test-token');
  });

  it('should derive isAuthenticated from token', () => {
    const store = createStore();
    expect(store.get(isAuthenticatedAtom)).toBe(false);
    
    store.set(tokenAtom, 'test-token');
    expect(store.get(isAuthenticatedAtom)).toBe(true);
  });
});
```

#### Implementación 3.1: Auth atoms
```typescript
// src/stores/authAtoms.ts
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const tokenAtom = atomWithStorage<string | null>('token', null);
export const userAtom = atom<User | null>(null);
export const isAuthenticatedAtom = atom((get) => get(tokenAtom) !== null);

export interface User {
  id: number;
  name: string;
  email: string;
}
```

---

### Fase 4: useAuth Hook 🔴 RED → 🟢 GREEN
**Tiempo estimado:** 25 minutos

#### Test 4.1: useAuth hook
```typescript
// src/hooks/__tests__/useAuth.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'jotai';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Provider>{children}</Provider>
    </QueryClientProvider>
  );
};

describe('useAuth', () => {
  it('should initialize as not authenticated', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    
    const loginResult = await result.current.login('testuser', 'test123');
    
    await waitFor(() => {
      expect(loginResult.success).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.token).toBeTruthy();
    });
  });

  it('should logout successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    
    await result.current.login('testuser', 'test123');
    result.current.logout();
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
  });
});
```

#### Implementación 4.1: useAuth hook
```typescript
// src/hooks/useAuth.ts
import { useAtom } from 'jotai';
import { tokenAtom, userAtom } from '@/stores/authAtoms';
import { authAPI } from '@/lib/api';

export function useAuth() {
  const [token, setToken] = useAtom(tokenAtom);
  const [user, setUser] = useAtom(userAtom);

  const login = async (username: string, password: string) => {
    try {
      const { access_token } = await authAPI.login(username, password);
      setToken(access_token);
      sessionStorage.setItem('token', access_token);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('token');
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

### Fase 5: Players API 🔴 RED → 🟢 GREEN
**Tiempo estimado:** 20 minutos

#### Test 5.1: Players API
```typescript
// src/lib/__tests__/playersAPI.test.ts
import { describe, it, expect } from 'vitest';
import { playersAPI } from '../api';

describe('Players API', () => {
  it('should fetch online players', async () => {
    const players = await playersAPI.getOnline({ limit: 5 });
    expect(Array.isArray(players)).toBe(true);
    expect(players.length).toBeLessThanOrEqual(5);
  });

  it('should fetch online players sorted by level', async () => {
    const players = await playersAPI.getOnline({ sort_by: 'level', limit: 10 });
    expect(Array.isArray(players)).toBe(true);
    
    // Verificar que están ordenados
    for (let i = 0; i < players.length - 1; i++) {
      expect(players[i].level).toBeGreaterThanOrEqual(players[i + 1].level);
    }
  });
});
```

#### Implementación 5.1: Players API
```typescript
// src/lib/api.ts (agregar)
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

export const playersAPI = {
  getOnline: (params?: { limit?: number; sort_by?: string }) =>
    api.get('api/players/online', { searchParams: params }).json<Player[]>(),
  
  getAll: () => api.get('api/players/').json<Player[]>(),
  
  create: (data: { name: string; sex: number }) =>
    api.post('api/players/', { json: data }).json<Player>(),
};
```

---

### Fase 6: usePlayers Hook 🔴 RED → 🟢 GREEN
**Tiempo estimado:** 20 minutos

#### Test 6.1: usePlayers hook
```typescript
// src/hooks/__tests__/usePlayers.test.tsx
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useOnlinePlayers } from '../usePlayers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('usePlayers', () => {
  it('should fetch online players', async () => {
    const { result } = renderHook(() => useOnlinePlayers({ limit: 5 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(Array.isArray(result.current.data)).toBe(true);
    expect(result.current.data?.length).toBeLessThanOrEqual(5);
  });
});
```

#### Implementación 6.1: usePlayers hook
```typescript
// src/hooks/usePlayers.ts
import { useQuery } from '@tanstack/react-query';
import { playersAPI } from '@/lib/api';

export function useOnlinePlayers(params?: { limit?: number; sort_by?: string }) {
  return useQuery({
    queryKey: ['players', 'online', params],
    queryFn: () => playersAPI.getOnline(params),
    refetchInterval: 30000, // 30 segundos
  });
}
```

---

### Fase 7: Componente OnlinePlayers 🔴 RED → 🟢 GREEN
**Tiempo estimado:** 25 minutos

#### Test 7.1: OnlinePlayers component
```typescript
// src/components/__tests__/OnlinePlayers.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { OnlinePlayers } from '../OnlinePlayers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('OnlinePlayers', () => {
  it('should show loading state', () => {
    render(<OnlinePlayers />, { wrapper: createWrapper() });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should display online players', async () => {
    render(<OnlinePlayers />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Verificar que hay jugadores
    const playerElements = screen.getAllByRole('listitem');
    expect(playerElements.length).toBeGreaterThan(0);
  });
});
```

#### Implementación 7.1: OnlinePlayers component
```typescript
// src/components/OnlinePlayers.tsx
import { useState } from 'react';
import { useOnlinePlayers } from '@/hooks/usePlayers';

export function OnlinePlayers() {
  const [sortBy, setSortBy] = useState<'level' | 'captures'>('level');
  const { data: players, isLoading, error } = useOnlinePlayers({
    limit: 10,
    sort_by: sortBy,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading players</div>;

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

## 📊 Checklist de Implementación

### Setup
- [ ] Instalar dependencias (jotai, react-query, ky, vitest)
- [ ] Configurar Vitest
- [ ] Crear setup de tests

### API Client
- [ ] Test: Cliente API básico
- [ ] Implementar: Cliente ky con configuración
- [ ] Test: Auth API login
- [ ] Implementar: authAPI.login()
- [ ] ✅ Tests pasan

### Auth Store
- [ ] Test: tokenAtom inicializa null
- [ ] Test: tokenAtom se puede setear
- [ ] Test: isAuthenticatedAtom deriva de token
- [ ] Implementar: authAtoms.ts
- [ ] ✅ Tests pasan

### useAuth Hook
- [ ] Test: inicializa no autenticado
- [ ] Test: login exitoso
- [ ] Test: logout exitoso
- [ ] Implementar: useAuth.ts
- [ ] ✅ Tests pasan

### Players API
- [ ] Test: fetch online players
- [ ] Test: fetch con sort_by
- [ ] Implementar: playersAPI
- [ ] ✅ Tests pasan

### usePlayers Hook
- [ ] Test: fetch online players
- [ ] Implementar: useOnlinePlayers
- [ ] ✅ Tests pasan

### Componente OnlinePlayers
- [ ] Test: muestra loading
- [ ] Test: muestra jugadores
- [ ] Implementar: OnlinePlayers.tsx
- [ ] ✅ Tests pasan

---

## 🚀 Comandos

```bash
# Instalar dependencias
npm install jotai @tanstack/react-query ky
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Ejecutar tests
npm run test

# Ejecutar tests en watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Iniciar backend (en otra terminal)
cd ../backend
source venv/bin/activate
uvicorn app.main:app --reload

# Iniciar frontend
npm run dev
```

---

## 📈 Progreso Esperado

| Fase | Tiempo | Tests | Implementación |
|------|--------|-------|----------------|
| 1. Setup | 15 min | - | Config |
| 2. API Client | 20 min | 3 | api.ts |
| 3. Auth Store | 15 min | 3 | authAtoms.ts |
| 4. useAuth | 25 min | 3 | useAuth.ts |
| 5. Players API | 20 min | 2 | playersAPI |
| 6. usePlayers | 20 min | 1 | usePlayers.ts |
| 7. Component | 25 min | 2 | OnlinePlayers.tsx |
| **Total** | **2h 20min** | **14 tests** | **7 archivos** |

---

## ✅ Resultado Final

Al completar este plan tendrás:

1. ✅ Frontend conectado al backend
2. ✅ 14 tests automatizados
3. ✅ Auth funcional (login/logout)
4. ✅ Lista de jugadores online
5. ✅ Base sólida para agregar más features
6. ✅ Cobertura de tests >80%

---

## 🎯 Siguiente Paso

**Empezar con Fase 1: Setup Inicial**

¿Quieres que te ayude a implementar la Fase 1?
