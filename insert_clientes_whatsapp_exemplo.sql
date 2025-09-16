-- Script para inserir dados de exemplo na tabela clientes_whatsapp
-- Execute após criar a tabela com a migração

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

-- Verificar inserção
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
