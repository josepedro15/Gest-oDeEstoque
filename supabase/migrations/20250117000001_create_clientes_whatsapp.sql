-- Criar tabela de clientes do WhatsApp (CRM)
CREATE TABLE public.clientes_whatsapp (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT,
  telefone TEXT NOT NULL,
  resumo_conversa TEXT,
  data_ultimo_contato TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'bloqueado')),
  observacoes TEXT,
  user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX idx_clientes_whatsapp_telefone ON public.clientes_whatsapp USING btree(telefone);
CREATE INDEX idx_clientes_whatsapp_nome ON public.clientes_whatsapp USING btree(nome);
CREATE INDEX idx_clientes_whatsapp_user_id ON public.clientes_whatsapp USING btree(user_id);
CREATE INDEX idx_clientes_whatsapp_status ON public.clientes_whatsapp USING btree(status);
CREATE INDEX idx_clientes_whatsapp_data_contato ON public.clientes_whatsapp USING btree(data_ultimo_contato);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_clientes_whatsapp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_clientes_whatsapp_updated_at
  BEFORE UPDATE ON public.clientes_whatsapp
  FOR EACH ROW
  EXECUTE FUNCTION update_clientes_whatsapp_updated_at();

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.clientes_whatsapp ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para permitir acesso público
CREATE POLICY "Permitir leitura para todos" ON public.clientes_whatsapp FOR SELECT USING (true);
CREATE POLICY "Permitir inserção para todos" ON public.clientes_whatsapp FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização para todos" ON public.clientes_whatsapp FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusão para todos" ON public.clientes_whatsapp FOR DELETE USING (true);

-- Adicionar constraint para validar formato do telefone (opcional)
-- Aceita formatos como: +5511999999999, 11999999999, (11) 99999-9999
ALTER TABLE public.clientes_whatsapp 
ADD CONSTRAINT check_telefone_format 
CHECK (telefone ~ '^(\+?55)?\s?\(?[1-9]{2}\)?\s?[0-9]{4,5}-?[0-9]{4}$');
