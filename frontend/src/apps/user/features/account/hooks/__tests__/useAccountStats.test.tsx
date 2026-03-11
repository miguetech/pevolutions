import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAccountStats } from '../useAccountStats';
import * as accountAPI from '../../api/accountAPI';

vi.mock('../../api/accountAPI', () => ({
  accountAPI: {
    getStats: vi.fn(),
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

describe('useAccountStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch account stats successfully', async () => {
    const mockStats = {
      total_playing_time: 45000,
      pokemon_caught: 1240,
      world_ranking: 4520,
    };

    vi.mocked(accountAPI.accountAPI.getStats).mockResolvedValue(mockStats);

    const { result } = renderHook(() => useAccountStats(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockStats);
  });

  it('should handle error when fetching stats fails', async () => {
    vi.mocked(accountAPI.accountAPI.getStats).mockRejectedValue(new Error('Failed'));

    const { result } = renderHook(() => useAccountStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});
