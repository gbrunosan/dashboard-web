"use client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Cell, Label, Pie, PieChart } from "recharts";
import chartData from "../../chartData.json";
import { formatDateBR } from "@/lib/utils";
import CabecalhoRelatorio from "@/components/CabecalhoRelatorio";
import CustomPieChart from "@/components/CustomPieChart";

export default function Dashboard() {
  const data = chartData

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
    <div className="flex flex-col p-4">
      <CabecalhoRelatorio 
        titulo={data.relatorio.titulo}
        periodo={{de: data.relatorio.periodo.de, ate: data.relatorio.periodo.ate}} 
        granularidade={data.relatorio.periodo.granularidade}
      />

      {/* Gráfico */}
      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Contatos por Status
        </h2>
        <ChartContainer
          config={chartConfig}
          className="max-h-[500px] w-full"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              dataKey="quantidade"
              nameKey="status"
              data={chartData.quebras.contatos_por_status}
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.quebras.contatos_por_status.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {chartData.totais.contatos.total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Contatos
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>

      {/* <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Tipos de Contato
        </h2>
        <CustomPieChart
          classname="h-[500px]"
          data={data.quebras.contatos_por_tipo}
          total={data.totais.tipos.total}
          totalLabel="Tipos"
          colors={[
            "hsl(var(--primary))",
            "hsl(var(--chart-1))",
            "hsl(var(--chart-2))",
          ]}
          innerRadius={70}
          strokeWidth={8}
        />
      </div> */}
    </div>
  );
}