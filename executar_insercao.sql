-- Script completo para executar migração e inserção de dados
-- Execute este script no Supabase SQL Editor

-- 1. Primeiro, executar a migração para adicionar os campos
ALTER TABLE public.estoque 
ADD COLUMN IF NOT EXISTS marca TEXT,
ADD COLUMN IF NOT EXISTS user_id UUID;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_estoque_user_id ON public.estoque USING btree(user_id);
CREATE INDEX IF NOT EXISTS idx_estoque_marca ON public.estoque USING btree(marca);

-- 2. Inserir todos os produtos
INSERT INTO public.estoque (user_id, nome, marca, quantidade, preco, disponivel) VALUES
-- Cimento Portland Comum 50 kg
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Cimento Portland Comum 50 kg', 'Votorantim', 100, 41.90, TRUE),
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Cimento Portland Comum 50 kg', 'Cauê (InterCement)', 80, 39.50, TRUE),
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Cimento Portland Comum 50 kg', 'CSN Cimentos', 70, 40.00, TRUE),
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Cimento Portland Comum 50 kg', 'Itambé', 60, 38.90, TRUE),

-- Argamassa AC-I 20kg
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Argamassa AC-I 20kg', 'Quartzolit', 200, 29.90, TRUE),
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Argamassa AC-I 20kg', 'Vedacit', 150, 28.50, TRUE),
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Argamassa AC-I 20kg', 'Fortaleza', 120, 27.90, TRUE),
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Argamassa AC-I 20kg', 'Usaforte', 80, 30.50, TRUE),

-- Tinta Acrílica 18L (Branca)
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Tinta Acrílica 18L (Branca)', 'Suvinil', 30, 310.00, TRUE),
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Tinta Acrílica 18L (Branca)', 'Coral', 25, 298.00, TRUE),
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Tinta Acrílica 18L (Branca)', 'Sherwin-Williams', 20, 320.00, TRUE),
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Tinta Acrílica 18L (Branca)', 'Bautech', 15, 305.00, TRUE),

-- Massa Corrida 25kg
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Massa Corrida 25kg', 'Bautech', 50, 60.00, TRUE),
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Massa Corrida 25kg', 'Quartzolit', 40, 58.00, TRUE),
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Massa Corrida 25kg', 'Fortaleza', 35, 57.50, TRUE),

-- Outros produtos
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Telha Fibrocimento 2,44 m', 'Brasilit', 40, 95.00, TRUE),
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Vergalhão 8mm 12m', 'Gerdau', 200, 43.50, TRUE),
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Tubo PVC 100mm 6m', 'Tigre', 60, 125.00, TRUE),
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Caixa d''água 1.000L', 'Fortlev', 12, 590.00, TRUE),
('33ed3ee2-95bf-4746-8862-2d5dfa029409', 'Conduíte Flexível 20mm', 'Amanco', 10, 89.00, TRUE);

-- 3. Verificar inserção
SELECT 
    nome,
    marca,
    quantidade,
    preco,
    disponivel,
    created_at
FROM public.estoque 
WHERE user_id = '33ed3ee2-95bf-4746-8862-2d5dfa029409'
ORDER BY nome, marca;
