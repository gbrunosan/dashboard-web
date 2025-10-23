"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/useToast";
import { userService } from "@/services/userService";
import { Loader2, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { InputIcon } from "./InputIcon";

interface NovoUsuarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function RegisterModal({ open, onOpenChange, onSuccess }: NovoUsuarioModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [visiblePassword, setVisiblePassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    const newErrors: Record<string, string> = {};
    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório";
    if (!formData.email.includes("@")) newErrors.email = "Email inválido";
    if (!formData.senha.trim()) newErrors.senha = "Senha é obrigatória";
    if (formData.senha.length < 6) newErrors.senha = "Senha deve ter no mínimo 6 caracteres";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await userService.createUsuario(formData);

      toast({
        title: "Usuário criado com sucesso!",
        description: `${formData.nome} foi adicionado ao sistema.`,
      });

      // Limpa o formulário
      setFormData({ nome: "", email: "", senha: "" });
      setErrors({});

      // Fecha o modal
      onOpenChange(false);

      // Atualiza a lista
      onSuccess();
    } catch (error: any) {
      // Tratamento de erros da API
      if (error.detail && Array.isArray(error.detail)) {
        const apiErrors: Record<string, string> = {};
        error.detail.forEach((err: any) => {
          const field = err.loc[1]; // "nome", "email", "senha"
          apiErrors[field] = err.msg;
        });
        setErrors(apiErrors);
      } else {
        toast({
          title: "Erro ao criar usuário",
          description: error.message || "Ocorreu um erro desconhecido",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpa o erro do campo quando usuário começa a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar um novo usuário no sistema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-2">
            {/* Nome */}
            <div className="grid gap-2">
              <InputIcon
                label="Nome *"
                id="nome"
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                icon={User}
                iconPosition="left"
                placeholder="João Silva"
                disabled={loading}
              />
              {errors.nome && <p className="text-sm text-destructive">{errors.nome}</p>}
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <InputIcon
                label="Email *"
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                icon={Mail}
                iconPosition="left"
                placeholder="joao@exemplo.com"
                disabled={loading}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            {/* Senha */}
            <div className="grid gap-2">
              <InputIcon
                label="Senha *"
                id="senha"
                type={visiblePassword ? "string" : "password"}
                value={formData.senha}
                icon={Lock}
                iconPosition="left"
                actionIcon={visiblePassword ? Eye : EyeOff}
                onActionClick={() => setVisiblePassword(!visiblePassword)}
                onChange={(e) => handleChange("senha", e.target.value)}
                placeholder="********"
                disabled={loading}
              />
              {errors.senha && <p className="text-sm text-destructive">{errors.senha}</p>}
            </div>
          </div>

          <DialogFooter className="gap-y-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
                "Criar usuário"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
