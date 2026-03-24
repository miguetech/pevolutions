# React Best Practices

## Functional Components

### Component Structure
```typescript
import { useState, useEffect } from 'react';

interface UserCardProps {
    userId: number;
    onUserClick?: (id: number) => void;
}

export function UserCard({ userId, onUserClick }: UserCardProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchUser(userId).then(setUser).finally(() => setLoading(false));
    }, [userId]);
    
    if (loading) return <div>Loading...</div>;
    if (!user) return <div>User not found</div>;
    
    return (
        <div onClick={() => onUserClick?.(userId)}>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
        </div>
    );
}
```

## Hooks

### useState
```typescript
// Simple state
const [count, setCount] = useState(0);

// Object state
const [user, setUser] = useState<User>({
    name: '',
    email: ''
});

// Update object state
setUser(prev => ({ ...prev, name: 'John' }));

// Lazy initialization (expensive computation)
const [data, setData] = useState(() => {
    return expensiveComputation();
});
```

### useEffect
```typescript
// Run once on mount
useEffect(() => {
    fetchData();
}, []);

// Run when dependency changes
useEffect(() => {
    fetchUser(userId);
}, [userId]);

// Cleanup function
useEffect(() => {
    const subscription = subscribeToData();
    return () => subscription.unsubscribe();
}, []);

// Avoid - missing dependencies
useEffect(() => {
    console.log(count); // count should be in deps
}, []); // ❌ Bad
```

### useCallback
```typescript
// Memoize function to prevent re-creation
const handleClick = useCallback((id: number) => {
    console.log('Clicked:', id);
    onItemClick(id);
}, [onItemClick]);

// Pass to child component
<ChildComponent onClick={handleClick} />
```

### useMemo
```typescript
// Memoize expensive computation
const sortedUsers = useMemo(() => {
    return users.sort((a, b) => a.name.localeCompare(b.name));
}, [users]);

// Memoize object to prevent re-renders
const config = useMemo(() => ({
    theme: 'dark',
    language: 'en'
}), []);
```

### useRef
```typescript
// DOM reference
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
    inputRef.current?.focus();
}, []);

<input ref={inputRef} />

// Store mutable value (doesn't trigger re-render)
const countRef = useRef(0);

const increment = () => {
    countRef.current += 1;
    console.log(countRef.current);
};
```

### Custom Hooks
```typescript
// useFetch hook
function useFetch<T>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    
    useEffect(() => {
        setLoading(true);
        fetch(url)
            .then(res => res.json())
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [url]);
    
    return { data, loading, error };
}

// Usage
function UserProfile({ userId }: { userId: number }) {
    const { data: user, loading, error } = useFetch<User>(`/api/users/${userId}`);
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!user) return <div>Not found</div>;
    
    return <div>{user.name}</div>;
}
```

## Performance Optimization

### React.memo
```typescript
// Prevent re-render if props haven't changed
interface UserItemProps {
    user: User;
    onSelect: (id: number) => void;
}

export const UserItem = React.memo(({ user, onSelect }: UserItemProps) => {
    return (
        <div onClick={() => onSelect(user.id)}>
            {user.name}
        </div>
    );
});

// Custom comparison
export const UserItem = React.memo(
    ({ user, onSelect }: UserItemProps) => {
        return <div>{user.name}</div>;
    },
    (prevProps, nextProps) => {
        return prevProps.user.id === nextProps.user.id;
    }
);
```

### Code Splitting
```typescript
import { lazy, Suspense } from 'react';

// Lazy load component
const Dashboard = lazy(() => import('./Dashboard'));

function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Dashboard />
        </Suspense>
    );
}
```

## Component Patterns

### Compound Components
```typescript
interface TabsProps {
    children: React.ReactNode;
    defaultTab?: string;
}

export function Tabs({ children, defaultTab }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab);
    
    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </TabsContext.Provider>
    );
}

Tabs.List = function TabsList({ children }: { children: React.ReactNode }) {
    return <div className="tabs-list">{children}</div>;
};

Tabs.Tab = function Tab({ id, children }: { id: string; children: React.ReactNode }) {
    const { activeTab, setActiveTab } = useTabsContext();
    return (
        <button
            className={activeTab === id ? 'active' : ''}
            onClick={() => setActiveTab(id)}
        >
            {children}
        </button>
    );
};

// Usage
<Tabs defaultTab="profile">
    <Tabs.List>
        <Tabs.Tab id="profile">Profile</Tabs.Tab>
        <Tabs.Tab id="settings">Settings</Tabs.Tab>
    </Tabs.List>
</Tabs>
```

### Render Props
```typescript
interface MouseTrackerProps {
    render: (position: { x: number; y: number }) => React.ReactNode;
}

function MouseTracker({ render }: MouseTrackerProps) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    
    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);
    
    return <>{render(position)}</>;
}

// Usage
<MouseTracker render={({ x, y }) => (
    <div>Mouse at {x}, {y}</div>
)} />
```

## Context API

```typescript
// Create context
interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    
    const login = async (email: string, password: string) => {
        const user = await api.login(email, password);
        setUser(user);
    };
    
    const logout = () => setUser(null);
    
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

// Usage
function Profile() {
    const { user, logout } = useAuth();
    return <div>{user?.name}</div>;
}
```

## Error Boundaries

```typescript
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };
    
    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }
    
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught:', error, errorInfo);
    }
    
    render() {
        if (this.state.hasError) {
            return this.props.fallback || <div>Something went wrong</div>;
        }
        return this.props.children;
    }
}

// Usage
<ErrorBoundary fallback={<ErrorPage />}>
    <App />
</ErrorBoundary>
```

## Best Practices

1. **Use functional components** - avoid class components
2. **Keep components small** - single responsibility principle
3. **Extract custom hooks** for reusable logic
4. **Use TypeScript** for type safety
5. **Memoize expensive computations** with useMemo
6. **Memoize callbacks** passed to child components with useCallback
7. **Use React.memo** for expensive components
8. **Avoid inline functions** in JSX when possible
9. **Use keys properly** in lists (stable, unique identifiers)
10. **Clean up effects** with return function
11. **Avoid prop drilling** - use Context or state management
12. **Use error boundaries** for graceful error handling
13. **Lazy load routes** and heavy components
14. **Keep state close** to where it's used
15. **Prefer composition** over inheritance

## Common Mistakes to Avoid

```typescript
// ❌ Mutating state directly
state.items.push(newItem);
setState(state);

// ✅ Create new array
setState({ items: [...state.items, newItem] });

// ❌ Missing dependencies in useEffect
useEffect(() => {
    fetchData(userId);
}, []); // userId should be in deps

// ✅ Include all dependencies
useEffect(() => {
    fetchData(userId);
}, [userId]);

// ❌ Creating objects/arrays in render
<Component config={{ theme: 'dark' }} /> // New object every render

// ✅ Memoize or define outside
const config = useMemo(() => ({ theme: 'dark' }), []);
<Component config={config} />
```
