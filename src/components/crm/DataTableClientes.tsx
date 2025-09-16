import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useClientesWhatsapp, ClienteWhatsapp } from "@/hooks/useClientesWhatsapp";
import { Loader2, Trash2, MessageSquare, Phone, Calendar } from "lucide-react";

interface DataTableClientesProps {
  data: ClienteWhatsapp[];
  loading: boolean;
  onUpdate: () => void;
}

export const DataTableClientes = ({ data, loading, onUpdate }: DataTableClientesProps) => {
  const [deletingRows, setDeletingRows] = useState<Set<string>>(new Set());
  const { deleteCliente } = useClientesWhatsapp();
  const { toast } = useToast();

  const handleDelete = async (cliente: ClienteWhatsapp) => {
    setDeletingRows(prev => new Set(prev).add(cliente.id));

    try {
      const result = await deleteCliente(cliente.id);

      if (result.success) {
        toast({
          title: "Cliente excluído",
          description: `${cliente.nome || cliente.telefone} foi removido do CRM.`
        });
        onUpdate();
      } else {
        toast({
          title: "Erro ao excluir",
          description: result.error || "Erro desconhecido",
          variant: "destructive"
        });
      }
    } finally {
      setDeletingRows(prev => {
        const newSet = new Set(prev);
        newSet.delete(cliente.id);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge variant="default" className="bg-green-500">Ativo</Badge>;
      case 'inativo':
        return <Badge variant="secondary">Inativo</Badge>;
      case 'bloqueado':
        return <Badge variant="destructive">Bloqueado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatPhone = (phone: string) => {
    // Formatar telefone brasileiro
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 13) {
      return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
    } else if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando clientes...</span>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p>Nenhum cliente encontrado.</p>
        <p className="text-sm">Tente ajustar os filtros ou adicionar um novo cliente.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Nome</TableHead>
            <TableHead className="w-[150px]">Telefone</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[200px]">Último Contato</TableHead>
            <TableHead className="w-[300px]">Resumo da Conversa</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((cliente) => {
            const isDeleting = deletingRows.has(cliente.id);

            return (
              <TableRow key={cliente.id}>
                <TableCell className="font-medium">
                  {cliente.nome || (
                    <span className="text-muted-foreground italic">Sem nome</span>
                  )}
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{formatPhone(cliente.telefone)}</span>
                  </div>
                </TableCell>
                
                <TableCell>
                  {getStatusBadge(cliente.status)}
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(cliente.data_ultimo_contato)}</span>
                  </div>
                </TableCell>
                
                <TableCell>
                  {cliente.resumo_conversa ? (
                    <div className="max-w-[300px]">
                      <p className="text-sm line-clamp-2">
                        {cliente.resumo_conversa}
                      </p>
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic text-sm">Sem resumo</span>
                  )}
                </TableCell>
                
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isDeleting}
                        className="flex items-center gap-1"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir <strong>{cliente.nome || cliente.telefone}</strong>?
                          <br />
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(cliente)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
