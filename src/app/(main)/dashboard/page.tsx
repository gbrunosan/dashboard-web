"use client";

import { formatDateBR, formatDateTimeBR } from "@/lib/utils";
import HeaderDashboard from "@/components/dashboard/HeaderDashboard";
import PieChartDashboard from "@/components/dashboard/PieChartDashboard";
import CardDashboard from "@/components/dashboard/CardDashboard";
import LineChartDashboard from "@/components/dashboard/LineChartDashboard";
import StackedBarDashboard from "@/components/dashboard/StackedBarDashboard";
import HorizontalBarDashboard from "@/components/dashboard/HorizontalBarDashboard";
import { useEffect, useState } from "react";
import { dashboardService } from "@/services/dashboardService";
import { LoaderCircle } from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const dashboardData = await dashboardService.getDashboardData();
        setData(dashboardData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground flex flex-col items-center">
          <LoaderCircle className="animate-spin" /> Carregando dashboard
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">{error || "Dados não encontrados"}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-2.5 md:p-4 gap-3 ">
      <HeaderDashboard
        titulo={data.relatorio.titulo}
        periodo={{
          de: formatDateBR(data.relatorio.periodo.de),
          ate: formatDateBR(data.relatorio.periodo.ate),
        }}
        granularidade={data.relatorio.periodo.granularidade}
      />

      {/* Contatos */}
      <div className="space-y-2 border p-3 rounded-md">
        {/* Cards de total */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CardDashboard
            title="Total de contatos"
            value={data.totais.contatos.total}
            delta={{
              value: data.totais.contatos.delta_vs_periodo_anterior.percentual,
              isPercentage: true,
            }}
            subtitle={`${data.totais.contatos.delta_vs_periodo_anterior.absoluto} vs período anterior`}
          />

          <CardDashboard
            title="Contatos ativos"
            value={data.totais.contatos.ativos}
            subtitle={`${((data.totais.contatos.ativos / data.totais.contatos.total) * 100).toFixed(1)}% do total`}
          />

          <CardDashboard
            title="Novos no período"
            value={data.totais.contatos.novos_no_periodo}
            subtitle="Cadastros realizados"
          />
        </div>

        {/*Contatos por status e barras empilhadas (Tipos vs Status) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="bg-card rounded-lg border p-2.5 md:p-6 flex-1">
            <h2 className="text-xl font-semibold text-foreground mb-4">Contatos por Status</h2>
            <PieChartDashboard
              data={data.quebras.contatos_por_status}
              total={data.totais.contatos.total}
              totalLabel="Contatos"
              innerRadius={50}
              strokeWidth={8}
              maxHeight="250px"
            />
          </div>

          <div className="bg-card rounded-lg border p-2.5 md:p-6 flex-1">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Distribuição por tipo de contatos
            </h3>
            <StackedBarDashboard
              data={data.quebras.contatos_por_tipo}
              height="300px"
              showLegend={true}
            />
          </div>
        </div>

        {/* Evolução mensal com linhas */}
        <div className="bg-card rounded-lg border p-2.5 md:p-6 flex-1">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Evolução mensal de contatos
          </h2>
          <LineChartDashboard
            series={[
              ...data.series_temporais.series, // Total, Ativos, Inativos
              {
                chave: "novos",
                rotulo: "Novos no Mês",
                pontos: data.series_temporais.series[0].pontos.map((p) => ({
                  mes: p.mes,
                  valor: p.novos || 0,
                })),
              },
            ]}
            description={data.series_temporais.observacoes}
            height="250px"
            showLegend={true}
          />
        </div>
      </div>

      {/* Tipos de contato*/}
      <div className="space-y-2 border p-3 rounded-md">
        {/* Cards de total */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CardDashboard title="Total de tipos de contato" value={data.totais.tipos.total} />

          <CardDashboard
            title="Tipos ativos"
            value={data.totais.tipos.ativos}
            subtitle={`${((data.totais.tipos.ativos / data.totais.tipos.total) * 100).toFixed(1)}% do total`}
          />

          <CardDashboard title="Tipos inativos" value={data.totais.tipos.inativos} />
        </div>

        {/* tipo por status em pizza e ranking de crescimento em barras  */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex-1 w-full bg-card rounded-lg border p-2.5 md:p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Tipos de contatos por status
            </h2>
            <PieChartDashboard
              data={data.quebras.tipos_por_status}
              total={data.totais.tipos.total}
              totalLabel="Tipos"
              innerRadius={50}
              strokeWidth={8}
              maxHeight="250px"
            />
          </div>

          <div className="bg-card rounded-lg border p-2.5 md:p-6 flex-1">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Ranking de crescimento por período
            </h3>
            <HorizontalBarDashboard data={data.top.tipos_por_crescimento} height="250px" />
          </div>
        </div>
      </div>

      <span className="text-end text-muted-foreground">
        Gerado em: {formatDateTimeBR(data.relatorio.gerado_em)}
      </span>
    </div>
  );
}
