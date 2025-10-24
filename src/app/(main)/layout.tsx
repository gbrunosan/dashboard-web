import { SideBar } from "@/components/SideBar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col bg-backgroundSecondary md:flex-row h-screen">
      {/* Menu lateral no desktop. Exibido como um header no mobile */}
      <SideBar />

      {/* pb-[60px] mobile para barra de navegador em baixo */}
      <main className="overflow-y-auto w-full p-2 md:p-4 pb-[60px]">
        {/* O conteúdo das paginas em (main) entram aqui */}
        <div className="drop-shadow-xl bg-background rounded-sm">{children}</div>
      </main>
    </div>
  );
}
