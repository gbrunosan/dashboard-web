"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface HorizontalBarChartProps {
  data: Array<{
    titulo_tipo: string;
    crescimento_no_periodo: number;
  }>;
  height?: string;
  colors?: string[];
}

export default function HorizontalBarChart({
  data,
  height = "300px",
  colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"],
}: HorizontalBarChartProps) {
  const chartConfig: ChartConfig = {
    crescimento_no_periodo: {
      label: "Crescimento",
      color: "hsl(var(--chart-total))",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="w-full" style={{ height }}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />

        <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />

        <YAxis
          dataKey="titulo_tipo"
          type="category"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-xs"
          width={90}
        />

        <ChartTooltip
          content={<ChartTooltipContent formatter={(value) => [`${value} novos contatos`]} />}
        />

        <Bar dataKey="crescimento_no_periodo" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
