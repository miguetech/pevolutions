import { describe, it, expect, beforeEach } from 'vitest';
import { createStore } from 'jotai';
import { tokenAtom, userAtom, isAuthenticatedAtom } from '../authAtoms';

describe('Auth Atoms', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
    localStorage.clear();
  });

  it('should initialize with null token', () => {
    expect(store.get(tokenAtom)).toBeNull();
  });

  it('should set token', () => {
    store.set(tokenAtom, 'test-token-123');
    expect(store.get(tokenAtom)).toBe('test-token-123');
  });

  it('should initialize with null user', () => {
    expect(store.get(userAtom)).toBeNull();
  });

  it('should set user', () => {
    const user = { id: 1, name: 'testuser', email: 'test@test.com' };
    store.set(userAtom, user);
    expect(store.get(userAtom)).toEqual(user);
  });

  it('should derive isAuthenticated as false when no token', () => {
    expect(store.get(isAuthenticatedAtom)).toBe(false);
  });

  it('should derive isAuthenticated as true when token exists', () => {
    store.set(tokenAtom, 'test-token');
    expect(store.get(isAuthenticatedAtom)).toBe(true);
  });

  it('should persist token to localStorage', () => {
    store.set(tokenAtom, 'persisted-token');
    expect(localStorage.getItem('token')).toBe('"persisted-token"');
  });
});
