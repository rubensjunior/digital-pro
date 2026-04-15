import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig(async () => {
  // @ts-ignore
  const tailwindcss = (await import('@tailwindcss/vite')).default;
  // @ts-ignore
  const vue = (await import('@vitejs/plugin-vue')).default;
  return {
    plugins: [
      vue(),
      tailwindcss(),
    ],
  };
});
