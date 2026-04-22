import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] Erro: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não definidos!')
} else {
  console.log('[Supabase] Configurado com sucesso. URL:', supabaseUrl.substring(0, 20) + '...')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persiste a sessão no localStorage (sobrevive a fechamento do app)
    persistSession: true,
    // Renova o token automaticamente antes de expirar (a cada ~55 min)
    autoRefreshToken: true,
    // Detecta mudanças de sessão em outras abas/janelas
    detectSessionInUrl: false,
  },
})
