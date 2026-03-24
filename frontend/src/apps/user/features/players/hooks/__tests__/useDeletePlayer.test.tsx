import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeletePlayer } from '../useDeletePlayer';
import * as playersAPI from '../../api/playersAPI';

vi.mock('../../api/playersAPI', () => ({
  deletePlayer: vi.fn(),
  playersAPI: {
    deletePlayer: vi.fn(),
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

describe('useDeletePlayer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete player successfully', async () => {
    vi.mocked(playersAPI.playersAPI.deletePlayer).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useDeletePlayer(), {
      wrapper: createWrapper(),
    });

    result.current.mutate('TestChar');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
