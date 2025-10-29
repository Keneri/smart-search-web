import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    {
      name: 'css-as-string',
      transform(code, id) {
        // Transform CSS imports to strings for Lit components
        if (id.endsWith('.css') && !id.includes('?direct')) {
          return {
            code: `export default ${JSON.stringify(code)}`,
            map: null
          };
        }
      }
    }
  ],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80
      }
    }
  }
});
