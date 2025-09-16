import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { EstoqueItem, useEstoque } from "@/hooks/useEstoque";
import { Loader2, Save } from "lucide-react";

interface DataTableEstoqueProps {
  data: EstoqueItem[];
  loading: boolean;
  onUpdate: () => void;
}

interface EditingRow {
  id: string;
  quantidade: number;
  disponivel: boolean;
  preco: number;
}

export const DataTableEstoque = ({ data, loading, onUpdate }: DataTableEstoqueProps) => {
  const [editingRows, setEditingRows] = useState<Record<string, EditingRow>>({});
  const [savingRows, setSavingRows] = useState<Set<string>>(new Set());
  const { updateItem } = useEstoque();
  const { toast } = useToast();

  const handleFieldChange = (id: string, field: keyof EditingRow, value: number | boolean) => {
    setEditingRows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const initializeEdit = (item: EstoqueItem) => {
    if (!editingRows[item.id]) {
      setEditingRows(prev => ({
        ...prev,
        [item.id]: {
          id: item.id,
          quantidade: item.quantidade,
          disponivel: item.disponivel,
          preco: item.preco
        }
      }));
    }
  };

  const handleSave = async (item: EstoqueItem) => {
    const editData = editingRows[item.id];
    if (!editData) return;

    if (editData.quantidade < 0) {
      toast({
        title: "Erro de validação",
        description: "Quantidade deve ser maior ou igual a zero.",
        variant: "destructive"
      });
      return;
    }

    if (editData.preco < 0) {
      toast({
        title: "Erro de validação",
        description: "Preço deve ser maior ou igual a zero.",
        variant: "destructive"
      });
      return;
    }

    setSavingRows(prev => new Set(prev).add(item.id));

    try {
      const result = await updateItem(item.id, {
        quantidade: editData.quantidade,
        disponivel: editData.disponivel,
        preco: editData.preco
      });

      if (result.success) {
        toast({
          title: "Item atualizado",
          description: "Alterações salvas com sucesso."
        });
        onUpdate();
      } else {
        toast({
          title: "Erro ao salvar",
          description: result.error || "Erro desconhecido",
          variant: "destructive"
        });
      }
    } finally {
      setSavingRows(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando estoque...</span>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <p>Nenhum item encontrado no estoque.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Nome</TableHead>
            <TableHead className="w-[150px]">Marca</TableHead>
            <TableHead className="w-[120px]">Quantidade</TableHead>
            <TableHead className="w-[120px]">Disponível</TableHead>
            <TableHead className="w-[150px]">Preço (R$)</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const editData = editingRows[item.id];
            const isEditing = !!editData;
            const isSaving = savingRows.has(item.id);

            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.nome}</TableCell>
                <TableCell className="text-muted-foreground">{item.marca || '-'}</TableCell>
                
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    value={isEditing ? editData.quantidade : item.quantidade}
                    onChange={(e) => {
                      if (!isEditing) initializeEdit(item);
                      handleFieldChange(item.id, 'quantidade', parseInt(e.target.value) || 0);
                    }}
                    className={`w-20 ${isEditing ? 'border-blue-500 bg-blue-50' : ''}`}
                    placeholder="0"
                  />
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={isEditing ? editData.disponivel : item.disponivel}
                      onCheckedChange={(checked) => {
                        if (!isEditing) initializeEdit(item);
                        handleFieldChange(item.id, 'disponivel', checked);
                      }}
                    />
                    <Badge variant={item.disponivel ? "default" : "destructive"}>
                      {item.disponivel ? "Sim" : "Não"}
                    </Badge>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={isEditing ? editData.preco : item.preco}
                    onChange={(e) => {
                      if (!isEditing) initializeEdit(item);
                      handleFieldChange(item.id, 'preco', parseFloat(e.target.value) || 0);
                    }}
                    className={`w-28 ${isEditing ? 'border-blue-500 bg-blue-50' : ''}`}
                    placeholder="0.00"
                  />
                </TableCell>
                
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => handleSave(item)}
                    disabled={isSaving}
                    className="flex items-center gap-1"
                  >
                    {isSaving ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Save className="h-3 w-3" />
                    )}
                    Salvar
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};