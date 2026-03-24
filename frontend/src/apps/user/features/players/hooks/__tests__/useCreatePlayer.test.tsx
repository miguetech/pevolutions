import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreatePlayer } from '../useCreatePlayer';
import * as playersAPI from '../../api/playersAPI';

vi.mock('../../api/playersAPI', () => ({
  createPlayer: vi.fn(),
  playersAPI: {
    createPlayer: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCreatePlayer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create player successfully', async () => {
    const mockPlayer = { id: 1, name: 'TestChar', level: 1, vocation: 0, health: 100, healthmax: 100, experience: 0, sex: 0 };
    vi.mocked(playersAPI.playersAPI.createPlayer).mockResolvedValue(mockPlayer);

    const { result } = renderHook(() => useCreatePlayer(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ name: 'TestChar', sex: 0 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
