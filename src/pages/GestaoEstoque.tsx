import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download, Filter, TrendingUp, Home, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { DataTableEstoque } from "@/components/estoque/DataTableEstoque";
import { ModalNovoItem } from "@/components/estoque/ModalNovoItem";
import { useEstoque } from "@/hooks/useEstoque";

export default function GestaoEstoque() {
  const [search, setSearch] = useState("");
  const [disponibilidadeFilter, setDisponibilidadeFilter] = useState<string>("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: estoque, loading, refresh } = useEstoque(search);
  const { toast } = useToast();

  // Filter data based on disponibilidade
  const filteredEstoque = estoque?.filter(item => {
    if (disponibilidadeFilter === "disponivel") return item.disponivel;
    if (disponibilidadeFilter === "indisponivel") return !item.disponivel;
    return true; // "todos"
  }) || [];

  const handleExportCSV = () => {
    if (!filteredEstoque.length) {
      toast({
        title: "Nenhum dado para exportar",
        description: "A tabela está vazia ou sem resultados.",
        variant: "destructive"
      });
      return;
    }

    const headers = ["Nome", "Quantidade", "Disponível", "Preço"];
    const csvContent = [
      headers.join(","),
      ...filteredEstoque.map(item => [
        `"${item.nome}"`,
        item.quantidade,
        item.disponivel ? "Sim" : "Não",
        `"R$ ${item.preco.toFixed(2).replace(".", ",")}"`,
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `estoque_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "CSV exportado com sucesso!",
      description: `${filteredEstoque.length} itens exportados.`
    });
  };

  const handleItemCreated = () => {
    setIsModalOpen(false);
    refresh();
    toast({
      title: "Item criado",
      description: "Item adicionado ao estoque com sucesso."
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Gestão de Estoque</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Início
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/produtos-populares" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Produtos Populares
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/crm-whatsapp" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                CRM WhatsApp
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Buscar por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            
            <Select value={disponibilidadeFilter} onValueChange={setDisponibilidadeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por disponibilidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="disponivel">Disponíveis</SelectItem>
                <SelectItem value="indisponivel">Indisponíveis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleExportCSV}
              variant="outline"
              disabled={!filteredEstoque.length || loading}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
            
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Item
            </Button>
          </div>
        </div>
      </div>

      <DataTableEstoque
        data={filteredEstoque}
        loading={loading}
        onUpdate={refresh}
      />

      <ModalNovoItem
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleItemCreated}
      />
    </div>
  );
}