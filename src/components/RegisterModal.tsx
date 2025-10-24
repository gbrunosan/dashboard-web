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
import { Loader2, LucideIcon } from "lucide-react";
import { InputIcon } from "./InputIcon";
import { FormSelect } from "./InputSelect";

export interface FormField {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "number" | "select";
  placeholder?: string;
  icon?: LucideIcon;
  actionIcon?: LucideIcon;
  options?: { value: string | number; label: string }[];
  validation?: {
    required?: boolean;
    minLength?: number;
    pattern?: RegExp;
    message?: string;
  };
}

interface DynamicFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onSuccess?: () => void;
  submitLabel?: string;
}

export function RegisterModal({
  open,
  onOpenChange,
  title,
  description,
  fields,
  onSubmit,
  onSuccess,
  submitLabel = "Salvar",
}: DynamicFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>(() =>
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fieldStates, setFieldStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = formData[field.name];
      const stringValue = typeof value === "string" ? value.trim() : String(value || "");

      if (field.validation?.required && !stringValue) {
        newErrors[field.name] = `${field.label} é obrigatório`;
        return;
      }

      if (field.validation?.minLength && stringValue.length < field.validation.minLength) {
        newErrors[field.name] =
          field.validation.message ||
          `${field.label} deve ter no mínimo ${field.validation.minLength} caracteres`;
        return;
      }

      if (field.validation?.pattern && !field.validation.pattern.test(stringValue)) {
        newErrors[field.name] = field.validation.message || `${field.label} inválido`;
        return;
      }

      if (field.type === "email" && stringValue && !stringValue.includes("@")) {
        newErrors[field.name] = "Email inválido";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      await onSubmit(formData);

      toast({
        title: "Sucesso!",
        description: "Operação realizada com sucesso.",
      });

      setFormData(fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {}));
      setErrors({});
      setFieldStates({});

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      if (error.detail && Array.isArray(error.detail)) {
        const apiErrors: Record<string, string> = {};
        error.detail.forEach((err: any) => {
          const field = err.loc[1];
          apiErrors[field] = err.msg;
        });
        setErrors(apiErrors);
      } else {
        toast({
          title: "Erro",
          description: error.message || "Ocorreu um erro desconhecido",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const toggleFieldState = (fieldName: string) => {
    setFieldStates((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            {fields.map((field) => {
              const Icon = field.icon;
              const ActionIcon = field.actionIcon;
              const isPasswordField = field.type === "password";
              const showPassword = fieldStates[field.name];

              if (field.type === "select") {
                return (
                  <FormSelect
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    value={formData[field.name]}
                    onChange={(value) => handleChange(field.name, value)}
                    options={field.options || []}
                    placeholder={field.placeholder}
                    required={field.validation?.required}
                    error={errors[field.name]}
                    disabled={loading}
                  />
                );
              }

              return (
                <div key={field.name} className="grid gap-2">
                  <InputIcon
                    label={field.label}
                    id={field.name}
                    type={
                      isPasswordField ? (showPassword ? "text" : "password") : field.type || "text"
                    }
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    icon={Icon}
                    required={field.validation?.required}
                    iconPosition="left"
                    actionIcon={ActionIcon}
                    onActionClick={isPasswordField ? () => toggleFieldState(field.name) : undefined}
                    placeholder={field.placeholder}
                    disabled={loading}
                  />
                  {errors[field.name] && (
                    <p className="text-sm text-destructive">{errors[field.name]}</p>
                  )}
                </div>
              );
            })}
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
                  Salvando...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
