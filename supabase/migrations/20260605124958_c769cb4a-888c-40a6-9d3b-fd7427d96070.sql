
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'operator');

-- ============ UTIL: updated_at trigger ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  phone TEXT,
  cargo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ USER_ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============ SECURITY DEFINER: has_role ============
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============ POLICIES: profiles ============
CREATE POLICY "Usuários veem o próprio perfil"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Usuários atualizam o próprio perfil"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Sistema insere perfil"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

-- ============ POLICIES: user_roles ============
CREATE POLICY "Usuários veem os próprios papéis"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins gerenciam papéis"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ TRIGGER: novo usuário cria perfil ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'operator');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ HELPER: padrão de policies por user_id + admin ============
-- (aplicado inline em cada tabela abaixo)

-- ============ PROPRIEDADES ============
CREATE TABLE public.propriedades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  proprietario TEXT,
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  area_total NUMERIC,
  car TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.propriedades TO authenticated;
GRANT ALL ON public.propriedades TO service_role;
ALTER TABLE public.propriedades ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_propriedades_updated_at BEFORE UPDATE ON public.propriedades FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Selecionar próprias propriedades" ON public.propriedades FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Inserir próprias propriedades" ON public.propriedades FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar próprias propriedades" ON public.propriedades FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Excluir próprias propriedades" ON public.propriedades FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- ============ TALHOES ============
CREATE TABLE public.talhoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  propriedade_id UUID REFERENCES public.propriedades(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  area NUMERIC,
  cultura TEXT,
  variedade TEXT,
  status TEXT DEFAULT 'ativo',
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.talhoes TO authenticated;
GRANT ALL ON public.talhoes TO service_role;
ALTER TABLE public.talhoes ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_talhoes_updated_at BEFORE UPDATE ON public.talhoes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Selecionar próprios talhões" ON public.talhoes FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Inserir próprios talhões" ON public.talhoes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar próprios talhões" ON public.talhoes FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Excluir próprios talhões" ON public.talhoes FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- ============ SAFRAS ============
CREATE TABLE public.safras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  propriedade_id UUID REFERENCES public.propriedades(id) ON DELETE SET NULL,
  talhao_id UUID REFERENCES public.talhoes(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  cultura TEXT,
  data_plantio DATE,
  data_colheita_prevista DATE,
  area NUMERIC,
  progresso INTEGER DEFAULT 0,
  status TEXT DEFAULT 'em_andamento',
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.safras TO authenticated;
GRANT ALL ON public.safras TO service_role;
ALTER TABLE public.safras ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_safras_updated_at BEFORE UPDATE ON public.safras FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Selecionar próprias safras" ON public.safras FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Inserir próprias safras" ON public.safras FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar próprias safras" ON public.safras FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Excluir próprias safras" ON public.safras FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- ============ CADERNO DE CAMPO ============
CREATE TABLE public.caderno_campo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  talhao_id UUID REFERENCES public.talhoes(id) ON DELETE SET NULL,
  propriedade_id UUID REFERENCES public.propriedades(id) ON DELETE SET NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  tipo_atividade TEXT NOT NULL,
  produto TEXT,
  dosagem TEXT,
  responsavel TEXT,
  observacoes TEXT,
  status TEXT DEFAULT 'concluído',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.caderno_campo TO authenticated;
GRANT ALL ON public.caderno_campo TO service_role;
ALTER TABLE public.caderno_campo ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_caderno_updated_at BEFORE UPDATE ON public.caderno_campo FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Selecionar próprios registros" ON public.caderno_campo FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Inserir próprios registros" ON public.caderno_campo FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar próprios registros" ON public.caderno_campo FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Excluir próprios registros" ON public.caderno_campo FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- ============ PRODUCAO ============
CREATE TABLE public.producao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  safra_id UUID REFERENCES public.safras(id) ON DELETE SET NULL,
  talhao_id UUID REFERENCES public.talhoes(id) ON DELETE SET NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  produto TEXT NOT NULL,
  quantidade NUMERIC,
  unidade TEXT,
  qualidade TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.producao TO authenticated;
GRANT ALL ON public.producao TO service_role;
ALTER TABLE public.producao ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_producao_updated_at BEFORE UPDATE ON public.producao FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Selecionar própria produção" ON public.producao FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Inserir própria produção" ON public.producao FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar própria produção" ON public.producao FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Excluir própria produção" ON public.producao FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- ============ COMPRAS ============
CREATE TABLE public.compras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  numero TEXT,
  fornecedor TEXT NOT NULL,
  categoria TEXT,
  data_compra DATE NOT NULL DEFAULT CURRENT_DATE,
  data_entrega DATE,
  itens INTEGER DEFAULT 1,
  valor_total NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pendente',
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.compras TO authenticated;
GRANT ALL ON public.compras TO service_role;
ALTER TABLE public.compras ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_compras_updated_at BEFORE UPDATE ON public.compras FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Selecionar próprias compras" ON public.compras FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Inserir próprias compras" ON public.compras FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar próprias compras" ON public.compras FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Excluir próprias compras" ON public.compras FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- ============ ESTOQUE ============
CREATE TABLE public.estoque (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  codigo TEXT,
  nome TEXT NOT NULL,
  categoria TEXT,
  unidade TEXT,
  quantidade NUMERIC DEFAULT 0,
  quantidade_minima NUMERIC DEFAULT 0,
  localizacao TEXT,
  valor_unitario NUMERIC DEFAULT 0,
  ultima_movimentacao DATE,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.estoque TO authenticated;
GRANT ALL ON public.estoque TO service_role;
ALTER TABLE public.estoque ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_estoque_updated_at BEFORE UPDATE ON public.estoque FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Selecionar próprio estoque" ON public.estoque FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Inserir próprio estoque" ON public.estoque FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar próprio estoque" ON public.estoque FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Excluir próprio estoque" ON public.estoque FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- ============ MOVIMENTACOES_ESTOQUE ============
CREATE TABLE public.movimentacoes_estoque (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  estoque_id UUID REFERENCES public.estoque(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  quantidade NUMERIC NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  motivo TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.movimentacoes_estoque TO authenticated;
GRANT ALL ON public.movimentacoes_estoque TO service_role;
ALTER TABLE public.movimentacoes_estoque ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Selecionar próprias movimentações" ON public.movimentacoes_estoque FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Inserir próprias movimentações" ON public.movimentacoes_estoque FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar próprias movimentações" ON public.movimentacoes_estoque FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Excluir próprias movimentações" ON public.movimentacoes_estoque FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- ============ RASTREABILIDADE (LOTES) ============
CREATE TABLE public.lotes_rastreabilidade (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  codigo TEXT NOT NULL,
  produto TEXT NOT NULL,
  safra_id UUID REFERENCES public.safras(id) ON DELETE SET NULL,
  talhao_id UUID REFERENCES public.talhoes(id) ON DELETE SET NULL,
  propriedade_id UUID REFERENCES public.propriedades(id) ON DELETE SET NULL,
  data_producao DATE,
  quantidade NUMERIC,
  unidade TEXT,
  qr_code TEXT,
  status TEXT DEFAULT 'ativo',
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.lotes_rastreabilidade TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lotes_rastreabilidade TO authenticated;
GRANT ALL ON public.lotes_rastreabilidade TO service_role;
ALTER TABLE public.lotes_rastreabilidade ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_lotes_updated_at BEFORE UPDATE ON public.lotes_rastreabilidade FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- Consulta pública por código (QR) é permitida para rastreabilidade
CREATE POLICY "Consulta pública de lote por código" ON public.lotes_rastreabilidade FOR SELECT TO anon USING (true);
CREATE POLICY "Selecionar próprios lotes" ON public.lotes_rastreabilidade FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Inserir próprios lotes" ON public.lotes_rastreabilidade FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar próprios lotes" ON public.lotes_rastreabilidade FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Excluir próprios lotes" ON public.lotes_rastreabilidade FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- ============ EXPEDICAO ============
CREATE TABLE public.expedicao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  numero TEXT,
  lote_id UUID REFERENCES public.lotes_rastreabilidade(id) ON DELETE SET NULL,
  cliente TEXT,
  destino TEXT,
  transportadora TEXT,
  data_expedicao DATE NOT NULL DEFAULT CURRENT_DATE,
  quantidade NUMERIC,
  unidade TEXT,
  status TEXT DEFAULT 'pendente',
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expedicao TO authenticated;
GRANT ALL ON public.expedicao TO service_role;
ALTER TABLE public.expedicao ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_expedicao_updated_at BEFORE UPDATE ON public.expedicao FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Selecionar própria expedição" ON public.expedicao FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Inserir própria expedição" ON public.expedicao FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar própria expedição" ON public.expedicao FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Excluir própria expedição" ON public.expedicao FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- ============ FINANCEIRO ============
CREATE TABLE public.financeiro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  categoria TEXT,
  descricao TEXT NOT NULL,
  valor NUMERIC NOT NULL DEFAULT 0,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  forma_pagamento TEXT,
  status TEXT DEFAULT 'pago',
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financeiro TO authenticated;
GRANT ALL ON public.financeiro TO service_role;
ALTER TABLE public.financeiro ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_financeiro_updated_at BEFORE UPDATE ON public.financeiro FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Selecionar próprio financeiro" ON public.financeiro FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Inserir próprio financeiro" ON public.financeiro FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar próprio financeiro" ON public.financeiro FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Excluir próprio financeiro" ON public.financeiro FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
