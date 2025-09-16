import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useClientesWhatsapp } from "@/hooks/useClientesWhatsapp";
import { Loader2 } from "lucide-react";

interface ModalNovoClienteProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  nome: string;
  telefone: string;
  resumo_conversa: string;
  status: 'ativo' | 'inativo' | 'bloqueado';
  observacoes: string;
}

interface FormErrors {
  nome?: string;
  telefone?: string;
  resumo_conversa?: string;
}

export const ModalNovoCliente = ({ isOpen, onClose, onSuccess }: ModalNovoClienteProps) => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    telefone: "",
    resumo_conversa: "",
    status: "ativo",
    observacoes: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { createCliente } = useClientesWhatsapp();
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.telefone.trim()) {
      newErrors.telefone = "Telefone é obrigatório";
    } else {
      // Aceitar formatos de telefone brasileiro ou IDs do WhatsApp
      const phoneRegex = /^(\+?55)?\s?\(?[1-9]{2}\)?\s?[0-9]{4,5}-?[0-9]{4}$/;
      const whatsappRegex = /^[0-9]{10,13}@s\.whatsapp\.net$/;
      const numberOnlyRegex = /^[0-9]{10,13}$/;
      
      if (!phoneRegex.test(formData.telefone.replace(/\D/g, '')) && 
          !whatsappRegex.test(formData.telefone) && 
          !numberOnlyRegex.test(formData.telefone.replace(/\D/g, ''))) {
        newErrors.telefone = "Formato de telefone inválido (aceita: (11) 99999-9999, +5511999999999, 553194959512@s.whatsapp.net)";
      }
    }

    if (formData.nome.trim() && formData.nome.trim().length < 2) {
      newErrors.nome = "Nome deve ter pelo menos 2 caracteres";
    }

    if (formData.resumo_conversa.trim() && formData.resumo_conversa.trim().length < 10) {
      newErrors.resumo_conversa = "Resumo deve ter pelo menos 10 caracteres";
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
      const result = await createCliente({
        ...formData,
        user_id: '33ed3ee2-95bf-4746-8862-2d5dfa029409',
        data_ultimo_contato: new Date().toISOString()
      });

      if (result.success) {
        onSuccess();
        resetForm();
      } else {
        toast({
          title: "Erro ao criar cliente",
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
      telefone: "",
      resumo_conversa: "",
      status: "ativo",
      observacoes: ""
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 7) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    } else if (cleaned.length <= 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else {
      return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, telefone: formatted }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Cliente WhatsApp</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Nome do cliente"
                className={errors.nome ? "border-destructive" : ""}
              />
              {errors.nome && (
                <p className="text-sm text-destructive">{errors.nome}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={handlePhoneChange}
                placeholder="(11) 99999-9999 ou 553194959512@s.whatsapp.net"
                className={errors.telefone ? "border-destructive" : ""}
              />
              {errors.telefone && (
                <p className="text-sm text-destructive">{errors.telefone}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: 'ativo' | 'inativo' | 'bloqueado') => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="bloqueado">Bloqueado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resumo_conversa">Resumo da Conversa</Label>
            <Textarea
              id="resumo_conversa"
              value={formData.resumo_conversa}
              onChange={(e) => setFormData(prev => ({ ...prev, resumo_conversa: e.target.value }))}
              placeholder="Descreva o que foi conversado com o cliente..."
              className={errors.resumo_conversa ? "border-destructive" : ""}
              rows={3}
            />
            {errors.resumo_conversa && (
              <p className="text-sm text-destructive">{errors.resumo_conversa}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              placeholder="Observações adicionais sobre o cliente..."
              rows={2}
            />
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
                "Criar Cliente"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
