import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

export default defineConfig({
  test: {
    environment: 'node',
    env: loadEnv('test', process.cwd(), ''),
    fileParallelism: false,

    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        'src/generated/**',
      ],
    },
  },
});