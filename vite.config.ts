import { defineConfig } from 'vite-plus';
import { askr } from '@askrjs/vite';

export default defineConfig({
  base: '/',
  plugins: [askr()],
  lint: {
    ignorePatterns: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
  fmt: {
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    printWidth: 80,
    tabWidth: 2,
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    open: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
    open: true,
  },
  build: {
    outDir: 'dist/client',
    sourcemap: true,
  },
});
