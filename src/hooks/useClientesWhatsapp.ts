import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ClienteWhatsapp {
  id: string;
  nome?: string;
  telefone: string;
  resumo_conversa?: string;
  data_ultimo_contato: string;
  status: 'ativo' | 'inativo' | 'bloqueado';
  observacoes?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export const useClientesWhatsapp = (search: string = "", statusFilter: string = "todos") => {
  const [data, setData] = useState<ClienteWhatsapp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('clientes_whatsapp')
        .select('*')
        .order('data_ultimo_contato', { ascending: false });

      // Filtro por busca (nome ou telefone)
      if (search.trim()) {
        query = query.or(`nome.ilike.%${search.trim()}%,telefone.ilike.%${search.trim()}%`);
      }

      // Filtro por status
      if (statusFilter !== "todos") {
        query = query.eq('status', statusFilter);
      }

      const { data: clientes, error } = await query;

      if (error) {
        throw error;
      }

      setData(clientes || []);
    } catch (err) {
      console.error('Erro ao buscar clientes WhatsApp:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, statusFilter]);

  const refresh = () => {
    fetchData();
  };

  const createCliente = async (cliente: Omit<ClienteWhatsapp, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Limpar e formatar o telefone se necessário
      const clienteFormatado = {
        ...cliente,
        telefone: cliente.telefone.trim()
      };

      const { error } = await supabase
        .from('clientes_whatsapp')
        .insert([clienteFormatado]);

      if (error) {
        throw error;
      }

      await fetchData();
      return { success: true };
    } catch (err) {
      console.error('Erro ao criar cliente:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro desconhecido' 
      };
    }
  };

  const updateCliente = async (id: string, updates: Partial<ClienteWhatsapp>) => {
    try {
      const { error } = await supabase
        .from('clientes_whatsapp')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      await fetchData();
      return { success: true };
    } catch (err) {
      console.error('Erro ao atualizar cliente:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro desconhecido' 
      };
    }
  };

  const deleteCliente = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clientes_whatsapp')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      await fetchData();
      return { success: true };
    } catch (err) {
      console.error('Erro ao deletar cliente:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro desconhecido' 
      };
    }
  };

  const getStats = () => {
    if (!data.length) return null;

    const ativos = data.filter(c => c.status === 'ativo').length;
    const inativos = data.filter(c => c.status === 'inativo').length;
    const bloqueados = data.filter(c => c.status === 'bloqueado').length;
    const total = data.length;

    return {
      total,
      ativos,
      inativos,
      bloqueados
    };
  };

  return {
    data,
    loading,
    error,
    refresh,
    createCliente,
    updateCliente,
    deleteCliente,
    stats: getStats()
  };
};
