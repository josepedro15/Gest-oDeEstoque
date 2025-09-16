-- Criar tabela estoque
CREATE TABLE public.estoque (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  quantidade INTEGER NOT NULL DEFAULT 0,
  disponivel BOOLEAN NOT NULL DEFAULT true,
  preco NUMERIC(12,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar índice para nome
CREATE INDEX idx_estoque_nome ON public.estoque USING btree(nome);

-- Adicionar constraint para quantidade não negativa usando trigger de validação
CREATE OR REPLACE FUNCTION validate_estoque_quantidade()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quantidade < 0 THEN
    RAISE EXCEPTION 'Quantidade deve ser maior ou igual a zero';
  END IF;
  IF NEW.preco < 0 THEN
    RAISE EXCEPTION 'Preço deve ser maior ou igual a zero';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_estoque_quantidade
  BEFORE INSERT OR UPDATE ON public.estoque
  FOR EACH ROW
  EXECUTE FUNCTION validate_estoque_quantidade();

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_estoque_updated_at
  BEFORE UPDATE ON public.estoque
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.estoque ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para permitir acesso público (conforme requisito 7)
CREATE POLICY "Permitir leitura para todos" ON public.estoque FOR SELECT USING (true);
CREATE POLICY "Permitir inserção para todos" ON public.estoque FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização para todos" ON public.estoque FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusão para todos" ON public.estoque FOR DELETE USING (true);