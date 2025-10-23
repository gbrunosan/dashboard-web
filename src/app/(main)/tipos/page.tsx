"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tipoService, type Tipo } from "@/services/userTypeService";
import { TableTabs, type TabConfig } from "@/components/TableTabs";
import { RegisterModal } from "@/components/RegisterModal";

export default function Tipos() {
  const [tiposAtivos, setTiposAtivos] = useState<Tipo[]>([]);
  const [tiposInativos, setTiposInativos] = useState<Tipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    carregarTipos();
  }, []);

  const carregarTipos = async () => {
    try {
      setLoading(true);
      const [ativos, inativos] = await Promise.all([
        tipoService.getTiposAtivos(),
        tipoService.getTiposInativos(),
      ]);
      setTiposAtivos(ativos);
      setTiposInativos(inativos);
    } catch (error) {
      toast({
        title: "Erro ao carregar tipos",
        description: error instanceof Error ? error.message : "Ocorreu um erro",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (tipo: Tipo) => {
    try {
      const novoStatus = !tipo.status;
      await tipoService.updateStatus(tipo.id, novoStatus);

      toast({
        title: novoStatus ? "Tipo ativado" : "Tipo desativado",
        description: `${tipo.descricao} foi ${novoStatus ? "ativado" : "desativado"} com sucesso.`,
      });

      carregarTipos();
    } catch (error) {
      toast({
        title: "Erro ao alterar status",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const tabsConfig: TabConfig<Tipo>[] = [
    {
      value: "ativos",
      label: "Ativos",
      data: tiposAtivos,
      statusAccessor: "status",
      emptyMessage: "Nenhum tipo ativo encontrado",
      columns: [
        {
          header: "ID",
          accessor: "id",
        },
        {
          header: "Descrição",
          accessor: "descricao",
          className: "font-medium",
        },
      ],
      onToggleStatus: handleToggleStatus,
    },
    {
      value: "inativos",
      label: "Inativos",
      data: tiposInativos,
      statusAccessor: "status",
      emptyMessage: "Nenhum tipo inativo encontrado",
      columns: [
        {
          header: "ID",
          accessor: "id",
        },
        {
          header: "Descrição",
          accessor: "descricao",
          className: "font-medium",
        },
      ],
      onToggleStatus: handleToggleStatus,
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Gerenciamento de tipos</h1>
          <p className="text-muted-foreground mt-1">Gerencie tipos ativos e inativos do sistema</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Novo tipo
        </Button>
      </div>

      {/* Espaço para cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de tipos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : (
                tiposAtivos.length + tiposInativos.length
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela com tipos de contato */}
      <TableTabs
        tabs={tabsConfig}
        loading={loading}
        defaultTab="ativos"
        itemsPerPage={10}
        enablePagination={true}
      />

      {/* Modal de cadastro de novos tipos */}
      <RegisterModal open={modalOpen} onOpenChange={setModalOpen} onSuccess={carregarTipos} />
    </div>
  );
}
