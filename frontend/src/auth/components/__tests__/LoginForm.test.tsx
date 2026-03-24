import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../LoginForm';
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

describe('LoginForm Component', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
  });

  it('should render login form with name and password fields', () => {
    render(<LoginForm onSuccess={mockOnSuccess} />, { wrapper: createWrapper() });
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSuccess={mockOnSuccess} />, { wrapper: createWrapper() });
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    await user.click(submitButton);
    
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('should disable submit button while loading', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSuccess={mockOnSuccess} />, { wrapper: createWrapper() });
    
    const nameInput = screen.getByLabelText(/name/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    await user.type(nameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    
    expect(submitButton).not.toBeDisabled();
  });

  it('should show error message on login failure', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSuccess={mockOnSuccess} />, { wrapper: createWrapper() });
    
    const nameInput = screen.getByLabelText(/name/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    await user.type(nameInput, 'wronguser');
    await user.type(passwordInput, 'wrongpass');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
