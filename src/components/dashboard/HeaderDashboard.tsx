interface CabecalhoDashboardProps {
  titulo: string;
  periodo: {
    de: string;
    ate: string;
  };
  granularidade: string;
}

export default function CabecalhoDashboard({
  titulo,
  periodo,
  granularidade,
}: CabecalhoDashboardProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl md:text-3xl font-bold text-primary">{titulo}</h1>
      <div className="flex flex-col md:flex-row gap-x-3 text-muted-foreground">
        <div>
          <span className="font-semibold">Período:</span>
          <span> {periodo.de} até</span>
          <span> {periodo.ate}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Granularidade:</span>
          <span className="capitalize">{granularidade}</span>
        </div>
      </div>
    </div>
  );
}
