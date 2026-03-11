import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/src.backup/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/auth': resolve(__dirname, './src/auth'),
      '@/apps': resolve(__dirname, './src/apps'),
      '@/shared': resolve(__dirname, './src/shared'),
    },
  },
});
