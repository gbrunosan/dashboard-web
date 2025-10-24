"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

interface StackedBarChartProps {
  data: Array<{
    titulo_tipo: string;
    ativos: number;
    inativos: number;
    total: number;
  }>;
  height?: string;
  showLegend?: boolean;
}

export default function StackedBarChart({
  data,
  height = "350px",
  showLegend = true,
}: StackedBarChartProps) {
  const chartConfig: ChartConfig = {
    ativos: {
      label: "Ativos",
      color: "hsl(var(--chart-active))",
    },
    inativos: {
      label: "Inativos",
      color: "hsl(var(--chart-inactive))",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="w-full" style={{ height }}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="titulo_tipo"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-xs"
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
        <ChartTooltip content={<ChartTooltipContent />} />

      {/* @ts-expect-error erro específico desse chart*/}
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}

        <Bar dataKey="ativos" stackId="a" fill="var(--color-ativos)" radius={[0, 0, 0, 0]} />

        <Bar dataKey="inativos" stackId="a" fill="var(--color-inativos)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
