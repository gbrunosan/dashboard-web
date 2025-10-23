import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CardDashboardProps {
  title: string;
  value: number;
  subtitle?: string;
  delta?: {
    value: number;
    isPercentage?: boolean;
  };
  icon?: React.ReactNode;
}

export default function CardDashboard({ 
  title, 
  value, 
  subtitle, 
  delta,
  icon 
}: CardDashboardProps) {
  const isPositive = delta && delta.value > 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      
      <CardContent>
        <div className="text-3xl font-bold">
          {value.toLocaleString('pt-BR')}
        </div>
        
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
        
        {delta && (
          <div className={`flex items-center gap-1 text-sm font-medium mt-2 ${
            isPositive ? 'text-success' : 'text-destructive'
          }`}>
            <span>{isPositive ? '↑' : '↓'}</span>
            <span>
              {Math.abs(delta.value).toLocaleString('pt-BR')}
              {delta.isPercentage ? '%' : ''}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}