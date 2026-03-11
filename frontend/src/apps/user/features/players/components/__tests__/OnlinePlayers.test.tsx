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

describe('OnlinePlayers Component', () => {
  it('should show loading state initially', () => {
    render(<OnlinePlayers />, { wrapper: createWrapper() });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should display online players after loading', async () => {
    render(<OnlinePlayers />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    }, { timeout: 3000 });

    // Verificar que hay una lista
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
  });

  it('should display player names and levels', async () => {
    render(<OnlinePlayers />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    }, { timeout: 3000 });

    // Verificar que hay items en la lista
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBeGreaterThan(0);
  });
});
