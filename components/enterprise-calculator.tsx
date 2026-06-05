"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Factory, TrendingDown } from "lucide-react"
import { FUEL_ENERGY } from "@/lib/types"
import type { FuelKey } from "@/lib/types"

interface EnterpriseCalculatorProps {
  currentPrices: Record<FuelKey, number | null>
}

const fuelLabels: Record<FuelKey, string> = {
  gasolina93: "Gasolina 93",
  gasolina95: "Gasolina 95",
  gasolina97: "Gasolina 97",
  diesel: "Diesel",
  glp: "GLP Vehicular",
  gnc: "GNC",
  kerosene: "Kerosene",
  solar: "Solar Fotovoltaica",
  eolica: "Energía Eólica",
  maritima: "Energía Marítima",
  red_electrica: "Red Eléctrica",
}

const colors = {
  solar: "#fde047", // Yellow
  eolica: "#7dd3fc", // Sky blue
  maritima: "#3b82f6", // Blue
  red_electrica: "#94a3b8", // Slate
}

const defaultColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

export function EnterpriseCalculator({ currentPrices }: EnterpriseCalculatorProps) {
  const [demand, setDemand] = useState<number>(20000)

  const chartData = useMemo(() => {
    const allFuels: FuelKey[] = [
      "solar", "eolica", "maritima", "red_electrica", 
      "glp", "gnc", "diesel", "gasolina93", "kerosene"
    ]
    
    let colorIndex = 0;

    return allFuels
      .filter(fuel => currentPrices[fuel] !== null && currentPrices[fuel]! > 0)
      .map(fuel => {
        const price = currentPrices[fuel]!
        const energyPerUnit = FUEL_ENERGY[fuel]
        
        const costPerKwh = price / energyPerUnit
        const totalCost = costPerKwh * demand

        let color = defaultColors[colorIndex % defaultColors.length]
        if (fuel === "solar") color = colors.solar
        else if (fuel === "eolica") color = colors.eolica
        else if (fuel === "maritima") color = colors.maritima
        else if (fuel === "red_electrica") color = colors.red_electrica
        else colorIndex++ 

        return {
          fuel: fuelLabels[fuel],
          id: fuel,
          costPerKwh: costPerKwh,
          totalCost: Math.round(totalCost),
          color,
        }
      })
      .sort((a, b) => a.totalCost - b.totalCost)
  }, [currentPrices, demand])

  const bestOption = chartData.length > 0 ? chartData[0] : null
  const redElectrica = chartData.find(d => d.id === "red_electrica")

  const savings = bestOption && redElectrica && bestOption.id !== "red_electrica"
    ? redElectrica.totalCost - bestOption.totalCost
    : 0

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-primary/10 p-2">
              <Factory className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Calculadora Empresarial (Demanda)</CardTitle>
              <CardDescription>
                Analiza el costo de suplir tu demanda energética mensual
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Demanda Mensual (kWh)</label>
            <input
              type="number"
              value={demand}
              onChange={(e) => setDemand(Number(e.target.value))}
              className="flex h-9 w-32 rounded-md border border-input bg-secondary/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              min={100}
              step={1000}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {bestOption && (
          <div className="grid gap-4 rounded-lg bg-secondary/30 p-4 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Opción Más Rentable</p>
              <p className="mt-1 text-xl font-bold text-foreground">
                {bestOption.fuel}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Costo Mensual Estimado</p>
              <p className="mt-1 text-xl font-bold text-foreground">
                ${bestOption.totalCost.toLocaleString("es-CL")}
              </p>
            </div>
            {savings > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Ahorro vs Red Eléctrica</p>
                <div className="flex items-center gap-1 mt-1 text-green-500 dark:text-green-400">
                  <TrendingDown className="h-5 w-5" />
                  <p className="text-xl font-bold">
                    ${savings.toLocaleString("es-CL")}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="h-[400px] w-full min-h-[400px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={400}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} horizontal={true} vertical={false} />
              <XAxis 
                type="number"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M` : `$${value.toLocaleString()}`}
              />
              <YAxis 
                type="category"
                dataKey="fuel"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                width={120}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--card)", 
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "var(--muted-foreground)" }}
                formatter={(value: any, name: any, props: any) => [
                  `$${Number(value).toLocaleString("es-CL")}`, 
                  `Costo Total ($${Math.round(props.payload.costPerKwh)}/kWh)`
                ]}
                labelStyle={{ color: "var(--foreground)", fontWeight: "bold" }}
              />
              <Bar dataKey="totalCost" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
