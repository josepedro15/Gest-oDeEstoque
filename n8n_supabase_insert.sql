-- Script para usar no n8n Supabase node
-- Este script pode ser executado diretamente no n8n

INSERT INTO public.clientes_whatsapp (
    user_id,
    nome,
    telefone,
    resumo_conversa,
    data_ultimo_contato,
    status,
    observacoes
) VALUES (
    '33ed3ee2-95bf-4746-8862-2d5dfa029409',
    '{{ $json.nome }}',
    '{{ $json.telefone2 }}', -- Usando telefone2 que está no formato WhatsApp
    '{{ $json.mensagem }}',
    NOW(),
    'ativo',
    'Lead frio: {{ $json.frio }} | Telefone alternativo: {{ $json.telefone }}'
);
