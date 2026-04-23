import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    rollupOptions: {
      // Módulos nativos não podem ser bundlizados pelo Vite/Rollup.
      // 'better-sqlite3' usa binários .node compilados nativamente.
      external: ['better-sqlite3', 'bindings'],
    },
  },
});
