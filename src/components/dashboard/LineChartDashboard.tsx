"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

interface LineChartDashboardProps {
  series: Array<{
    chave: string;
    rotulo: string;
    pontos: Array<{
      mes: string;
      valor: number;
      novos?: number;
      delta?: number | null;
    }>;
  }>;
  title?: string;
  description?: string;
  height?: string;
  showLegend?: boolean;
}

export default function LineChartDashboard({
  series,
  title,
  description,
  height = "400px",
  showLegend = true,
}: LineChartDashboardProps) {
  const chartData = React.useMemo(() => {
    if (!series || series.length === 0 || !series[0].pontos) return [];

    return series[0].pontos.map((ponto, index) => {
      const dataPoint: any = {
        mes: formatMonthLabel(ponto.mes),
        mesCompleto: ponto.mes,
      };

      // Adiciona cada série como uma chave
      series.forEach((serie) => {
        if (serie.pontos[index]) {
          dataPoint[serie.chave] = serie.pontos[index].valor;

          // Adiciona novos e delta se existirem
          if (serie.pontos[index].novos !== undefined) {
            dataPoint.novos = serie.pontos[index].novos;
          }
          if (serie.pontos[index].delta !== undefined && serie.pontos[index].delta !== null) {
            dataPoint.delta = serie.pontos[index].delta;
          }
        }
      });

      return dataPoint;
    });
  }, [series]);

  // Configuração dinâmica baseada nas séries
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {};

    series.forEach((serie, index) => {
      config[serie.chave] = {
        label: serie.rotulo,
        color: getColorForSeries(serie.chave, index),
      };
    });

    return config;
  }, [series]);

  return (
    <div>
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}

      <ChartContainer config={chartConfig} className="w-full" style={{ height }}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="mes"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            className="text-xs"
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) => {
                  const item = chartData.find((d) => d.mes === value);
                  return item?.mesCompleto ? formatMonthFull(item.mesCompleto) : value;
                }}
              />
            }
          />
          {showLegend && <ChartLegend content={<ChartLegendContent />} />}

          {series.map((serie) => (
            <Line
              key={serie.chave}
              type="monotone"
              dataKey={serie.chave}
              stroke={`var(--color-${serie.chave})`}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  );
}

// Abreviar o mês no gráfico
function formatMonthLabel(mes: string): string {
  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  const [, month] = mes.split("-");
  return meses[parseInt(month) - 1];
}

// Tooltipo com mês completo
function formatMonthFull(mes: string): string {
  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const [ano, month] = mes.split("-");
  return `${meses[parseInt(month) - 1]} ${ano}`;
}

// Helper para cores dinâmicas
function getColorForSeries(chave: string, index: number): string {
  const colorMap: Record<string, string> = {
    total: "hsl(var(--chart-total))",
    ativos: "hsl(var(--chart-active))",
    inativos: "hsl(var(--chart-inactive))",
  };

  return colorMap[chave] || `hsl(var(--chart-${(index % 5) + 1}))`;
}
