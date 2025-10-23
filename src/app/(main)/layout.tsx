import { MenuLateral } from "@/components/MenuLateral";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col bg-grayScale-200 md:flex-row h-screen">
      <MenuLateral />
      
      {/* Main Content */}
      <main className="overflow-y-auto w-full p-1.5 md:p-3.5">
        <div className="drop-shadow-xl bg-grayScale-50 rounded-sm">
          {children}
        </div>
      </main>
    </div>
  );
}