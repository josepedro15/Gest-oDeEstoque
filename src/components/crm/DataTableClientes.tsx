import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useClientesWhatsapp, ClienteWhatsapp } from "@/hooks/useClientesWhatsapp";
import { Loader2, Trash2, MessageSquare, Phone, Calendar, ChevronDown, ChevronUp, Edit, User, Clock, AlertCircle } from "lucide-react";

interface DataTableClientesProps {
  data: ClienteWhatsapp[];
  loading: boolean;
  onUpdate: () => void;
}

export const DataTableClientes = ({ data, loading, onUpdate }: DataTableClientesProps) => {
  const [deletingRows, setDeletingRows] = useState<Set<string>>(new Set());
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
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

  const toggleExpanded = (clienteId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(clienteId)) {
        newSet.delete(clienteId);
      } else {
        newSet.add(clienteId);
      }
      return newSet;
    });
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
    // Se for um ID do WhatsApp (contém @s.whatsapp.net)
    if (phone.includes('@s.whatsapp.net')) {
      const number = phone.replace('@s.whatsapp.net', '');
      const cleaned = number.replace(/\D/g, '');
      if (cleaned.length === 13) {
        return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
      } else if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
      }
      return number;
    }
    
    // Formatar telefone brasileiro normal
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
    <div className="space-y-4">
      {data.length > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>{data.length} cliente{data.length !== 1 ? 's' : ''} encontrado{data.length !== 1 ? 's' : ''}</span>
          
          <div className="flex items-center gap-2">
            {expandedCards.size > 0 && (
              <span>{expandedCards.size} expandido{expandedCards.size !== 1 ? 's' : ''}</span>
            )}
            
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedCards(new Set(data.map(c => c.id)))}
                className="h-7 px-2 text-xs"
              >
                Expandir Todos
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedCards(new Set())}
                className="h-7 px-2 text-xs"
              >
                Colapsar Todos
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {data.map((cliente) => {
        const isDeleting = deletingRows.has(cliente.id);
        const isExpanded = expandedCards.has(cliente.id);

        return (
          <Card key={cliente.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">
                      {cliente.nome || (
                        <span className="text-muted-foreground italic">Sem nome</span>
                      )}
                    </CardTitle>
                  </div>
                  {getStatusBadge(cliente.status)}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(cliente.id)}
                    className="flex items-center gap-1"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    {isExpanded ? "Menos" : "Mais"}
                  </Button>
                  
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
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{formatPhone(cliente.telefone)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(cliente.data_ultimo_contato)}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {cliente.resumo_conversa && (
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Resumo da Conversa:</p>
                        <p className="text-sm line-clamp-2">
                          {cliente.resumo_conversa}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {isExpanded && (
                <div className="mt-4 pt-4 border-t space-y-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Criado em:</p>
                          <p className="text-sm">{formatDate(cliente.created_at)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Atualizado em:</p>
                          <p className="text-sm">{formatDate(cliente.updated_at)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {cliente.observacoes && (
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-muted-foreground mb-1">Observações:</p>
                            <p className="text-sm">{cliente.observacoes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {cliente.resumo_conversa && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Resumo Completo da Conversa:</p>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">{cliente.resumo_conversa}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Edit className="h-3 w-3" />
                      Editar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};