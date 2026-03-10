# API Integration

## Fetch Patterns

### Basic Fetch
```typescript
async function fetchUser(userId: number): Promise<User> {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
}
```

### With Error Handling
```typescript
interface ApiError {
    message: string;
    status: number;
}

async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const error: ApiError = {
                message: await response.text(),
                status: response.status
            };
            throw error;
        }
        
        return response.json();
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('Network error - please check your connection');
        }
        throw error;
    }
}
```

## HTTP Methods

### GET
```typescript
async function getUsers(params?: { skip?: number; limit?: number }) {
    const queryString = new URLSearchParams(
        params as Record<string, string>
    ).toString();
    
    return apiRequest<User[]>(`/api/users?${queryString}`);
}
```

### POST
```typescript
async function createUser(userData: UserCreate) {
    return apiRequest<User>('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });
}
```

### PUT/PATCH
```typescript
async function updateUser(userId: number, updates: Partial<User>) {
    return apiRequest<User>(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
    });
}
```

### DELETE
```typescript
async function deleteUser(userId: number): Promise<void> {
    await apiRequest(`/api/users/${userId}`, {
        method: 'DELETE'
    });
}
```

## Authentication

### Token Storage
```typescript
// Store token
function setAuthToken(token: string) {
    localStorage.setItem('auth_token', token);
}

// Get token
function getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
}

// Remove token
function clearAuthToken() {
    localStorage.removeItem('auth_token');
}
```

### Authenticated Requests
```typescript
async function authenticatedRequest<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const token = getAuthToken();
    
    if (!token) {
        throw new Error('Not authenticated');
    }
    
    return apiRequest<T>(url, {
        ...options,
        headers: {
            ...options?.headers,
            'Authorization': `Bearer ${token}`
        }
    });
}
```

### Login Flow
```typescript
interface LoginCredentials {
    email: string;
    password: string;
}

interface AuthResponse {
    access_token: string;
    token_type: string;
}

async function login(credentials: LoginCredentials): Promise<User> {
    const response = await apiRequest<AuthResponse>('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
    });
    
    setAuthToken(response.access_token);
    
    // Fetch user data
    return authenticatedRequest<User>('/api/users/me');
}

async function logout() {
    clearAuthToken();
    // Optionally call logout endpoint
    await apiRequest('/api/auth/logout', { method: 'POST' });
}
```

## React Hook for API

### useFetch Hook
```typescript
import { useState, useEffect } from 'react';

interface UseFetchResult<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
}

function useFetch<T>(url: string): UseFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiRequest<T>(url);
            setData(result);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, [url]);
    
    return { data, loading, error, refetch: fetchData };
}

// Usage
function UserProfile({ userId }: { userId: number }) {
    const { data: user, loading, error, refetch } = useFetch<User>(
        `/api/users/${userId}`
    );
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!user) return <div>Not found</div>;
    
    return (
        <div>
            <h1>{user.name}</h1>
            <button onClick={refetch}>Refresh</button>
        </div>
    );
}
```

### useMutation Hook
```typescript
interface UseMutationResult<T, V> {
    mutate: (variables: V) => Promise<T>;
    data: T | null;
    loading: boolean;
    error: Error | null;
}

function useMutation<T, V>(
    mutationFn: (variables: V) => Promise<T>
): UseMutationResult<T, V> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    const mutate = async (variables: V) => {
        try {
            setLoading(true);
            setError(null);
            const result = await mutationFn(variables);
            setData(result);
            return result;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };
    
    return { mutate, data, loading, error };
}

// Usage
function CreateUserForm() {
    const { mutate: createUser, loading, error } = useMutation(
        (userData: UserCreate) => apiRequest<User>('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        })
    );
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await createUser({ name: 'John', email: 'john@example.com' });
            alert('User created!');
        } catch (err) {
            console.error('Failed to create user');
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            {/* form fields */}
            <button disabled={loading}>
                {loading ? 'Creating...' : 'Create User'}
            </button>
            {error && <div>Error: {error.message}</div>}
        </form>
    );
}
```

## Retry Logic

```typescript
async function fetchWithRetry<T>(
    url: string,
    options?: RequestInit,
    maxRetries = 3
): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await apiRequest<T>(url, options);
        } catch (error) {
            lastError = error as Error;
            
            // Don't retry on client errors (4xx)
            if (error instanceof Error && 'status' in error) {
                const status = (error as any).status;
                if (status >= 400 && status < 500) {
                    throw error;
                }
            }
            
            // Wait before retry (exponential backoff)
            if (i < maxRetries - 1) {
                await new Promise(resolve => 
                    setTimeout(resolve, Math.pow(2, i) * 1000)
                );
            }
        }
    }
    
    throw lastError!;
}
```

## Request Cancellation

```typescript
function useFetchWithCancel<T>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    
    useEffect(() => {
        const abortController = new AbortController();
        
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(url, {
                    signal: abortController.signal
                });
                const result = await response.json();
                setData(result);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err as Error);
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
        
        return () => abortController.abort();
    }, [url]);
    
    return { data, loading, error };
}
```

## Best Practices

1. **Centralize API calls** in a service layer
2. **Handle all error cases** - network, HTTP, parsing
3. **Use TypeScript** for request/response types
4. **Implement retry logic** for transient failures
5. **Cancel requests** when component unmounts
6. **Store tokens securely** - httpOnly cookies preferred over localStorage
7. **Add loading states** for better UX
8. **Validate responses** before using data
9. **Use interceptors** for common headers (auth, content-type)
10. **Implement request timeouts**
