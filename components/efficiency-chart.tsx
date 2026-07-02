"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Zap } from "lucide-react"
import { FUEL_ENERGY } from "@/lib/types"
import type { FuelKey } from "@/lib/types"

interface EfficiencyChartProps {
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

export function EfficiencyChart({ currentPrices }: EfficiencyChartProps) {
  const chartData = useMemo(() => {
    const fuels: FuelKey[] = ["gasolina93", "gasolina95", "gasolina97", "diesel", "glp", "gnc", "kerosene"]
    
    return fuels
      .filter(fuel => currentPrices[fuel] !== null && currentPrices[fuel]! > 0)
      .map((fuel, index) => {
        const price = currentPrices[fuel]!
        const energy = FUEL_ENERGY[fuel]
        const costPerKwh = price / energy
        
        return {
          fuel: fuelLabels[fuel],
          costPerKwh: Math.round(costPerKwh),
          kwhPerPeso: (1000 / costPerKwh).toFixed(2),
          color: colors[index % colors.length],
        }
      })
      .sort((a, b) => a.costPerKwh - b.costPerKwh)
  }, [currentPrices])

  const minCost = chartData.length > 0 ? chartData[0] : null

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary/10 p-2">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Eficiencia Energética por Costo</CardTitle>
            <CardDescription>
              Comparación de costo por kWh entre combustibles
              {minCost && (
                <span className="ml-2 text-primary">
                  (Más eficiente: {minCost.fuel})
                </span>
              )}
            </CardDescription>
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
                stroke="#ffffff"
                tick={{ fill: "#ffffff", fontSize: 12, fontWeight: 600 }}
                tickLine={{ stroke: "#ffffff" }}
                axisLine={{ stroke: "rgba(255, 255, 255, 0.4)" }}
                tickFormatter={(value) => `$${value}`}
              />
              <YAxis 
                type="category"
                dataKey="fuel"
                stroke="#ffffff"
                tick={{ fill: "#ffffff", fontSize: 12, fontWeight: 600 }}
                tickLine={{ stroke: "#ffffff" }}
                axisLine={{ stroke: "rgba(255, 255, 255, 0.4)" }}
                width={85}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--card)", 
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "var(--muted-foreground)" }}
                formatter={(value: any) => [`$${Number(value).toLocaleString("es-CL")} por kWh`, "Costo"]}
                labelStyle={{ color: "var(--foreground)", fontWeight: "bold" }}
              />
              <Bar dataKey="costPerKwh" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Menor costo por kWh = Mayor eficiencia económica
        </div>
      </CardContent>
    </Card>
  )
}
