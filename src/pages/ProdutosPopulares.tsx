import { useToast } from "@/hooks/use-toast";
import { useProdutosPopulares } from "@/hooks/useProdutosPopulares";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Package, Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProdutosPopulares() {
  const { data: produtos, loading, error, stats } = useProdutosPopulares();
  const { toast } = useToast();

  if (error) {
    toast({
      title: "Erro ao carregar dados",
      description: "Não foi possível carregar os produtos mais procurados.",
      variant: "destructive"
    });
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getPopularityBadge = (vezesProcurado: number) => {
    if (vezesProcurado >= 80) return { variant: "default" as const, text: "Muito Popular" };
    if (vezesProcurado >= 50) return { variant: "secondary" as const, text: "Popular" };
    if (vezesProcurado >= 20) return { variant: "outline" as const, text: "Em Alta" };
    return { variant: "outline" as const, text: "Procurado" };
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Carregando produtos mais procurados...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/gestao-estoque" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Estoque
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              Produtos Mais Procurados
            </h1>
            <p className="text-muted-foreground mt-1">
              Top 10 produtos mais buscados pelos clientes
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProdutos || 0}</div>
            <p className="text-xs text-muted-foreground">
              Produtos em análise
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mais Procurado</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.maisProcurado?.vezes_procurado || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.maisProcurado?.nome || "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média de Buscas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.mediaBuscas || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Buscas por produto
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {produtos.map((produto, index) => {
          const popularity = getPopularityBadge(produto.vezes_procurado);
          
          return (
            <Card key={produto.id} className="relative">
              {/* Ranking Badge */}
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                #{index + 1}
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {produto.nome}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {formatCurrency(produto.preco)}
                    </CardDescription>
                  </div>
                  <Badge variant={popularity.variant}>
                    {popularity.text}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Quantidade</p>
                    <p className="font-medium">{produto.quantidade}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Buscas</p>
                    <p className="font-medium text-primary">{produto.vezes_procurado}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <Badge variant={produto.disponivel ? "default" : "destructive"}>
                    {produto.disponivel ? "Disponível" : "Indisponível"}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Última busca: {formatDate(produto.ultima_busca)}
                  </p>
                </div>

                {/* Popularity Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Popularidade</span>
                    <span>{produto.vezes_procurado} buscas</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((produto.vezes_procurado / (produtos[0]?.vezes_procurado || 1)) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {produtos.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
          <p className="text-muted-foreground mb-4">
            Não há produtos no estoque para análise de popularidade.
          </p>
          <Button asChild>
            <Link to="/gestao-estoque">
              <Package className="h-4 w-4 mr-2" />
              Gerenciar Estoque
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
