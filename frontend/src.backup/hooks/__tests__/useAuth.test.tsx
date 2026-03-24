import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider, createStore } from 'jotai';
import { authAPI } from '@/lib/api';

// Mock API
vi.mock('@/lib/api', () => ({
  authAPI: {
    login: vi.fn(),
  },
  accountAPI: {
    getStats: vi.fn(),
  },
}));

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
    vi.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
  });

  it('should initialize as not authenticated', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('should login successfully', async () => {
    vi.mocked(authAPI.login).mockResolvedValue({
      access_token: 'test-token-123',
      token_type: 'bearer',
    });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    
    const loginResult = await result.current.login('testuser', 'password123');
    
    await waitFor(() => {
      expect(loginResult.success).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.token).toBe('test-token-123');
    });
  });

  it('should handle login failure', async () => {
    vi.mocked(authAPI.login).mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    
    const loginResult = await result.current.login('wronguser', 'wrongpass');
    
    expect(loginResult.success).toBe(false);
    expect(loginResult.error).toBe('Invalid credentials');
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should logout successfully', async () => {
    vi.mocked(authAPI.login).mockResolvedValue({
      access_token: 'test-token-123',
      token_type: 'bearer',
    });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    
    // Login first
    await result.current.login('testuser', 'password123');
    
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    // Logout
    result.current.logout();
    
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
    });
    
    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
  });
});
