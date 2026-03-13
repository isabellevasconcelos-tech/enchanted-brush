-- ╔══════════════════════════════════════════════════════╗
-- ║  Tabela PERFIS — dados do cliente autenticado       ║
-- ║  Execute no SQL Editor do Supabase Dashboard        ║
-- ╚══════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS perfis (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  whatsapp TEXT NOT NULL DEFAULT '',
  cep TEXT DEFAULT '',
  rua TEXT DEFAULT '',
  numero TEXT DEFAULT '',
  complemento TEXT DEFAULT '',
  bairro TEXT DEFAULT '',
  cidade TEXT DEFAULT '',
  avatar TEXT DEFAULT '🎨',
  criado_em TIMESTAMPTZ DEFAULT now(),
  atualizado_em TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;

-- Cada usuario so pode ver/editar seu proprio perfil
CREATE POLICY "Users can view own profile"
  ON perfis FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON perfis FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON perfis FOR UPDATE
  USING (auth.uid() = id);

-- Trigger para atualizar atualizado_em automaticamente
CREATE OR REPLACE FUNCTION update_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER perfis_atualizado_em
  BEFORE UPDATE ON perfis
  FOR EACH ROW
  EXECUTE FUNCTION update_atualizado_em();
