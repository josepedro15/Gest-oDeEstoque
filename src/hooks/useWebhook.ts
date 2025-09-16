import { useState } from "react";
import { EstoqueItem } from "./useEstoque";

interface WebhookPayload {
  action: 'created' | 'updated' | 'deleted';
  timestamp: string;
  product: {
    id: string;
    nome: string;
    marca?: string;
    quantidade: number;
    disponivel: boolean;
    preco: number;
    user_id?: string;
    updated_at: string;
  };
  changes?: {
    field: string;
    old_value: any;
    new_value: any;
  }[];
}

export const useWebhook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL do webhook - você pode configurar via variável de ambiente
  const webhookUrl = import.meta.env.VITE_WEBHOOK_URL || "https://n8n.aiensed.com/webhook-test/deposito";

  const sendWebhook = async (payload: WebhookPayload) => {
    try {
      setLoading(true);
      setError(null);

      console.log('📡 Enviando webhook para:', webhookUrl);
      console.log('📊 Payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('📡 Resposta do webhook:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na resposta do webhook:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.text();
      console.log('✅ Webhook enviado com sucesso:', result);
      
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('💥 Erro ao enviar webhook:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const sendProductCreated = async (product: EstoqueItem) => {
    const payload: WebhookPayload = {
      action: 'created',
      timestamp: new Date().toISOString(),
      product: {
        id: product.id,
        nome: product.nome,
        marca: product.marca,
        quantidade: product.quantidade,
        disponivel: product.disponivel,
        preco: product.preco,
        user_id: product.user_id,
        updated_at: product.updated_at
      }
    };

    return await sendWebhook(payload);
  };

  const sendProductUpdated = async (product: EstoqueItem, changes: { field: string; old_value: any; new_value: any }[]) => {
    const payload: WebhookPayload = {
      action: 'updated',
      timestamp: new Date().toISOString(),
      product: {
        id: product.id,
        nome: product.nome,
        marca: product.marca,
        quantidade: product.quantidade,
        disponivel: product.disponivel,
        preco: product.preco,
        user_id: product.user_id,
        updated_at: product.updated_at
      },
      changes
    };

    return await sendWebhook(payload);
  };

  const sendProductDeleted = async (product: EstoqueItem) => {
    const payload: WebhookPayload = {
      action: 'deleted',
      timestamp: new Date().toISOString(),
      product: {
        id: product.id,
        nome: product.nome,
        marca: product.marca,
        quantidade: product.quantidade,
        disponivel: product.disponivel,
        preco: product.preco,
        user_id: product.user_id,
        updated_at: product.updated_at
      }
    };

    return await sendWebhook(payload);
  };

  return {
    loading,
    error,
    sendProductCreated,
    sendProductUpdated,
    sendProductDeleted,
    sendWebhook
  };
};
