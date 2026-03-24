import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePlayersList } from '../usePlayersList';
import * as playersAPI from '../../api/playersAPI';

vi.mock('../../api/playersAPI', () => ({
  getPlayers: vi.fn(),
  playersAPI: {
    getPlayers: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('usePlayersList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch players list successfully', async () => {
    const mockPlayers = [
      { id: 1, name: 'Sylarnal', level: 85, vocation: 1, health: 200, healthmax: 200, experience: 50000, sex: 0 },
      { id: 2, name: 'Trainer2', level: 42, vocation: 2, health: 150, healthmax: 150, experience: 20000, sex: 1 },
    ];

    vi.mocked(playersAPI.playersAPI.getPlayers).mockResolvedValue(mockPlayers);

    const { result } = renderHook(() => usePlayersList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockPlayers);
  });
});
