import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config
export default defineConfig(async ({ mode }) => {
  // Carrega as variáveis de ambiente do .env corretamente em todos os modos
  const env = loadEnv(mode, process.cwd(), '');

  // @ts-expect-error interop issue
  const tailwindcss = (await import('@tailwindcss/vite')).default;
  // @ts-expect-error interop issue
  const vue = (await import('@vitejs/plugin-vue')).default;

  return {
    plugins: [
      vue(),
      tailwindcss(),
    ],
    // Garante que as variáveis VITE_ sejam injetadas no bundle de produção
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(
        env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
      ),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(
        env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
      ),
    },
  };
});
