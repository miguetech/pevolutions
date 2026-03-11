import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdateSettings } from '../useUpdateSettings';
import * as accountAPI from '../../api/accountAPI';

vi.mock('../../api/accountAPI', () => ({
  accountAPI: {
    updateSettings: vi.fn(),
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

describe('useUpdateSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update settings successfully', async () => {
    vi.mocked(accountAPI.accountAPI.updateSettings).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useUpdateSettings(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ email: 'new@example.com', flag: 'US' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('should handle partial updates', async () => {
    vi.mocked(accountAPI.accountAPI.updateSettings).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useUpdateSettings(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ email: 'new@example.com' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
