interface CabecalhoRelatorioProps {
  titulo: string;
  periodo: {
    de: string;
    ate: string;
  };
  granularidade: string;
}

export default function CabecalhoRelatorio({ 
  titulo, 
  periodo, 
  granularidade 
}: CabecalhoRelatorioProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-bold text-foreground">
        {titulo}
      </h1>
      <div className="flex gap-3 text-muted-foreground">
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