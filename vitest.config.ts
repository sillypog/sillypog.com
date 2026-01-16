import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  test: {
    // Enable global test APIs (describe, it, expect, etc.)
    globals: true,

    // Use happy-dom for DOM testing (lighter than jsdom)
    environment: 'happy-dom',

    // Setup files to run before tests
    // setupFiles: ['./src/tests/setup.ts'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'src/tests/',
        '**/*.test.ts',
        '**/*.spec.ts',
        'vite.config.ts',
        'vitest.config.ts'
      ]
    },

    // Include TypeScript files
    include: ['src/**/*.{test,spec}.ts'],

    // Exclude certain files
    exclude: [
      'node_modules',
      'dist',
      'bower_components',
      '.git'
    ]
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});
