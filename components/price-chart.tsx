"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { TrendingUp } from "lucide-react"
import type { YearlyAverage } from "@/lib/types"

interface PriceChartProps {
  data: YearlyAverage[]
  selectedFuels?: string[]
}

const fuelColors: Record<string, string> = {
  gasolina93: "#2dd4bf",
  gasolina95: "#60a5fa",
  gasolina97: "#f97316",
  diesel: "#a78bfa",
  glp: "#4ade80",
}

const fuelLabels: Record<string, string> = {
  gasolina93: "Gasolina 93",
  gasolina95: "Gasolina 95",
  gasolina97: "Gasolina 97",
  diesel: "Diesel",
  glp: "GLP",
}

export function PriceChart({ data, selectedFuels = ["gasolina93", "gasolina95", "diesel"] }: PriceChartProps) {
  const chartData = useMemo(() => {
    return data
      .filter(d => d.year >= 2000)
      .sort((a, b) => a.year - b.year)
      .map(d => ({
        year: d.year,
        gasolina93: d.gasolina93,
        gasolina95: d.gasolina95,
        gasolina97: d.gasolina97,
        diesel: d.diesel,
        glp: d.glp,
      }))
  }, [data])

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary/10 p-2">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Evolución de Precios por Año</CardTitle>
            <CardDescription>Tendencia histórica de precios de combustibles en Chile</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full min-h-[400px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={400}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="year" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `$${value.toLocaleString("es-CL")}`}
                domain={['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                }}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
                formatter={(value: any) => [`$${Number(value).toLocaleString("es-CL")}`, "Precio"]}
                labelFormatter={(label) => `Año ${label}`}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "20px" }}
                formatter={(value) => <span style={{ color: "hsl(var(--foreground))" }}>{fuelLabels[value] || value}</span>}
              />
              {selectedFuels.map((fuel) => (
                <Line
                  key={fuel}
                  type="monotone"
                  dataKey={fuel}
                  name={fuel}
                  stroke={fuelColors[fuel]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
