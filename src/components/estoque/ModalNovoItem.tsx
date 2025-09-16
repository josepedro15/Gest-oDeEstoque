import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useEstoque } from "@/hooks/useEstoque";
import { Loader2 } from "lucide-react";

interface ModalNovoItemProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  nome: string;
  quantidade: number;
  disponivel: boolean;
  preco: number;
}

interface FormErrors {
  nome?: string;
  quantidade?: string;
  preco?: string;
}

export const ModalNovoItem = ({ isOpen, onClose, onSuccess }: ModalNovoItemProps) => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    quantidade: 0,
    disponivel: true,
    preco: 0
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { createItem } = useEstoque();
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = "Nome deve ter pelo menos 2 caracteres";
    }

    if (formData.quantidade < 0) {
      newErrors.quantidade = "Quantidade deve ser maior ou igual a zero";
    }

    if (formData.preco < 0) {
      newErrors.preco = "Preço deve ser maior ou igual a zero";
    } else if (formData.preco > 999999.99) {
      newErrors.preco = "Preço não pode ser maior que R$ 999.999,99";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await createItem(formData);

      if (result.success) {
        onSuccess();
        resetForm();
      } else {
        toast({
          title: "Erro ao criar item",
          description: result.error || "Erro desconhecido",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      quantidade: 0,
      disponivel: true,
      preco: 0
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Nome do produto"
              className={errors.nome ? "border-destructive" : ""}
            />
            {errors.nome && (
              <p className="text-sm text-destructive">{errors.nome}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantidade">Quantidade</Label>
            <Input
              id="quantidade"
              type="number"
              min="0"
              value={formData.quantidade}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                quantidade: parseInt(e.target.value) || 0 
              }))}
              className={errors.quantidade ? "border-destructive" : ""}
            />
            {errors.quantidade && (
              <p className="text-sm text-destructive">{errors.quantidade}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="disponivel"
              checked={formData.disponivel}
              onCheckedChange={(checked) => setFormData(prev => ({ 
                ...prev, 
                disponivel: checked 
              }))}
            />
            <Label htmlFor="disponivel">Disponível</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preco">Preço (R$)</Label>
            <Input
              id="preco"
              type="number"
              min="0"
              step="0.01"
              value={formData.preco}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                preco: parseFloat(e.target.value) || 0 
              }))}
              placeholder="0,00"
              className={errors.preco ? "border-destructive" : ""}
            />
            {errors.preco && (
              <p className="text-sm text-destructive">{errors.preco}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Item"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};