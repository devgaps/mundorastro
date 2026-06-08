-- ============ EQUIPAMENTOS ============
CREATE TABLE public.equipamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  propriedade_id UUID REFERENCES public.propriedades(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  tipo TEXT,
  marca TEXT,
  modelo TEXT,
  ano INTEGER,
  identificacao TEXT,
  horas_uso NUMERIC DEFAULT 0,
  quilometragem NUMERIC DEFAULT 0,
  proxima_manutencao DATE,
  status TEXT DEFAULT 'operacional',
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.equipamentos TO authenticated;
GRANT ALL ON public.equipamentos TO service_role;
ALTER TABLE public.equipamentos ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_equipamentos_updated_at BEFORE UPDATE ON public.equipamentos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Selecionar próprios equipamentos" ON public.equipamentos FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Inserir próprios equipamentos" ON public.equipamentos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar próprios equipamentos" ON public.equipamentos FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Excluir próprios equipamentos" ON public.equipamentos FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- ============ DOCUMENTOS ============
CREATE TABLE public.documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  propriedade_id UUID REFERENCES public.propriedades(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  tipo TEXT,
  formato TEXT,
  tamanho_bytes BIGINT,
  storage_bucket TEXT DEFAULT 'documentos',
  storage_path TEXT,
  url TEXT,
  validade DATE,
  status TEXT DEFAULT 'valido',
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documentos TO authenticated;
GRANT ALL ON public.documentos TO service_role;
ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_documentos_updated_at BEFORE UPDATE ON public.documentos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Selecionar próprios documentos" ON public.documentos FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Inserir próprios documentos" ON public.documentos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar próprios documentos" ON public.documentos FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Excluir próprios documentos" ON public.documentos FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- ============ ETIQUETAS ============
CREATE TABLE public.etiquetas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lote_id UUID REFERENCES public.lotes_rastreabilidade(id) ON DELETE SET NULL,
  codigo TEXT NOT NULL,
  tipo TEXT DEFAULT 'qr_code',
  produto TEXT,
  quantidade NUMERIC,
  unidade TEXT,
  conteudo TEXT,
  impressoes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'ativa',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, codigo)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.etiquetas TO authenticated;
GRANT ALL ON public.etiquetas TO service_role;
ALTER TABLE public.etiquetas ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_etiquetas_updated_at BEFORE UPDATE ON public.etiquetas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Selecionar próprias etiquetas" ON public.etiquetas FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Inserir próprias etiquetas" ON public.etiquetas FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar próprias etiquetas" ON public.etiquetas FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Excluir próprias etiquetas" ON public.etiquetas FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- ============ CONFIGURAÇÕES ============
CREATE TABLE public.configuracoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chave TEXT NOT NULL,
  valor JSONB NOT NULL DEFAULT '{}'::jsonb,
  escopo TEXT DEFAULT 'usuario',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, chave)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.configuracoes TO authenticated;
GRANT ALL ON public.configuracoes TO service_role;
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_configuracoes_updated_at BEFORE UPDATE ON public.configuracoes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Selecionar próprias configurações" ON public.configuracoes FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Inserir próprias configurações" ON public.configuracoes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar próprias configurações" ON public.configuracoes FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Excluir próprias configurações" ON public.configuracoes FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- ============ STORAGE: DOCUMENTOS ============
INSERT INTO storage.buckets (id, name, public)
VALUES ('documentos', 'documentos', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Usuários leem os próprios arquivos de documentos"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'documentos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Usuários enviam arquivos para a própria pasta de documentos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'documentos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Usuários atualizam os próprios arquivos de documentos"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'documentos'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'documentos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Usuários excluem os próprios arquivos de documentos"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'documentos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
