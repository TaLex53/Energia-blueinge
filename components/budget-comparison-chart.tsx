"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Wallet } from "lucide-react"
import { FUEL_ENERGY } from "@/lib/types"
import type { FuelKey } from "@/lib/types"

interface BudgetComparisonChartProps {
  currentPrices: Record<FuelKey, number | null>
}

const fuelLabels: Record<FuelKey, string> = {
  gasolina93: "Gas 93",
  gasolina95: "Gas 95",
  gasolina97: "Gas 97",
  diesel: "Diesel",
  glp: "GLP",
  gnc: "GNC",
  kerosene: "Kerosene",
  solar: "Solar",
  eolica: "Eólica",
  maritima: "Marítima",
  red_electrica: "Red Eléctrica",
}

const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
  "var(--chart-2)",
]

export function BudgetComparisonChart({ currentPrices }: BudgetComparisonChartProps) {
  const [budget, setBudget] = useState<number>(10000)

  const chartData = useMemo(() => {
    const fuels: FuelKey[] = ["gasolina93", "gasolina95", "gasolina97", "diesel", "glp", "gnc", "kerosene"]
    
    return fuels
      .filter(fuel => currentPrices[fuel] !== null && currentPrices[fuel]! > 0)
      .map((fuel, index) => {
        const price = currentPrices[fuel]!
        const energyPerUnit = FUEL_ENERGY[fuel]
        const quantity = budget / price
        const totalEnergy = quantity * energyPerUnit
        
        return {
          fuel: fuelLabels[fuel],
          totalEnergy: Math.round(totalEnergy * 10) / 10, // 1 decimal place
          color: colors[index % colors.length],
        }
      })
      .sort((a, b) => b.totalEnergy - a.totalEnergy) // Mayor a menor energía
  }, [currentPrices, budget])

  const maxEnergy = chartData.length > 0 ? chartData[0] : null

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-primary/10 p-2">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Rendimiento por Presupuesto</CardTitle>
              <CardDescription>
                Energía (kWh) obtenida
                {maxEnergy && (
                  <span className="ml-1 text-primary">
                    (Mejor opción: {maxEnergy.fuel})
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Mi Presupuesto ($)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="flex h-9 w-28 rounded-md border border-input bg-secondary/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              min={1000}
              step={1000}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} horizontal={true} vertical={false} />
              <XAxis 
                type="number"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <YAxis 
                type="category"
                dataKey="fuel"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                width={60}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--card)", 
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "var(--muted-foreground)" }}
                formatter={(value: any) => [`${value} kWh`, "Energía Obtenida"]}
                labelStyle={{ color: "var(--foreground)", fontWeight: "bold" }}
              />
              <Bar dataKey="totalEnergy" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Mayor energía (kWh) = Obtienes más energía por la misma cantidad de dinero
        </div>
      </CardContent>
    </Card>
  )
}
