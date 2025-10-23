import { MenuLateral } from "@/components/MenuLateral";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col bg-grayScale-200 md:flex-row min-h-screen">
      <MenuLateral />
      
      {/* Main Content */}
      <main className="flex-1 lg:ml-[280px]">
        {children}
      </main>
    </div>
  );
}