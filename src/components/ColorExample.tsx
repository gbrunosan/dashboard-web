export default function ColorExample() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold text-foreground">
        Exemplo de Cores do shadcn/ui
      </h1>

      {/* Backgrounds */}
      <div className="space-y-2">
        <div className="bg-primary text-primary-foreground p-4 rounded-lg">
          bg-primary - Cor principal
        </div>
        <div className="bg-secondary text-secondary-foreground p-4 rounded-lg">
          bg-secondary - Cor secundária
        </div>
        <div className="bg-accent text-accent-foreground p-4 rounded-lg">
          bg-accent - Cor de destaque
        </div>
        <div className="bg-muted text-muted-foreground p-4 rounded-lg">
          bg-muted - Cor suave
        </div>
        <div className="bg-destructive text-destructive-foreground p-4 rounded-lg">
          bg-destructive - Cor de perigo
        </div>
      </div>

      {/* Cards */}
      <div className="bg-card text-card-foreground p-6 rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-2">Card</h2>
        <p className="text-muted-foreground">
          Este é um exemplo de card usando bg-card e border-border
        </p>
      </div>

      {/* Inputs */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Input com border-input"
          className="w-full p-2 rounded-md border border-input bg-background"
        />
        <input
          type="text"
          placeholder="Input com foco (ring-ring)"
          className="w-full p-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
        />
      </div>
    </div>
  );
}
