import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useServerInfo, useTopPlayers, useTopGuilds } from '../useServer';
import * as serverAPI from '@/shared/api/serverAPI';

vi.mock('@/shared/api/serverAPI');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useServerInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch server info', async () => {
    const mockData = {
      online_count: 42,
      status: 'online',
      uptime: '99.9%',
      version: '1.0.0',
    };

    vi.mocked(serverAPI.serverAPI.getInfo).mockResolvedValue(mockData);

    const { result } = renderHook(() => useServerInfo(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });
});

describe('useTopPlayers', () => {
  it('should fetch top players', async () => {
    const mockData = [
      { name: 'Player1', level: 100, score: 5000 },
      { name: 'Player2', level: 95, score: 4500 },
    ];

    vi.mocked(serverAPI.serverAPI.getTopPlayers).mockResolvedValue(mockData);

    const { result } = renderHook(() => useTopPlayers(5), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });
});

describe('useTopGuilds', () => {
  it('should fetch top guilds', async () => {
    const mockData = [
      { name: 'Guild1', members: 50, points: '1.2M', tag: 'Competitive' },
    ];

    vi.mocked(serverAPI.serverAPI.getTopGuilds).mockResolvedValue(mockData);

    const { result } = renderHook(() => useTopGuilds(5), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });
});
