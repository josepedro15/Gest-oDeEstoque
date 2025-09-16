-- Script para corrigir a constraint de telefone para aceitar formatos do WhatsApp
-- Execute este script no Supabase SQL Editor

-- 1. Remover a constraint atual
ALTER TABLE public.clientes_whatsapp 
DROP CONSTRAINT IF EXISTS check_telefone_format;

-- 2. Criar uma nova constraint mais flexível que aceita:
-- - Números de telefone brasileiros: (11) 99999-9999, +5511999999999, 11999999999
-- - IDs do WhatsApp: 553194959512@s.whatsapp.net, 553194959512
-- - Qualquer string que contenha números
ALTER TABLE public.clientes_whatsapp 
ADD CONSTRAINT check_telefone_format_flexible 
CHECK (
  telefone ~ '^(\+?55)?\s?\(?[1-9]{2}\)?\s?[0-9]{4,5}-?[0-9]{4}$' OR  -- Formato brasileiro
  telefone ~ '^[0-9]{10,13}@s\.whatsapp\.net$' OR                      -- ID WhatsApp com @s.whatsapp.net
  telefone ~ '^[0-9]{10,13}$' OR                                       -- Apenas números (10-13 dígitos)
  telefone ~ '^[0-9]{10,13}@.*$'                                       -- ID WhatsApp com qualquer domínio
);

-- 3. Verificar se a constraint foi aplicada corretamente
SELECT 
    conname as constraint_name,
    contype as constraint_type
FROM pg_constraint 
WHERE conrelid = 'public.clientes_whatsapp'::regclass 
AND conname = 'check_telefone_format_flexible';
