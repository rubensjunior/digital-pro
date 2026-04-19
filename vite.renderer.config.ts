import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig(async () => {
  // @ts-expect-error interop issue
  const tailwindcss = (await import('@tailwindcss/vite')).default;
  // @ts-expect-error interop issue
  const vue = (await import('@vitejs/plugin-vue')).default;
  return {
    plugins: [
      vue(),
      tailwindcss(),
    ],
  };
});
