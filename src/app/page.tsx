"use client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Cell, Pie, PieChart } from "recharts";
import chartData from "../../chartData.json";
export default function Shadcn() {
    const COLORS = [
      "hsl(var(--success))",
      "hsl(var(--grayScale-400))",
    ]

    const chartConfig = {
    quantidade: {
      label: "Quantidade",
    },
    ativo: {
      label: "Ativo",
      color: "primary",
    },
    inativo: {
      label: "Inativo",
      color: "grayScale-400",
    },
  }

  return (
    <div className="flex gap-2">
      <ChartContainer
        config={chartConfig} className="max-h-[500px] w-full"
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie
            dataKey="quantidade"
            nameKey="status"
            data={chartData.quebras.contatos_por_status}
          >
            {chartData.quebras.contatos_por_status.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
