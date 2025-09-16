import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

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
      const { error } = await supabase
        .from('estoque')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      await fetchData(); // Refresh data after update
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
      const { error } = await supabase
        .from('estoque')
        .insert([item]);

      if (error) {
        throw error;
      }

      await fetchData(); // Refresh data after creation
      return { success: true };
    } catch (err) {
      console.error('Erro ao criar item:', err);
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
    createItem
  };
};