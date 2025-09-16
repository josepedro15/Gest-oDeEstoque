-- Script para inserir dados do webhook n8n na tabela clientes_whatsapp
-- Execute este script no Supabase SQL Editor

-- Inserir dados do Dr. Gustavo
INSERT INTO public.clientes_whatsapp (
    user_id,
    nome,
    telefone,
    resumo_conversa,
    data_ultimo_contato,
    status,
    observacoes
) VALUES (
    '33ed3ee2-95bf-4746-8862-2d5dfa029409', -- Seu user_id
    'Dr. Gustavo',
    '5524992615513@s.whatsapp.net', -- Usando o telefone2 que está no formato WhatsApp
    'Olá, tudo bem? Estou entrando em contato para apresentação da solução.',
    NOW(),
    'ativo',
    'Lead frio: Sim | Telefone alternativo: 280731997753467@lid'
);

-- Verificar se foi inserido
SELECT * FROM public.clientes_whatsapp WHERE nome = 'Dr. Gustavo';
