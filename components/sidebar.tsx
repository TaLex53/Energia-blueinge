"use client"

import React from "react"
import { Factory, Calculator, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface SidebarProps {
  activeModule: "dashboard" | "calculadora"
  setActiveModule: (module: "dashboard" | "calculadora") => void
  isCollapsed: boolean
}

export function Sidebar({ activeModule, setActiveModule, isCollapsed }: SidebarProps) {
  const { logout } = useAuth()

  const modules = [
    {
      id: "dashboard" as const,
      name: "Plantas de Proceso",
      description: "Monitoreo y KPIs Térmicos",
      icon: Factory,
    },
    {
      id: "calculadora" as const,
      name: "Optimización Térmica",
      description: "Calderas, Hornos y $/kWh",
      icon: Calculator,
    },
  ]

  return (
    <aside
      className={`shrink-0 flex flex-col justify-between border-r border-border/50 bg-card/40 backdrop-blur-md py-3 text-foreground transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20 px-2" : "w-64 px-3"
      }`}
    >
      <div className="space-y-1.5">
        {!isCollapsed && (
          <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground animate-in fade-in duration-200">
            Módulos Industriales
          </p>
        )}

        {modules.map((item) => {
          const Icon = item.icon
          const isActive = activeModule === item.id

          if (isCollapsed) {
            // YouTube mini sidebar item style: Icon on top, tiny label underneath
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                title={item.name}
                className={`group flex flex-col items-center justify-center w-full rounded-xl py-3.5 px-1 gap-1.5 transition-all duration-200 ${
                  isActive
                    ? "bg-primary/15 text-foreground font-semibold shadow-sm border border-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5 text-white shrink-0" />
                <span className="text-[10px] tracking-tight leading-none text-center truncate w-full">
                  {item.id === "dashboard" ? "Plantas" : "Simulador"}
                </span>
              </button>
            )
          }

          // Expanded sidebar item style
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`group flex items-center w-full rounded-xl py-3 px-3.5 gap-3.5 transition-all duration-200 ${
                isActive
                  ? "bg-primary/15 text-foreground font-semibold shadow-sm border border-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5 text-white shrink-0" />
              <div className="overflow-hidden text-left animate-in fade-in duration-200">
                <div className="text-sm leading-tight whitespace-nowrap">{item.name}</div>
                <div className="text-[11px] text-muted-foreground leading-tight whitespace-nowrap">{item.description}</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Logout button at bottom */}
      <div className="mt-auto border-t border-border/50 pt-3">
        {isCollapsed ? (
          <button
            onClick={logout}
            title="Cerrar sesión"
            className="flex flex-col items-center justify-center w-full py-3 gap-1 text-muted-foreground hover:text-destructive rounded-xl hover:bg-destructive/10 transition"
          >
            <LogOut className="h-5 w-5 text-white shrink-0" />
            <span className="text-[10px] leading-none">Salir</span>
          </button>
        ) : (
          <button
            onClick={logout}
            className="flex items-center justify-between w-full rounded-xl bg-muted/40 px-3 py-2.5 text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive border border-border/40 transition"
          >
            <span>Cerrar Sesión</span>
            <LogOut className="h-4 w-4 text-white" />
          </button>
        )}
      </div>
    </aside>
  )
}
