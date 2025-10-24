"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, LogOut, Menu, X, Tag, Contact, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "@radix-ui/react-dialog";

interface MenuItem {
  title: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Cadastros",
    icon: FilePlus,
    children: [
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
        title: "Tipos de contato",
        href: "/tipos",
        icon: Tag,
      },
    ],
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

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const MenuContent = () => (
    <div className="flex flex-col h-full min-w-[250px]">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Painel <span className="text-primary">Admin</span>
        </h2>
        <div className="hidden md:block">
          <ThemeToggle />
        </div>
      </div>

      {/* Itens do menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.children) {
            return (
              <div key={item.title} className="space-y-1">
                <div className="flex items-center gap-3 px-4 py-2 font-semibold text-">
                  {Icon && <Icon className="w-5 h-5" />}
                  <span>{item.title}</span>
                </div>
                <div className="pl-8 space-y-1">
                  {item.children.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href!}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded transition-colors text-sm",
                          "hover:bg-accent hover:text-accent-foreground",
                          isSubActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                      >
                        {SubIcon && <SubIcon className="w-4 h-4" />}
                        <span>{sub.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {Icon && <Icon className="w-5 h-5" />}
              <span className="font-medium truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="md:hidden w-full flex justify-center mb-2">
        <ThemeToggle />
      </div>
      {/* Botão de logout */}
      <div className="px-4 py-4 border-t">
        <div>
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
    </div>
  );

  return (
    <>
      {/* Menu mobile */}
      <div className="md:hidden py-2.5  bg-background drop-shadow-md  border-b border-input sticky top-0 z-[50] flex items-center gap-3 px-3">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="text-foreground">
                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[85%] max-w-[400px]">
              <VisuallyHidden>
                <DialogTitle>Painel Admin</DialogTitle>
              </VisuallyHidden>
              <MenuContent />
            </SheetContent>
          </Sheet>
        </div>
        <h2 className="text-2xl font-bold">
          Painel <span className="text-primary">Admin</span>
        </h2>
      </div>

      <aside className="hidden md:flex h-screen max-w-[300px] bg-card border-r">
        <MenuContent />
      </aside>
    </>
  );
}
