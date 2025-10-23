"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { authService } from "@/services/authService"
import { useRouter } from "next/navigation"

interface MenuItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Contatos",
    href: "/contatos",
    icon: Users,
  },
  {
    title: "Configurações",
    href: "/configuracoes",
    icon: Settings,
  },
]

export function MenuLateral() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  const handleLogout = async () => {
    await authService.logout()
    router.push('/login')
  }

  const MenuContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-2xl font-bold">
          Painel <span className="text-primary">Admin</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Gestão empresarial
        </p>
      </div>

      {/* Itens do menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

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
              <span className="font-medium">{item.title}</span>
            </Link>
          )
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
  )

  return (
    <>
      {/* Menu mobile */}
      <div className="lg:hidden h-12 bg-grayScale-50 sticky top-0 z-[50] flex items-center justify-end px-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <div className="w-full justify-between flex">
                <h2 className="text-2xl font-bold">
                    Painel <span className="text-primary">Admin</span>
                </h2>
                <button className="text-grayScale-800">
                    {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 w-[85%] max-w-[400px]">
            <MenuContent />
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[280px] bg-card border-r">
        <MenuContent />
      </aside>
    </>
  )
}