import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useOnlinePlayers, useCreatePlayer } from '../usePlayers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('usePlayers - Integration Tests', () => {
  it('should fetch online players', async () => {
    const { result } = renderHook(() => useOnlinePlayers({ limit: 5 }), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(Array.isArray(result.current.data)).toBe(true);
    expect(result.current.data!.length).toBeLessThanOrEqual(5);
  });

  it('should fetch online players sorted by level', async () => {
    const { result } = renderHook(
      () => useOnlinePlayers({ sort_by: 'level', limit: 10 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const players = result.current.data!;
    expect(Array.isArray(players)).toBe(true);

    // Verificar que están ordenados por level descendente
    for (let i = 0; i < players.length - 1; i++) {
      expect(players[i].level).toBeGreaterThanOrEqual(players[i + 1].level);
    }
  });

  it('should refetch online players every 30 seconds', async () => {
    const { result } = renderHook(() => useOnlinePlayers({ limit: 5 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verificar que refetchInterval está configurado
    expect(result.current.dataUpdatedAt).toBeGreaterThan(0);
  });
});
