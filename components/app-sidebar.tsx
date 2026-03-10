"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, History, Tag, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { LottieIcon } from "./icons/lottie-icon"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/productos", label: "Productos", icon: Package },
  { href: "/historial", label: "Historial de Stock", icon: History },
  { href: "/categorias", label: "Categorias", icon: Tag },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-64 flex-col bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border min-h-screen">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-second">
          <LottieIcon src="/MagicBox.json" className="w-12 h-12" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-sidebar-primary-foreground"style={{color: "black"}}>Inventario</h1>
          <p className="text-xs text-sidebar-foreground/60 text-black" style={{color: "black"}}>Panel Admin</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-black"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="px-6 py-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/50">v1.0.0</p>
      </div>
    </aside>
  )
}
