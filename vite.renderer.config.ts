import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig(async () => {
  // @ts-ignore
  const tailwindcss = (await import('@tailwindcss/vite')).default;
  return {
    plugins: [
      tailwindcss(),
    ],
  };
});
