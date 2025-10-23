import { Cell, Label, Pie, PieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

interface CustomPieChartProps {
  data: Array<Record<string, any>>;
  total: number;
  totalLabel?: string;
  colors?: string[];
  innerRadius?: number;
  strokeWidth?: number;
  nameKey?: string;
  valueKey?: string;
  maxHeight?: string;
}

export default function CustomPieChart({
  data,
  total,
  totalLabel = "Total",
  colors = ["hsl(var(--chart-active))", "hsl(var(--chart-inactive))"],
  innerRadius = 60,
  strokeWidth = 5,
  nameKey = "status",
  valueKey = "quantidade",
  maxHeight = "500px",
}: CustomPieChartProps) {
  const chartConfig = {
    quantidade: {
      label: "Quantidade",
    },
  };

  return (
    <div>
      <ChartContainer config={chartConfig} className="w-full" style={{ maxHeight }}>
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie
            dataKey={valueKey}
            nameKey={nameKey}
            data={data}
            innerRadius={innerRadius}
            strokeWidth={strokeWidth}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
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
                        {total.toLocaleString("pt-BR")}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        {totalLabel}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
