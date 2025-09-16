import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ProdutoPopular {
  id: string;
  nome: string;
  quantidade: number;
  disponivel: boolean;
  preco: number;
  vezes_procurado: number;
  ultima_busca: string;
}

export const useProdutosPopulares = () => {
  const [data, setData] = useState<ProdutoPopular[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProdutosPopulares = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar todos os produtos do estoque
      const { data: estoque, error } = await supabase
        .from('estoque')
        .select('*')
        .order('nome', { ascending: true });

      if (error) {
        throw error;
      }

      // Simular dados de popularidade
      // Em um sistema real, isso viria de uma tabela de buscas/visualizações
      const produtosComPopularidade = estoque?.map((produto) => ({
        ...produto,
        vezes_procurado: Math.floor(Math.random() * 100) + 1,
        ultima_busca: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      })) || [];

      // Ordenar por popularidade e pegar top 10
      const produtosOrdenados = produtosComPopularidade
        .sort((a, b) => b.vezes_procurado - a.vezes_procurado)
        .slice(0, 10);

      setData(produtosOrdenados);
    } catch (err) {
      console.error('Erro ao buscar produtos populares:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutosPopulares();
  }, []);

  const refresh = () => {
    fetchProdutosPopulares();
  };

  const getStats = () => {
    if (!data.length) return null;

    const totalBuscas = data.reduce((acc, p) => acc + p.vezes_procurado, 0);
    const mediaBuscas = Math.round(totalBuscas / data.length);
    const maisProcurado = data[0];

    return {
      totalProdutos: data.length,
      totalBuscas,
      mediaBuscas,
      maisProcurado: maisProcurado ? {
        nome: maisProcurado.nome,
        vezes_procurado: maisProcurado.vezes_procurado
      } : null
    };
  };

  return {
    data,
    loading,
    error,
    refresh,
    stats: getStats()
  };
};
