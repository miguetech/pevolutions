import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChangePasswordForm } from '../ChangePasswordForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'jotai';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Provider>{children}</Provider>
    </QueryClientProvider>
  );
};

describe('ChangePasswordForm Component', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render password change form', () => {
    render(<ChangePasswordForm onSuccess={mockOnSuccess} />, { wrapper: createWrapper() });
    
    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^new password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<ChangePasswordForm onSuccess={mockOnSuccess} />, { wrapper: createWrapper() });
    
    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);
    
    expect(await screen.findByText(/current password is required/i)).toBeInTheDocument();
  });

  it('should validate password match', async () => {
    const user = userEvent.setup();
    render(<ChangePasswordForm onSuccess={mockOnSuccess} />, { wrapper: createWrapper() });
    
    const currentInput = screen.getByLabelText(/current password/i);
    const newInput = screen.getByLabelText(/^new password$/i);
    const confirmInput = screen.getByLabelText(/confirm new password/i);
    const submitButton = screen.getByRole('button', { name: /save/i });
    
    await user.type(currentInput, 'oldpass123');
    await user.type(newInput, 'newpass123');
    await user.type(confirmInput, 'different');
    await user.click(submitButton);
    
    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });
});
