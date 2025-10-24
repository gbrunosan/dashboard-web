"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, User, Mail, Lock, Eye } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { userService, type Usuario } from "@/services/userService";
import { TableTabs, type TabConfig } from "@/components/TableTabs";
import { RegisterModal, FormField } from "@/components/RegisterModal";

export default function Usuarios() {
  const [usuariosAtivos, setUsuariosAtivos] = useState<Usuario[]>([]);
  const [usuariosInativos, setUsuariosInativos] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  const carregarUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      const [ativos, inativos] = await Promise.all([
        userService.getUsuariosAtivos(),
        userService.getUsuariosInativos(),
      ]);
      setUsuariosAtivos(ativos);
      setUsuariosInativos(inativos);
    } catch (error) {
      toast({
        title: "Erro ao carregar usuários",
        description: error instanceof Error ? error.message : "Ocorreu um erro",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  const handleToggleStatus = async (usuario: Usuario) => {
    try {
      const novoStatus = !usuario.status;
      await userService.updateStatus(usuario.id, novoStatus);

      toast({
        title: novoStatus ? "Usuário ativado" : "Usuário desativado",
        description: `${usuario.nome} foi ${novoStatus ? "ativado" : "desativado"} com sucesso.`,
      });

      carregarUsuarios();
    } catch (error) {
      toast({
        title: "Erro ao alterar status",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const usuarioFields: FormField[] = [
    {
      name: "nome",
      label: "Nome",
      type: "text",
      placeholder: "João Silva",
      icon: User,
      validation: {
        required: true,
      },
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "joao@exemplo.com",
      icon: Mail,
      validation: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Email inválido",
      },
    },
    {
      name: "senha",
      label: "Senha",
      type: "password",
      placeholder: "********",
      icon: Lock,
      actionIcon: Eye,
      validation: {
        required: true,
        minLength: 6,
      },
    },
  ];

  const handleCreateUsuario = async (data: Record<string, string>) => {
    await userService.createUsuario({
      nome: data.nome,
      email: data.email,
      senha: data.senha,
    });
  };

  const tabsConfig: TabConfig<Usuario>[] = [
    {
      value: "ativos",
      label: "Ativos",
      data: usuariosAtivos,
      statusAccessor: "status",
      emptyMessage: "Nenhum usuário ativo encontrado",
      columns: [
        { header: "ID", accessor: "id" },
        { header: "Nome", accessor: "nome", className: "font-medium" },
        { header: "Email", accessor: "email", hideOnMobile: true },
      ],
      onToggleStatus: handleToggleStatus,
    },
    {
      value: "inativos",
      label: "Inativos",
      data: usuariosInativos,
      statusAccessor: "status",
      emptyMessage: "Nenhum usuário inativo encontrado",
      columns: [
        { header: "ID", accessor: "id" },
        { header: "Nome", accessor: "nome", className: "font-medium" },
        { header: "Email", accessor: "email", hideOnMobile: true },
      ],
      onToggleStatus: handleToggleStatus,
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Gerenciamento de usuários</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie usuários ativos e inativos do sistema
          </p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Novo usuário
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="p-4 pb-2.5">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de usuários
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold">
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : (
                usuariosAtivos.length + usuariosInativos.length
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <TableTabs
        tabs={tabsConfig}
        loading={loading}
        defaultTab="ativos"
        itemsPerPage={10}
        enablePagination={true}
      />

      <RegisterModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Novo usuário"
        description="Preencha os dados para criar um novo usuário no sistema."
        fields={usuarioFields}
        onSubmit={handleCreateUsuario}
        onSuccess={carregarUsuarios}
        submitLabel="Criar usuário"
      />
    </div>
  );
}
