import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'lit': ['lit'],
          'lit-decorators': ['lit/decorators.js']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['lit', 'lit/decorators.js']
  },
  plugins: [
    {
      name: 'css-as-string',
      transform(code, id) {
        // For CSS files being imported in JS, return the CSS as a string
        if (id.endsWith('.css') && !id.includes('?direct')) {
          return {
            code: `export default ${JSON.stringify(code)}`,
            map: null
          };
        }
      }
    }
  ]
});
