# Configuração de Webhook para Estoque

## 📋 **Visão Geral**

O sistema agora envia automaticamente dados para um webhook sempre que um produto for:
- ✅ **Criado** (novo item adicionado)
- ✅ **Editado** (quantidade, preço, disponibilidade alterados)
- ✅ **Excluído** (item removido do estoque)

## 🔧 **Configuração**

### Variável de Ambiente
Adicione no seu arquivo `.env`:
```env
VITE_WEBHOOK_URL=https://n8n.aiensed.com/webhook-test/deposito
```

### URL Padrão
Se não configurado, usa: `https://n8n.aiensed.com/webhook-test/deposito`

## 📊 **Formato dos Dados Enviados**

### Produto Criado
```json
{
  "action": "created",
  "timestamp": "2025-01-17T20:30:00.000Z",
  "product": {
    "id": "uuid-do-produto",
    "nome": "Argamassa AC-I 20kg",
    "marca": "Quartzolit",
    "quantidade": 200,
    "disponivel": true,
    "preco": 29.9,
    "user_id": "33ed3ee2-95bf-4746-8862-2d5dfa029409",
    "updated_at": "2025-01-17T20:30:00.000Z"
  }
}
```

### Produto Editado
```json
{
  "action": "updated",
  "timestamp": "2025-01-17T20:30:00.000Z",
  "product": {
    "id": "uuid-do-produto",
    "nome": "Argamassa AC-I 20kg",
    "marca": "Quartzolit",
    "quantidade": 150,
    "disponivel": true,
    "preco": 32.5,
    "user_id": "33ed3ee2-95bf-4746-8862-2d5dfa029409",
    "updated_at": "2025-01-17T20:30:00.000Z"
  },
  "changes": [
    {
      "field": "quantidade",
      "old_value": 200,
      "new_value": 150
    },
    {
      "field": "preco",
      "old_value": 29.9,
      "new_value": 32.5
    }
  ]
}
```

### Produto Excluído
```json
{
  "action": "deleted",
  "timestamp": "2025-01-17T20:30:00.000Z",
  "product": {
    "id": "uuid-do-produto",
    "nome": "Argamassa AC-I 20kg",
    "marca": "Quartzolit",
    "quantidade": 200,
    "disponivel": true,
    "preco": 29.9,
    "user_id": "33ed3ee2-95bf-4746-8862-2d5dfa029409",
    "updated_at": "2025-01-17T20:30:00.000Z"
  }
}
```

## 🎯 **Exemplo de Uso no n8n**

### Node HTTP Request
- **Method**: POST
- **URL**: `{{ $json.webhookUrl }}`
- **Body**: `{{ $json }}`

### Node Supabase (para salvar no CRM)
```sql
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
    'Produto: {{ $json.product.nome }}',
    '5511999999999@s.whatsapp.net',
    'Ação: {{ $json.action }} | Produto: {{ $json.product.nome }} | Marca: {{ $json.product.marca }} | Quantidade: {{ $json.product.quantidade }} | Preço: R$ {{ $json.product.preco }}',
    NOW(),
    'ativo',
    'Mudanças: {{ $json.changes }}'
);
```

## ⚠️ **Observações**

1. **Webhook é enviado apenas se houver mudanças** (para updates)
2. **Logs são salvos no console** do navegador
3. **Erros não interrompem** a operação principal
4. **Timestamp é sempre UTC**
5. **Changes array** mostra apenas campos alterados

## 🚀 **Como Testar**

1. **Crie um novo produto** no estoque
2. **Edite quantidade/preço** de um produto existente
3. **Exclua um produto**
4. **Verifique os logs** no console do navegador
5. **Confirme no n8n** se os dados chegaram

## ✅ **Status do Teste**

**Webhook testado e funcionando!** ✅
- **Endpoint**: `https://n8n.aiensed.com/webhook-test/deposito`
- **Método**: POST
- **Status**: Dados recebidos com sucesso no n8n
- **Último teste**: 16/09/2025 23:22
