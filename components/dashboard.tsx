"use client"

import { useFuelData } from "@/hooks/use-fuel-data"
import { Header } from "@/components/header"
import { StatsCard } from "@/components/stats-card"
import { EnergyCalculator } from "@/components/energy-calculator"
import { PriceChart } from "@/components/price-chart"
import { EfficiencyChart } from "@/components/efficiency-chart"
import { BudgetComparisonChart } from "@/components/budget-comparison-chart"
import { EnterpriseCalculator } from "@/components/enterprise-calculator"
import { YearComparisonTable } from "@/components/year-comparison-table"
import { RegionMap } from "@/components/region-map"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { FUEL_ENERGY } from "@/lib/types"

export function Dashboard() {
  const { stations, yearlyAverages, currentPrices, isLoading, error } = useFuelData()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando datos de combustibles...</p>
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto space-y-6 px-4 py-8">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Estaciones Analizadas"
            value={stations.length.toLocaleString("es-CL")}
            subtitle="En todo Chile"
            icon="fuel"
          />
          <StatsCard
            title="Precio Prom. Gasolina 93"
            value={avgGas93 > 0 ? `$${Math.round(avgGas93).toLocaleString("es-CL")}` : "-"}
            trend={yoyChange > 0 ? "up" : yoyChange < 0 ? "down" : "neutral"}
            trendValue={`${yoyChange > 0 ? "+" : ""}${yoyChange.toFixed(1)}% vs año anterior`}
            icon="dollar"
          />
          <StatsCard
            title="Precio Prom. Diesel"
            value={avgDiesel > 0 ? `$${Math.round(avgDiesel).toLocaleString("es-CL")}` : "-"}
            subtitle="Por litro"
            icon="dollar"
          />
          <StatsCard
            title="Mejor Eficiencia"
            value={bestEfficiency ? `$${Math.round(bestEfficiency.costPerKwh)}/kWh` : "-"}
            subtitle={bestEfficiency ? bestEfficiency.fuel.toUpperCase() : ""}
            icon="zap"
          />
        </div>

        {/* Energy Calculator */}
        <EnergyCalculator yearlyAverages={yearlyAverages} currentPrices={currentPrices} />

        {/* Tabs for different views */}
        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="trends">Tendencias</TabsTrigger>
            <TabsTrigger value="efficiency">Eficiencia</TabsTrigger>
            <TabsTrigger value="budget">Presupuesto</TabsTrigger>
            <TabsTrigger value="enterprise">Empresas (Demanda)</TabsTrigger>
            <TabsTrigger value="comparison">Comparativa</TabsTrigger>
            <TabsTrigger value="regions">Por Región</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            <PriceChart data={yearlyAverages} selectedFuels={["gasolina93", "gasolina95", "diesel"]} />
          </TabsContent>

          <TabsContent value="efficiency" className="space-y-4">
            <EfficiencyChart currentPrices={currentPrices} />
          </TabsContent>

          <TabsContent value="budget" className="space-y-4">
            <BudgetComparisonChart currentPrices={currentPrices} />
          </TabsContent>

          <TabsContent value="enterprise" className="space-y-4">
            <EnterpriseCalculator currentPrices={currentPrices} />
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <YearComparisonTable data={yearlyAverages} />
          </TabsContent>

          <TabsContent value="regions" className="space-y-4">
            <RegionMap stations={stations} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground">
        <p>Datos de combustibles Chile - Análisis de costos y eficiencia energética</p>
        <p className="mt-1">Fuentes: Servicentros y precios históricos GLP</p>
      </footer>
    </div>
  )
}
