"use client"

import { Fuel } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary p-2">
            <Fuel className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Análisis de Combustibles</h1>
            <p className="text-xs text-muted-foreground">Dashboard de costos y eficiencia energética - Chile</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
          <span className="rounded-full bg-primary/20 px-2 py-1 text-primary">Datos actualizados 2025</span>
        </div>
      </div>
    </header>
  )
}
