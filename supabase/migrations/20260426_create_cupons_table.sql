-- ============================================================
-- Migration: Tabela de Cupons para Acesso Gratuito (Beta Testers)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.cupons (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo       text UNIQUE NOT NULL,
  tipo         text NOT NULL DEFAULT 'free_trial',
  limite_usos  integer DEFAULT NULL,   -- NULL = ilimitado
  total_usado  integer NOT NULL DEFAULT 0,
  ativo        boolean NOT NULL DEFAULT true,
  criado_em    timestamptz DEFAULT now() NOT NULL
);

-- RLS ativado — apenas service_role acessa (Edge Function usa service_role_key)
ALTER TABLE public.cupons ENABLE ROW LEVEL SECURITY;

-- Inserir o cupom inicial para beta testers
INSERT INTO public.cupons (codigo, tipo, limite_usos, ativo)
VALUES ('digital-free', 'free_trial', NULL, true)
ON CONFLICT (codigo) DO NOTHING;
