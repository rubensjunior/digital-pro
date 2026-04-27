-- Migration: Add PF/PJ and Nome Fantasia columns to clientes table
-- Date: 2026-04-27

ALTER TABLE public.clientes 
ADD COLUMN IF NOT EXISTS tipo_pessoa text DEFAULT 'PF',
ADD COLUMN IF NOT EXISTS nome_fantasia text;

-- Add a comment to columns for clarity
COMMENT ON COLUMN public.clientes.tipo_pessoa IS 'Indica se o cliente é Pessoa Física (PF) ou Pessoa Jurídica (PJ)';
COMMENT ON COLUMN public.clientes.nome_fantasia IS 'Nome fantasia aplicável apenas para clientes do tipo PJ';
