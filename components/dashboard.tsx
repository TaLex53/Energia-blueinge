"use client"

import { useState } from "react"
import { useFuelData } from "@/hooks/use-fuel-data"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { StatsCard } from "@/components/stats-card"
import { EnergyCalculator } from "@/components/energy-calculator"
import { PriceChart } from "@/components/price-chart"
import { EfficiencyChart } from "@/components/efficiency-chart"
import { BudgetComparisonChart } from "@/components/budget-comparison-chart"
import { EnterpriseCalculator } from "@/components/enterprise-calculator"
import { YearComparisonTable } from "@/components/year-comparison-table"
import { RegionMap } from "@/components/region-map"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Calculator } from "lucide-react"
import { FUEL_ENERGY } from "@/lib/types"

export function Dashboard() {
  const { stations, yearlyAverages, currentPrices, isLoading, error } = useFuelData()
  const [activeModule, setActiveModule] = useState<"dashboard" | "calculadora">("dashboard")
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando datos de CalEnergy IA...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive">Error al cargar datos: {error}</p>
        </div>
      </div>
    )
  }

  // Calculate stats
  const stationsWithGas93 = stations.filter(s => s.gasolina93 && s.gasolina93 > 0)
  const avgGas93 = stationsWithGas93.length > 0
    ? stationsWithGas93.reduce((acc, s) => acc + (s.gasolina93 || 0), 0) / stationsWithGas93.length
    : 0

  const stationsWithDiesel = stations.filter(s => s.diesel && s.diesel > 0)
  const avgDiesel = stationsWithDiesel.length > 0
    ? stationsWithDiesel.reduce((acc, s) => acc + (s.diesel || 0), 0) / stationsWithDiesel.length
    : 0

  // Best efficiency calculation
  const efficiencies = Object.entries(currentPrices)
    .filter(([_, price]) => price !== null && price > 0)
    .map(([fuel, price]) => ({
      fuel,
      costPerKwh: price! / FUEL_ENERGY[fuel as keyof typeof FUEL_ENERGY],
    }))
    .sort((a, b) => a.costPerKwh - b.costPerKwh)

  const bestEfficiency = efficiencies[0]

  // Year over year change
  const sortedYears = [...yearlyAverages].sort((a, b) => b.year - a.year)
  const latestYear = sortedYears[0]
  const previousYear = sortedYears[1]
  const yoyChange = latestYear && previousYear && latestYear.gasolina93 && previousYear.gasolina93
    ? ((latestYear.gasolina93 - previousYear.gasolina93) / previousYear.gasolina93) * 100
    : 0

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top sticky header spanning full width with toggle button & brand on left */}
      <Header
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isCollapsed={isCollapsed}
      />

      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar directly beneath top header */}
        <Sidebar
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          isCollapsed={isCollapsed}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col min-w-0 overflow-y-auto">
          <main className="flex-1 container mx-auto space-y-6 px-4 py-8">
            {activeModule === "dashboard" ? (
              <div className="space-y-6 animate-in fade-in-50 duration-300">
                {/* Stats Overview */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <StatsCard
                    title="Puntos de Suministro Industrial"
                    value={stations.length.toLocaleString("es-CL")}
                    subtitle="Monitoreo en Red Nacional"
                    icon="fuel"
                  />
                  <StatsCard
                    title="Costo Base Combustión (Gas 93)"
                    value={avgGas93 > 0 ? `$${Math.round(avgGas93).toLocaleString("es-CL")}` : "-"}
                    trend={yoyChange > 0 ? "up" : yoyChange < 0 ? "down" : "neutral"}
                    trendValue={`${yoyChange > 0 ? "+" : ""}${yoyChange.toFixed(1)}% vs año anterior`}
                    icon="dollar"
                  />
                  <StatsCard
                    title="Costo Térmico Diesel / Calderas"
                    value={avgDiesel > 0 ? `$${Math.round(avgDiesel).toLocaleString("es-CL")}` : "-"}
                    subtitle="Promedio por litro industrial"
                    icon="dollar"
                  />
                  <StatsCard
                    title="Mejor Eficiencia en Procesos"
                    value={bestEfficiency ? `$${Math.round(bestEfficiency.costPerKwh)}/kWh` : "-"}
                    subtitle={bestEfficiency ? `Óptimo térmico: ${bestEfficiency.fuel.toUpperCase()}` : ""}
                    icon="zap"
                  />
                </div>

                {/* Tabs for different views */}
                <Tabs defaultValue="trends" className="space-y-4">
                  <TabsList className="bg-secondary/50 flex flex-wrap h-auto gap-1 p-1">
                    <TabsTrigger value="trends">Evolución Térmica</TabsTrigger>
                    <TabsTrigger value="efficiency">Rendimiento ($/kWh)</TabsTrigger>
                    <TabsTrigger value="budget">Costos Operacionales</TabsTrigger>
                    <TabsTrigger value="comparison">Matriz Anual</TabsTrigger>
                    <TabsTrigger value="regions">Suministro Regional</TabsTrigger>
                  </TabsList>

                  <TabsContent value="trends" className="space-y-4">
                    <PriceChart data={yearlyAverages} selectedFuels={["gasolina93", "gasolina95", "gasolina97", "kerosene", "eolica", "solar", "maritima"]} />
                  </TabsContent>

                  <TabsContent value="efficiency" className="space-y-4">
                    <EfficiencyChart currentPrices={currentPrices} />
                  </TabsContent>

                  <TabsContent value="budget" className="space-y-4">
                    <BudgetComparisonChart currentPrices={currentPrices} />
                  </TabsContent>

                  <TabsContent value="comparison" className="space-y-4">
                    <YearComparisonTable data={yearlyAverages} />
                  </TabsContent>

                  <TabsContent value="regions" className="space-y-4">
                    <RegionMap stations={stations} />
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in-50 duration-300">
                <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                  <div className="rounded-xl bg-gradient-to-tr from-teal-500 to-blue-600 p-2 text-white">
                    <Calculator className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Simulaciones Térmicas y Optimización de Plantas de Proceso</h2>
                    <p className="text-sm text-muted-foreground">Analiza costos por energía real útil (kWh térmico) y calcula ahorros en calderas, hornos y líneas de producción</p>
                  </div>
                </div>

                {/* Energy Calculator */}
                <EnergyCalculator yearlyAverages={yearlyAverages} currentPrices={currentPrices} />

                {/* Enterprise Calculator */}
                <EnterpriseCalculator currentPrices={currentPrices} />
              </div>
            )}
          </main>

          <footer className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground">
            <p>CalEnergy IA - Plataforma de Optimización y Eficiencia Energética para Plantas de Proceso</p>
            <p className="mt-1">© {new Date().getFullYear()} Todos los derechos reservados.</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
