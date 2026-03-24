# Frontend Security Best Practices

## Token Management

### Secure Token Storage
```typescript
// ❌ BAD - localStorage is vulnerable to XSS
localStorage.setItem('token', token);

// ✅ GOOD - httpOnly cookie (set by backend)
// Backend sets: Set-Cookie: token=xxx; HttpOnly; Secure; SameSite=Strict

// ✅ ACCEPTABLE - sessionStorage (better than localStorage)
sessionStorage.setItem('token', token);

// ✅ BEST - Memory only (lost on refresh, use refresh tokens)
let authToken: string | null = null;
```

### Token in API Requests
```typescript
// Astro API route
export async function GET({ cookies }) {
  const token = cookies.get('token')?.value;
  
  const response = await fetch('http://localhost:8000/api/players/', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response;
}
```

### Auto-logout on Token Expiration
```typescript
// utils/auth.ts
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

// Check before requests
if (isTokenExpired(token)) {
  // Redirect to login
  window.location.href = '/login';
}
```

## XSS Prevention

### Sanitize User Input
```typescript
// ❌ BAD - Direct HTML injection
element.innerHTML = userInput;

// ✅ GOOD - Use textContent
element.textContent = userInput;

// ✅ GOOD - Use framework escaping (React, Astro)
<div>{userInput}</div>

// For rich text, use DOMPurify
import DOMPurify from 'isomorphic-dompurify';
const clean = DOMPurify.sanitize(userInput);
```

### Avoid eval() and Similar
```typescript
// ❌ NEVER DO THIS
eval(userInput);
new Function(userInput)();
setTimeout(userInput, 1000);

// ✅ Use safe alternatives
JSON.parse(userInput);
```

### Content Security Policy (CSP)
```typescript
// astro.config.mjs
export default defineConfig({
  vite: {
    server: {
      headers: {
        'Content-Security-Policy': 
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline'; " +
          "style-src 'self' 'unsafe-inline'; " +
          "img-src 'self' data: https:; " +
          "font-src 'self' data:;"
      }
    }
  }
});
```

## CSRF Prevention

### Use SameSite Cookies
```typescript
// Backend sets cookie with SameSite
Set-Cookie: token=xxx; HttpOnly; Secure; SameSite=Strict
```

### CSRF Token for State-Changing Operations
```typescript
// Get CSRF token from meta tag
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

// Include in POST/PUT/DELETE requests
fetch('/api/players/', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});
```

## Input Validation

### Client-Side Validation (UX, not security)
```typescript
// Validate before sending
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string): boolean {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[0-9]/.test(password);
}

// Always validate on backend too!
```

### Sanitize Before Display
```typescript
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
```

## Secure API Communication

### Always Use HTTPS in Production
```typescript
// .env
PUBLIC_API_URL=https://api.yourdomain.com  // ✅ HTTPS

// ❌ Never in production
PUBLIC_API_URL=http://api.yourdomain.com
```

### Validate API Responses
```typescript
async function fetchPlayers() {
  try {
    const response = await fetch('/api/players/');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate structure
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format');
    }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch players:', error);
    return [];
  }
}
```

### Handle Errors Securely
```typescript
// ❌ BAD - Exposes internal details
catch (error) {
  alert(error.message); // "Database connection failed at 192.168.1.5"
}

// ✅ GOOD - Generic message
catch (error) {
  console.error('Error:', error); // Log for debugging
  alert('An error occurred. Please try again.'); // User-friendly
}
```

## Authentication Flow

### Secure Login
```typescript
// pages/api/login.ts (Astro API route)
export async function POST({ request, cookies }) {
  const { username, password } = await request.json();
  
  // Call backend
  const response = await fetch('http://localhost:8000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: username, password })
  });
  
  if (!response.ok) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401
    });
  }
  
  const { access_token } = await response.json();
  
  // Set httpOnly cookie
  cookies.set('token', access_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 30, // 30 minutes
    path: '/'
  });
  
  return new Response(JSON.stringify({ success: true }));
}
```

### Secure Logout
```typescript
// pages/api/logout.ts
export async function POST({ cookies }) {
  cookies.delete('token', { path: '/' });
  return new Response(JSON.stringify({ success: true }));
}
```

### Protected Routes
```typescript
// middleware.ts (Astro)
export function onRequest({ cookies, redirect, url }) {
  const token = cookies.get('token')?.value;
  const protectedPaths = ['/dashboard', '/account', '/players'];
  
  if (protectedPaths.some(path => url.pathname.startsWith(path))) {
    if (!token) {
      return redirect('/login');
    }
    
    // Optionally verify token
    if (isTokenExpired(token)) {
      cookies.delete('token');
      return redirect('/login');
    }
  }
}
```

## React Security

### Prevent XSS in React
```tsx
// ✅ React escapes by default
<div>{userInput}</div>

// ❌ Dangerous - only if you trust the source
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ If you need HTML, sanitize first
import DOMPurify from 'isomorphic-dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

### Secure Context API
```tsx
// AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async (username: string, password: string) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    // Token is in httpOnly cookie, just fetch user data
    const userData = await fetch('/api/me').then(r => r.json());
    setUser(userData);
  };
  
  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

## Environment Variables

### Public vs Private
```typescript
// ✅ Public (exposed to browser)
PUBLIC_API_URL=https://api.example.com

// ❌ Private (server-only, no PUBLIC_ prefix)
DATABASE_URL=mysql://...
SECRET_KEY=xxx

// Access in Astro
import.meta.env.PUBLIC_API_URL  // ✅ Works in browser
import.meta.env.DATABASE_URL    // ✅ Only in server code
```

### Never Expose Secrets
```typescript
// ❌ NEVER DO THIS
const API_KEY = 'sk_live_123456789';
fetch(`https://api.example.com?key=${API_KEY}`);

// ✅ Use backend proxy
// Frontend calls /api/proxy
// Backend adds API key and forwards request
```

## Dependency Security

### Regular Updates
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Update dependencies
npm update
```

### Use Lock Files
```bash
# Commit these files
package-lock.json  # npm
yarn.lock          # yarn
pnpm-lock.yaml     # pnpm
```

## Best Practices Checklist

### Authentication
- [ ] Use httpOnly cookies for tokens (not localStorage)
- [ ] Implement token expiration
- [ ] Auto-logout on token expiry
- [ ] Secure login/logout endpoints
- [ ] Protected routes middleware

### XSS Prevention
- [ ] Sanitize user input before display
- [ ] Use framework escaping (React, Astro)
- [ ] Implement Content Security Policy
- [ ] Never use eval() or innerHTML with user data
- [ ] Use DOMPurify for rich text

### CSRF Prevention
- [ ] Use SameSite cookies
- [ ] CSRF tokens for state-changing operations
- [ ] Validate origin/referer headers

### API Security
- [ ] Always use HTTPS in production
- [ ] Validate API responses
- [ ] Handle errors securely (no internal details)
- [ ] Implement request timeouts
- [ ] Rate limiting on frontend (UX)

### Data Protection
- [ ] Never expose secrets in frontend code
- [ ] Use environment variables correctly
- [ ] Validate input client-side (UX only)
- [ ] Always validate on backend (security)

### Dependencies
- [ ] Regular npm audit
- [ ] Keep dependencies updated
- [ ] Use lock files
- [ ] Review third-party packages

## Common Vulnerabilities

### 1. XSS (Cross-Site Scripting)
**Risk:** Attacker injects malicious scripts  
**Prevention:** Sanitize input, use framework escaping, CSP

### 2. CSRF (Cross-Site Request Forgery)
**Risk:** Unauthorized actions on behalf of user  
**Prevention:** SameSite cookies, CSRF tokens

### 3. Token Theft
**Risk:** Token stolen from localStorage  
**Prevention:** httpOnly cookies, secure transmission

### 4. Sensitive Data Exposure
**Risk:** API keys, secrets in frontend code  
**Prevention:** Environment variables, backend proxy

### 5. Insecure Dependencies
**Risk:** Vulnerable packages  
**Prevention:** Regular audits, updates

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Content Security Policy](https://content-security-policy.com/)
- [DOMPurify](https://github.com/cure53/DOMPurify)
