import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWebhook } from "./useWebhook";

export interface EstoqueItem {
  id: string;
  nome: string;
  marca?: string;
  quantidade: number;
  disponivel: boolean;
  preco: number;
  user_id?: string;
  updated_at: string;
}

export const useEstoque = (search: string = "") => {
  const [data, setData] = useState<EstoqueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { sendProductCreated, sendProductUpdated, sendProductDeleted } = useWebhook();

  // Debounce search term to avoid excessive API calls
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('estoque')
        .select('*')
        .order('nome', { ascending: true });

      if (debouncedSearch.trim()) {
        query = query.ilike('nome', `%${debouncedSearch.trim()}%`);
      }

      const { data: items, error } = await query;

      if (error) {
        throw error;
      }

      setData(items || []);
    } catch (err) {
      console.error('Erro ao buscar estoque:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearch]);

  const refresh = () => {
    fetchData();
  };

  const updateItem = async (id: string, updates: Partial<EstoqueItem>) => {
    try {
      // Buscar o item atual para comparar mudanças
      const currentItem = data.find(item => item.id === id);
      if (!currentItem) {
        throw new Error('Item não encontrado');
      }

      // Detectar mudanças ANTES de atualizar
      const changes = [];
      if (updates.quantidade !== undefined && updates.quantidade !== currentItem.quantidade) {
        changes.push({
          field: 'quantidade',
          old_value: currentItem.quantidade,
          new_value: updates.quantidade
        });
      }
      if (updates.disponivel !== undefined && updates.disponivel !== currentItem.disponivel) {
        changes.push({
          field: 'disponivel',
          old_value: currentItem.disponivel,
          new_value: updates.disponivel
        });
      }
      if (updates.preco !== undefined && updates.preco !== currentItem.preco) {
        changes.push({
          field: 'preco',
          old_value: currentItem.preco,
          new_value: updates.preco
        });
      }

      const { data: updatedItem, error } = await supabase
        .from('estoque')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      await fetchData(); // Refresh data after update

      // Enviar webhook apenas se houver mudanças
      if (changes.length > 0 && updatedItem) {
        console.log('🚀 Enviando webhook para produto atualizado:', updatedItem.nome);
        console.log('📊 Mudanças detectadas:', changes);
        await sendProductUpdated(updatedItem, changes);
      } else {
        console.log('ℹ️ Nenhuma mudança detectada, webhook não enviado');
      }

      return { success: true };
    } catch (err) {
      console.error('Erro ao atualizar item:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro desconhecido' 
      };
    }
  };

  const createItem = async (item: Omit<EstoqueItem, 'id' | 'updated_at'>) => {
    try {
      const { data: newItem, error } = await supabase
        .from('estoque')
        .insert([item])
        .select()
        .single();

      if (error) {
        throw error;
      }

      await fetchData(); // Refresh data after creation

      // Enviar webhook para item criado
      if (newItem) {
        console.log('🚀 Enviando webhook para produto criado:', newItem.nome);
        await sendProductCreated(newItem);
      }

      return { success: true };
    } catch (err) {
      console.error('Erro ao criar item:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro desconhecido' 
      };
    }
  };

  const deleteItem = async (id: string) => {
    try {
      // Buscar o item antes de deletar para enviar no webhook
      const itemToDelete = data.find(item => item.id === id);
      
      const { error } = await supabase
        .from('estoque')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      await fetchData(); // Refresh data after deletion

      // Enviar webhook para item deletado
      if (itemToDelete) {
        console.log('🚀 Enviando webhook para produto deletado:', itemToDelete.nome);
        await sendProductDeleted(itemToDelete);
      }

      return { success: true };
    } catch (err) {
      console.error('Erro ao deletar item:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro desconhecido' 
      };
    }
  };

  return {
    data,
    loading,
    error,
    refresh,
    updateItem,
    createItem,
    deleteItem
  };
};