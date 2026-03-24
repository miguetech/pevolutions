# Frontend Testing

## Component Testing

### Basic Component Test
```typescript
import { render, screen } from '@testing-library/react';
import { UserCard } from './UserCard';

describe('UserCard', () => {
    it('renders user information', () => {
        const user = {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com'
        };
        
        render(<UserCard user={user} />);
        
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
    
    it('shows loading state', () => {
        render(<UserCard loading={true} />);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
});
```

### Testing User Interactions
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('LoginForm', () => {
    it('submits form with user input', async () => {
        const handleSubmit = jest.fn();
        const user = userEvent.setup();
        
        render(<LoginForm onSubmit={handleSubmit} />);
        
        // Type in inputs
        await user.type(screen.getByLabelText(/email/i), 'test@example.com');
        await user.type(screen.getByLabelText(/password/i), 'password123');
        
        // Click submit
        await user.click(screen.getByRole('button', { name: /login/i }));
        
        expect(handleSubmit).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password123'
        });
    });
    
    it('shows validation errors', async () => {
        const user = userEvent.setup();
        render(<LoginForm />);
        
        await user.click(screen.getByRole('button', { name: /login/i }));
        
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
});
```

## Mocking API Calls

### Mock fetch
```typescript
global.fetch = jest.fn();

describe('UserList', () => {
    beforeEach(() => {
        (fetch as jest.Mock).mockClear();
    });
    
    it('fetches and displays users', async () => {
        const mockUsers = [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' }
        ];
        
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockUsers
        });
        
        render(<UserList />);
        
        expect(await screen.findByText('John')).toBeInTheDocument();
        expect(await screen.findByText('Jane')).toBeInTheDocument();
    });
    
    it('handles fetch error', async () => {
        (fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed'));
        
        render(<UserList />);
        
        expect(await screen.findByText(/error/i)).toBeInTheDocument();
    });
});
```

### Mock Custom Hook
```typescript
import { useFetch } from './hooks/useFetch';

jest.mock('./hooks/useFetch');

describe('UserProfile', () => {
    it('displays user data', () => {
        (useFetch as jest.Mock).mockReturnValue({
            data: { id: 1, name: 'John' },
            loading: false,
            error: null
        });
        
        render(<UserProfile userId={1} />);
        
        expect(screen.getByText('John')).toBeInTheDocument();
    });
});
```

## Testing Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
    it('increments counter', () => {
        const { result } = renderHook(() => useCounter());
        
        expect(result.current.count).toBe(0);
        
        act(() => {
            result.current.increment();
        });
        
        expect(result.current.count).toBe(1);
    });
    
    it('resets counter', () => {
        const { result } = renderHook(() => useCounter(10));
        
        act(() => {
            result.current.reset();
        });
        
        expect(result.current.count).toBe(0);
    });
});
```

## Testing Context

```typescript
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

function TestComponent() {
    const { user } = useAuth();
    return <div>{user?.name || 'Not logged in'}</div>;
}

describe('AuthContext', () => {
    it('provides user data', () => {
        const mockUser = { id: 1, name: 'John' };
        
        render(
            <AuthProvider initialUser={mockUser}>
                <TestComponent />
            </AuthProvider>
        );
        
        expect(screen.getByText('John')).toBeInTheDocument();
    });
});
```

## Snapshot Testing

```typescript
import { render } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
    it('matches snapshot', () => {
        const { container } = render(<Button>Click me</Button>);
        expect(container.firstChild).toMatchSnapshot();
    });
});
```

## Accessibility Testing

```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('LoginForm accessibility', () => {
    it('has no accessibility violations', async () => {
        const { container } = render(<LoginForm />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
```

## Best Practices

1. **Test user behavior** not implementation details
2. **Use semantic queries** - getByRole, getByLabelText
3. **Avoid testing IDs/classes** - test what users see
4. **Mock external dependencies** - APIs, localStorage
5. **Test loading and error states**
6. **Use userEvent** over fireEvent for realistic interactions
7. **Wait for async updates** with findBy or waitFor
8. **Test accessibility** with jest-axe
9. **Keep tests isolated** - no shared state
10. **Use descriptive test names**
