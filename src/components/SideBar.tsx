"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings, LogOut, Menu, X, Tag, Contact } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Usuários",
    href: "/usuarios",
    icon: Users,
  },
  {
    title: "Contatos",
    href: "/contatos",
    icon: Contact,
  },
  {
    title: "Tipos",
    href: "/tipos",
    icon: Tag,
  },
  {
    title: "Configurações",
    href: "/configuracoes",
    icon: Settings,
  },
];

export function SideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleLogout = async () => {
    await authService.logout();
    router.push("/login");
  };

  const MenuContent = () => (
    <div className="flex flex-col h-full min-w-[250px]">
      {/* Logo + Theme Toggle */}
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Painel <span className="text-primary">Admin</span>
        </h2>
        <ThemeToggle />
      </div>

      {/* Itens do menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Botão de logout */}
      <div className="px-4 py-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Menu mobile */}
      <div className="md:hidden h-14 bg-white border-b sticky top-0 z-[50] flex items-center justify-between px-3">
        <h2 className="text-2xl font-bold">
          Painel <span className="text-primary">Admin</span>
        </h2>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="text-foreground">
                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-[85%] max-w-[400px]">
              <MenuContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <aside className="hidden md:flex h-screen max-w-[300px] bg-card border-r">
        <MenuContent />
      </aside>
    </>
  );
}
