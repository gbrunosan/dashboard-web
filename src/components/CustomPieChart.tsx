import { Cell, Label, Pie, PieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";

interface CustomPieChartProps {
  data: Array<{
    status: string;
    quantidade: number;
  }>;
  total: number;
  totalLabel?: string;
  colors?: string[];
  innerRadius?: number;
  strokeWidth?: number;
}

export default function CustomPieChart({ 
  data,
  total,
  totalLabel = "Total",
  colors = [
    "hsl(var(--success))",
    "hsl(var(--grayScale-400))",
  ],
  innerRadius = 60,
  strokeWidth = 5,
}: CustomPieChartProps) {
  const chartConfig = {
    quantidade: {
      label: "Quantidade",
    },
  }

  return (
    <div>
      <ChartContainer
        config={chartConfig}
        className="max-h-[500px] w-full"
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie
            dataKey="quantidade"
            nameKey="status"
            data={data}
            innerRadius={innerRadius}
            strokeWidth={strokeWidth}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
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
                        {total.toLocaleString('pt-BR')}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        {totalLabel}
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
  )
}