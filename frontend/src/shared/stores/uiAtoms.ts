import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// UI atoms
export const themeAtom = atomWithStorage<'light' | 'dark'>('theme', 'dark');
export const languageAtom = atomWithStorage<'en' | 'es' | 'pt'>('language', 'en');
export const sidebarOpenAtom = atom(false);
