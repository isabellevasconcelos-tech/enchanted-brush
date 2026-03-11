-- ============================================
-- Migration: App Camisas Artesanais
-- Execute no Supabase SQL Editor
-- ============================================

-- Tabela: camisas (catálogo)
create table public.camisas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  preco numeric(10,2) not null,
  tamanhos text[] not null default '{P,M,G,GG}',
  imagem_url text,
  disponivel boolean not null default true,
  criado_em timestamptz default now()
);

-- Tabela: pedidos
create table public.pedidos (
  id uuid primary key default gen_random_uuid(),
  camisa_id uuid not null references public.camisas(id),
  nome_cliente text not null,
  email_cliente text not null,
  telefone_cliente text,
  tamanho text not null,
  quantidade integer not null default 1,
  observacoes text,
  status text not null default 'pendente',
  criado_em timestamptz default now()
);

-- Row Level Security
alter table public.camisas enable row level security;
alter table public.pedidos enable row level security;

-- Qualquer pessoa pode ver camisas disponíveis
create policy "Camisas visíveis para todos"
  on public.camisas for select
  using (disponivel = true);

-- Qualquer pessoa pode criar um pedido
create policy "Qualquer pessoa pode criar pedido"
  on public.pedidos for insert
  with check (true);

-- Permitir leitura de pedidos recém-criados (para retornar dados após insert)
create policy "Leitura de pedidos recém-criados"
  on public.pedidos for select
  using (true);

-- ============================================
-- Dados de exemplo
-- ============================================
insert into public.camisas (nome, descricao, preco, tamanhos, imagem_url) values
  ('Camisa Floral Artesanal', 'Camisa com estampa floral feita à mão, tecido 100% algodão.', 89.90, '{P,M,G,GG}', 'https://placehold.co/400x400/f59e0b/ffffff?text=Floral'),
  ('Camisa Tie-Dye Oceano', 'Tingimento artesanal em tons de azul, peça única.', 79.90, '{P,M,G}', 'https://placehold.co/400x400/3b82f6/ffffff?text=Tie-Dye'),
  ('Camisa Bordada Mandala', 'Bordado manual com mandala nas costas, algodão orgânico.', 119.90, '{M,G,GG}', 'https://placehold.co/400x400/10b981/ffffff?text=Mandala');
