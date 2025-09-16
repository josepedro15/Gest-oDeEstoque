-- Adicionar campos marca e user_id à tabela estoque
ALTER TABLE public.estoque 
ADD COLUMN IF NOT EXISTS marca TEXT,
ADD COLUMN IF NOT EXISTS user_id UUID;

-- Criar índice para user_id para melhor performance
CREATE INDEX IF NOT EXISTS idx_estoque_user_id ON public.estoque USING btree(user_id);

-- Criar índice para marca
CREATE INDEX IF NOT EXISTS idx_estoque_marca ON public.estoque USING btree(marca);
