import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from '../RegisterForm';
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

describe('RegisterForm Component', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
  });

  it('should render register form with name, email and password fields', () => {
    render(<RegisterForm onSuccess={mockOnSuccess} />, { wrapper: createWrapper() });
    
    expect(screen.getByLabelText(/^name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSuccess={mockOnSuccess} />, { wrapper: createWrapper() });
    
    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);
    
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSuccess={mockOnSuccess} />, { wrapper: createWrapper() });
    
    const nameInput = screen.getByLabelText(/^name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });
    
    await user.type(nameInput, 'testuser');
    await user.type(emailInput, 'notanemail');
    await user.type(passwordInput, 'password123');
    await user.type(confirmInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('should validate password match', async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSuccess={mockOnSuccess} />, { wrapper: createWrapper() });
    
    const nameInput = screen.getByLabelText(/^name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });
    
    await user.type(nameInput, 'testuser');
    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmInput, 'different');
    await user.click(submitButton);
    
    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it('should validate password length', async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSuccess={mockOnSuccess} />, { wrapper: createWrapper() });
    
    const nameInput = screen.getByLabelText(/^name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole('button', { name: /register/i });
    
    await user.type(nameInput, 'testuser');
    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, '123');
    await user.click(submitButton);
    
    expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
  });
});
