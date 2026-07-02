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
  kerosene: "#f472b6",
  eolica: "#38bdf8",
  solar: "#facc15",
  maritima: "#818cf8",
  diesel: "#a78bfa",
  glp: "#4ade80",
}

const fuelLabels: Record<string, string> = {
  gasolina93: "Gasolina 93",
  gasolina95: "Gasolina 95",
  gasolina97: "Gasolina 97",
  kerosene: "Parafina",
  eolica: "Energía Eólica",
  solar: "Energía Solar",
  maritima: "Energía Marítima",
  diesel: "Diesel",
  glp: "GLP",
}

export function PriceChart({ data, selectedFuels = ["gasolina93", "gasolina95", "gasolina97", "kerosene", "eolica", "solar", "maritima"] }: PriceChartProps) {
  const chartData = useMemo(() => {
    return data
      .filter(d => d.year >= 2000 && d.year <= new Date().getFullYear())
      .sort((a, b) => a.year - b.year)
      .map(d => ({
        year: d.year,
        gasolina93: d.gasolina93 && d.gasolina93 > 0 ? Math.round(d.gasolina93) : null,
        gasolina95: d.gasolina95 && d.gasolina95 > 0 ? Math.round(d.gasolina95) : null,
        gasolina97: d.gasolina97 && d.gasolina97 > 0 ? Math.round(d.gasolina97) : null,
        kerosene: d.kerosene && d.kerosene > 0 ? Math.round(d.kerosene) : null,
        eolica: d.eolica && d.eolica > 0 ? Math.round(d.eolica) : null,
        solar: d.solar && d.solar > 0 ? Math.round(d.solar) : null,
        maritima: d.maritima && d.maritima > 0 ? Math.round(d.maritima) : null,
        diesel: d.diesel && d.diesel > 0 ? Math.round(d.diesel) : null,
        glp: d.glp && d.glp > 0 ? Math.round(d.glp) : null,
      }))
  }, [data])

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-teal-500/15 p-2 text-teal-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Evolución Térmica y Costos Industriales (2000 - {new Date().getFullYear()})</CardTitle>
            <CardDescription>Tendencia histórica de precios por combustible en puntos de suministro de Chile</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[420px] w-full min-h-[420px] pt-4">
          <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={400}>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 15, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="year" 
                stroke="#ffffff"
                tick={{ fill: "#ffffff", fontSize: 12, fontWeight: 600 }}
                tickLine={{ stroke: "#ffffff" }}
                axisLine={{ stroke: "rgba(255, 255, 255, 0.4)" }}
                padding={{ left: 15, right: 15 }}
                angle={-35}
                textAnchor="end"
                height={50}
              />
              <YAxis 
                width={75}
                stroke="#ffffff"
                tick={{ fill: "#ffffff", fontSize: 12, fontWeight: 600 }}
                tickLine={{ stroke: "#ffffff" }}
                axisLine={{ stroke: "rgba(255, 255, 255, 0.4)" }}
                tickFormatter={(value) => `$${Number(value).toLocaleString("es-CL")}`}
                domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.15)]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "10px",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.3)",
                  color: "hsl(var(--foreground))",
                  fontSize: "12px"
                }}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold", marginBottom: "4px" }}
                formatter={(value: any) => [`$${Number(value).toLocaleString("es-CL")}`, "Precio"]}
                labelFormatter={(label) => `Año ${label}`}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "15px", fontSize: "12px" }}
                formatter={(value) => <span style={{ color: "hsl(var(--foreground))", fontWeight: 500 }}>{fuelLabels[value] || value}</span>}
              />
              {selectedFuels.map((fuel) => (
                <Line
                  key={fuel}
                  type="monotone"
                  dataKey={fuel}
                  name={fuel}
                  stroke={fuelColors[fuel]}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: fuelColors[fuel], strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
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
