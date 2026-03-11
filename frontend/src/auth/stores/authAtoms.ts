import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { User } from '../types/user';

// Auth atoms
export const tokenAtom = atomWithStorage<string | null>('token', null);
export const userAtom = atomWithStorage<User | null>('user', null);

// Derived atoms
export const isAuthenticatedAtom = atom((get) => get(tokenAtom) !== null);
