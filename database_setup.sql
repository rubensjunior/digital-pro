-- Tabela de Clientes (Perfis vinculados ao Auth)
CREATE TABLE public.clientes (
  id uuid references auth.users not null primary key,
  nome_completo text,
  apelido text,
  profissao text,
  cpf_cnpj text,
  telefone text,
  asaas_cliente_id text,
  status text default 'ativo' not null,
  criado_em timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Configurações de Segurança (RLS) para clientes
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver o próprio perfil."
  ON public.clientes FOR SELECT
  USING ( auth.uid() = id );

CREATE POLICY "Usuários podem inserir o próprio perfil."
  ON public.clientes FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Usuários podem atualizar o próprio perfil."
  ON public.clientes FOR UPDATE
  USING ( auth.uid() = id );


-- Tabela de Assinaturas
CREATE TABLE public.assinaturas (
  id uuid default gen_random_uuid() primary key,
  cliente_id uuid references public.clientes(id) not null,
  nome_plano text not null,
  status text not null,
  asaas_assinatura_id text,
  proxima_cobranca date,
  criado_em timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Configurações de Segurança (RLS) para assinaturas
ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias assinaturas."
  ON public.assinaturas FOR SELECT
  USING ( auth.uid() = cliente_id );

CREATE POLICY "Usuários podem gerenciar suas próprias assinaturas."
  ON public.assinaturas FOR ALL
  USING ( auth.uid() = cliente_id );


-- Tabela de Cobranças (Faturas)
CREATE TABLE public.cobrancas (
  id uuid default gen_random_uuid() primary key,
  assinatura_id uuid references public.assinaturas(id),
  cliente_id uuid references public.clientes(id) not null,
  valor numeric(10,2) not null,
  status text not null,
  data_vencimento date not null,
  asaas_pagamento_id text,
  criado_em timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Configurações de Segurança (RLS) para cobrancas
ALTER TABLE public.cobrancas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias cobranças."
  ON public.cobrancas FOR SELECT
  USING ( auth.uid() = cliente_id );

CREATE POLICY "Usuários podem gerenciar suas próprias cobranças."
  ON public.cobrancas FOR ALL
  USING ( auth.uid() = cliente_id );

-- Função RPC para exclusão de conta e limpeza de dados
CREATE OR REPLACE FUNCTION delete_my_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Opcional: Se houver dependências com outras tabelas, devem ser limpas aqui.
  DELETE FROM public.cobrancas WHERE cliente_id = auth.uid();
  DELETE FROM public.assinaturas WHERE cliente_id = auth.uid();
  DELETE FROM public.clientes WHERE id = auth.uid();
  
  -- Remove da tabela global de Auth
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;
