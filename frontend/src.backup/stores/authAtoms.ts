import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export interface User {
  id: number;
  name: string;
  email: string;
}

// Auth atoms
export const tokenAtom = atomWithStorage<string | null>('token', null);
export const userAtom = atom<User | null>(null);

// Derived atoms
export const isAuthenticatedAtom = atom((get) => get(tokenAtom) !== null);
