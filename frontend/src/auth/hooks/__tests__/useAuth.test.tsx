import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider, createStore } from 'jotai';
import { Role } from '../../types/user';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const store = createStore();
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>{children}</Provider>
    </QueryClientProvider>
  );
};

describe('useAuth', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('should initialize as not authenticated', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('should set token and user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    
    act(() => {
      result.current.setToken('test-token-123');
      result.current.setUser({
        id: 1,
        name: 'testuser',
        email: 'test@example.com',
        role: Role.USER,
      });
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe('test-token-123');
    expect(result.current.user?.name).toBe('testuser');
  });

  it('should logout successfully', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    
    // Set auth state first
    act(() => {
      result.current.setToken('test-token-123');
      result.current.setUser({
        id: 1,
        name: 'testuser',
        email: 'test@example.com',
        role: Role.USER,
      });
    });
    
    expect(result.current.isAuthenticated).toBe(true);

    // Logout
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
  });
});
