-- Script completo para criar tabela de CRM WhatsApp e inserir dados de exemplo
-- Execute este script no Supabase SQL Editor

-- 1. Criar tabela de clientes do WhatsApp (CRM)
CREATE TABLE IF NOT EXISTS public.clientes_whatsapp (
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

-- 2. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_clientes_whatsapp_telefone ON public.clientes_whatsapp USING btree(telefone);
CREATE INDEX IF NOT EXISTS idx_clientes_whatsapp_nome ON public.clientes_whatsapp USING btree(nome);
CREATE INDEX IF NOT EXISTS idx_clientes_whatsapp_user_id ON public.clientes_whatsapp USING btree(user_id);
CREATE INDEX IF NOT EXISTS idx_clientes_whatsapp_status ON public.clientes_whatsapp USING btree(status);
CREATE INDEX IF NOT EXISTS idx_clientes_whatsapp_data_contato ON public.clientes_whatsapp USING btree(data_ultimo_contato);

-- 3. Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_clientes_whatsapp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_clientes_whatsapp_updated_at ON public.clientes_whatsapp;
CREATE TRIGGER trigger_update_clientes_whatsapp_updated_at
  BEFORE UPDATE ON public.clientes_whatsapp
  FOR EACH ROW
  EXECUTE FUNCTION update_clientes_whatsapp_updated_at();

-- 4. Habilitar RLS (Row Level Security)
ALTER TABLE public.clientes_whatsapp ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas RLS para permitir acesso público
DROP POLICY IF EXISTS "Permitir leitura para todos" ON public.clientes_whatsapp;
DROP POLICY IF EXISTS "Permitir inserção para todos" ON public.clientes_whatsapp;
DROP POLICY IF EXISTS "Permitir atualização para todos" ON public.clientes_whatsapp;
DROP POLICY IF EXISTS "Permitir exclusão para todos" ON public.clientes_whatsapp;

CREATE POLICY "Permitir leitura para todos" ON public.clientes_whatsapp FOR SELECT USING (true);
CREATE POLICY "Permitir inserção para todos" ON public.clientes_whatsapp FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização para todos" ON public.clientes_whatsapp FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusão para todos" ON public.clientes_whatsapp FOR DELETE USING (true);

-- 6. Adicionar constraint para validar formato do telefone (opcional)
-- Aceita formatos como: +5511999999999, 11999999999, (11) 99999-9999
ALTER TABLE public.clientes_whatsapp 
DROP CONSTRAINT IF EXISTS check_telefone_format;
ALTER TABLE public.clientes_whatsapp 
ADD CONSTRAINT check_telefone_format 
CHECK (telefone ~ '^(\+?55)?\s?\(?[1-9]{2}\)?\s?[0-9]{4,5}-?[0-9]{4}$');

-- 7. Inserir dados de exemplo
INSERT INTO public.clientes_whatsapp (user_id, nome, telefone, resumo_conversa, data_ultimo_contato, status, observacoes) VALUES
-- Clientes ativos
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'João Silva', '+5511999887766', 'Cliente interessado em cimento Portland. Precisava de 50 sacos para obra residencial. Orçamento enviado, aguardando confirmação.', NOW() - INTERVAL '2 hours', 'ativo', 'Cliente potencial, obra em andamento'),
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Maria Santos', '+5511888776655', 'Consultou sobre tintas acrílicas. Queria saber sobre cores disponíveis e preços. Enviou foto da parede para análise.', NOW() - INTERVAL '1 day', 'ativo', 'Interessada em pintura completa da casa'),
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Pedro Oliveira', '+5511777665544', 'Pediu orçamento para telhas fibrocimento. Obra comercial, precisa de 200 unidades. Negociando desconto por volume.', NOW() - INTERVAL '3 hours', 'ativo', 'Cliente corporativo, grande volume'),
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Ana Costa', '+5511666554433', 'Dúvidas sobre argamassa. Não sabia qual tipo usar para piscina. Explicamos sobre impermeabilização.', NOW() - INTERVAL '6 hours', 'ativo', 'Primeira obra, precisa de orientação'),
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Carlos Ferreira', '+5511555443322', 'Cliente recorrente. Sempre compra cimento e areia. Pediu para avisar quando chegar novo lote de cimento Votorantim.', NOW() - INTERVAL '1 hour', 'ativo', 'Cliente fiel, compras regulares'),

-- Clientes inativos (sem contato recente)
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Roberto Lima', '+5511444332211', 'Interessado em massa corrida. Pediu orçamento mas não retornou. Último contato há 15 dias.', NOW() - INTERVAL '15 days', 'inativo', 'Não retornou após orçamento'),
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Fernanda Alves', '+5511333221100', 'Consultou sobre tubos PVC. Precisava para reforma do banheiro. Não respondeu às mensagens de follow-up.', NOW() - INTERVAL '8 days', 'inativo', 'Perdeu interesse após consulta inicial'),
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Marcos Pereira', '+5511222110099', 'Cliente antigo. Sempre comprava materiais básicos. Não responde há 30 dias. Pode ter mudado de fornecedor.', NOW() - INTERVAL '30 days', 'inativo', 'Cliente antigo, sem contato recente'),

-- Cliente bloqueado
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'José Malandro', '+5511111009988', 'Cliente problemático. Sempre negocia preços muito baixos e não paga em dia. Última compra gerou problemas.', NOW() - INTERVAL '5 days', 'bloqueado', 'Problemas de pagamento, cliente problemático'),

-- Clientes sem nome (apenas telefone)
('33ed3ee2-95bf-4746-8862-2d5dfa029409', NULL, '+5511999888777', 'Ligou perguntando sobre preços de cimento. Não se identificou. Disse que ligaria depois com mais detalhes.', NOW() - INTERVAL '4 hours', 'ativo', 'Cliente anônimo, aguardando identificação'),
('33ed3ee2-95bf-4746-8862-2d5dfa029409', NULL, '+5511888777666', 'Mensagem automática de WhatsApp. Cliente interessado em promoções. Cadastrou para receber ofertas.', NOW() - INTERVAL '2 days', 'ativo', 'Lead de marketing, aguardando qualificação');

-- 8. Verificar inserção
SELECT 
    nome,
    telefone,
    status,
    data_ultimo_contato,
    CASE 
        WHEN resumo_conversa IS NOT NULL THEN LEFT(resumo_conversa, 50) || '...'
        ELSE 'Sem resumo'
    END as resumo_resumido,
    observacoes
FROM public.clientes_whatsapp 
WHERE user_id = '33ed3ee2-95bf-4746-8862-2d5dfa029409'
ORDER BY data_ultimo_contato DESC;
