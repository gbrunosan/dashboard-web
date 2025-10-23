"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, User, FileText } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contatoService, type Contato } from "@/services/contactService";
import { tipoService, type Tipo } from "@/services/userTypeService";
import { TableTabs, type TabConfig } from "@/components/TableTabs";
import { RegisterModal, FormField } from "@/components/RegisterModal";

export default function Contatos() {
  const [contatosAtivos, setContatosAtivos] = useState<Contato[]>([]);
  const [contatosInativos, setContatosInativos] = useState<Contato[]>([]);
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [ativos, inativos, tiposAtivos] = await Promise.all([
        contatoService.getContatosAtivos(),
        contatoService.getContatosInativos(),
        tipoService.getTiposAtivos(),
      ]);
      setContatosAtivos(ativos);
      setContatosInativos(inativos);
      setTipos(tiposAtivos);
    } catch (error) {
      toast({
        title: "Erro ao carregar contatos",
        description: error instanceof Error ? error.message : "Ocorreu um erro",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (contato: Contato) => {
    try {
      const novoStatus = !contato.status;
      await contatoService.updateStatus(contato.id, novoStatus);

      toast({
        title: novoStatus ? "Contato ativado" : "Contato desativado",
        description: `${contato.nome} foi ${novoStatus ? "ativado" : "desativado"} com sucesso.`,
      });

      carregarDados();
    } catch (error) {
      toast({
        title: "Erro ao alterar status",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const getTipoNome = (idtipo: number) => {
    return tipos.find((t) => t.id === idtipo)?.descricao || "N/A";
  };

  const contatoFields: FormField[] = [
    {
      name: "nome",
      label: "Nome",
      type: "text",
      placeholder: "Email Corporativo, Telefone Pessoal...",
      icon: User,
      validation: { required: true },
    },
    {
      name: "idtipo",
      label: "Tipo de contato",
      type: "select",
      placeholder: "Selecione o tipo",
      options: tipos.map((tipo) => ({
        value: tipo.id,
        label: tipo.descricao,
      })),
      validation: { required: true },
    },
    {
      name: "valor",
      label: "Contato",
      type: "text",
      placeholder: "joao@email.com ou (11) 99999-9999",
      icon: FileText,
      validation: { required: true },
    },
  ];

  const handleCreateContato = async (data: Record<string, any>) => {
    // OBSERVAÇÃO:
    // Imagino que o usuarioid é o id do usuário logada mas não encontrei essa propriedade nos endpoints
    // Por isso, estou usando idusuario = 1 como valor padrão para testes.
    const idusuario = 1;

    await contatoService.createContato({
      nome: data.nome,
      idtipo: Number(data.idtipo),
      idusuario: idusuario,
      valor: data.valor,
    });
  };

  const tabsConfig: TabConfig<Contato>[] = [
    {
      value: "ativos",
      label: "Ativos",
      data: contatosAtivos,
      statusAccessor: "status",
      emptyMessage: "Nenhum contato ativo encontrado",
      columns: [
        { header: "ID", accessor: "id" },
        { header: "Nome", accessor: "nome", className: "font-medium" },
        { header: "Tipo", accessor: (contato) => getTipoNome(contato.idtipo), hideOnMobile: true },
        { header: "Valor", accessor: "valor", hideOnMobile: true },
      ],
      onToggleStatus: handleToggleStatus,
    },
    {
      value: "inativos",
      label: "Inativos",
      data: contatosInativos,
      statusAccessor: "status",
      emptyMessage: "Nenhum contato inativo encontrado",
      columns: [
        { header: "ID", accessor: "id" },
        { header: "Nome", accessor: "nome", className: "font-medium" },
        { header: "Tipo", accessor: (contato) => getTipoNome(contato.idtipo), hideOnMobile: true },
        { header: "Valor", accessor: "valor", hideOnMobile: true },
      ],
      onToggleStatus: handleToggleStatus,
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Gerenciamento de contatos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie contatos ativos e inativos do sistema
          </p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Novo contato
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="p-4 pb-2.5">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de contatos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold">
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : (
                contatosAtivos.length + contatosInativos.length
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
        title="Novo contato"
        description="Preencha os dados para criar um novo contato no sistema."
        fields={contatoFields}
        onSubmit={handleCreateContato}
        onSuccess={carregarDados}
        submitLabel="Criar contato"
      />
    </div>
  );
}
