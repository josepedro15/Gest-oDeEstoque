-- Script para remover completamente a constraint de telefone
-- Execute este script no Supabase SQL Editor se quiser aceitar qualquer formato

-- 1. Remover a constraint atual
ALTER TABLE public.clientes_whatsapp 
DROP CONSTRAINT IF EXISTS check_telefone_format;

-- 2. Remover a constraint flexível se existir
ALTER TABLE public.clientes_whatsapp 
DROP CONSTRAINT IF EXISTS check_telefone_format_flexible;

-- 3. Verificar se as constraints foram removidas
SELECT 
    conname as constraint_name,
    contype as constraint_type
FROM pg_constraint 
WHERE conrelid = 'public.clientes_whatsapp'::regclass 
AND conname LIKE '%telefone%';

-- 4. Testar inserção com formato do WhatsApp
INSERT INTO public.clientes_whatsapp (user_id, nome, telefone, resumo_conversa, data_ultimo_contato, status) VALUES
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Teste WhatsApp', '553194959512@s.whatsapp.net', 'Teste de inserção via n8n', NOW(), 'ativo');

-- 5. Verificar se foi inserido
SELECT * FROM public.clientes_whatsapp WHERE telefone = '553194959512@s.whatsapp.net';

-- 6. Limpar o teste
DELETE FROM public.clientes_whatsapp WHERE telefone = '553194959512@s.whatsapp.net';
