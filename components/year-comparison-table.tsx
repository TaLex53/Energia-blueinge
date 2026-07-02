"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table } from "lucide-react"
import type { YearlyAverage } from "@/lib/types"

interface YearComparisonTableProps {
  data: YearlyAverage[]
}

export function YearComparisonTable({ data }: YearComparisonTableProps) {
  const tableData = useMemo(() => {
    return data
      .filter(d => d.year >= 2015)
      .sort((a, b) => b.year - a.year)
      .slice(0, 10)
  }, [data])

  const formatPrice = (price: number | null) => {
    if (price === null || price === 0) return "-"
    return `$${price.toLocaleString("es-CL")}`
  }

  const getChangeClass = (current: number | null, previous: number | null) => {
    if (!current || !previous) return ""
    const change = ((current - previous) / previous) * 100
    if (change > 5) return "text-red-500"
    if (change < -5) return "text-green-500"
    return "text-muted-foreground"
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary/10 p-2">
            <Table className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Comparativa Anual de Precios</CardTitle>
            <CardDescription>Precios promedio por año (últimos 10 años disponibles)</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="px-3 py-3 text-left font-semibold text-foreground">Año</th>
                <th className="px-3 py-3 text-right font-semibold text-foreground">Gas 93</th>
                <th className="px-3 py-3 text-right font-semibold text-foreground">Gas 95</th>
                <th className="px-3 py-3 text-right font-semibold text-foreground">Gas 97</th>
                <th className="px-3 py-3 text-right font-semibold text-foreground">Parafina</th>
                <th className="px-3 py-3 text-right font-semibold text-foreground">Eólica</th>
                <th className="px-3 py-3 text-right font-semibold text-foreground">Solar</th>
                <th className="px-3 py-3 text-right font-semibold text-foreground">Marítima</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => {
                const prevRow = tableData[index + 1]
                return (
                  <tr key={row.year} className="border-b border-border/30 transition-colors hover:bg-secondary/30">
                    <td className="px-3 py-3 font-bold text-foreground">{row.year}</td>
                    <td className={`px-3 py-3 text-right font-medium ${getChangeClass(row.gasolina93, prevRow?.gasolina93)}`}>
                      {formatPrice(row.gasolina93)}
                    </td>
                    <td className={`px-3 py-3 text-right font-medium ${getChangeClass(row.gasolina95, prevRow?.gasolina95)}`}>
                      {formatPrice(row.gasolina95)}
                    </td>
                    <td className={`px-3 py-3 text-right font-medium ${getChangeClass(row.gasolina97, prevRow?.gasolina97)}`}>
                      {formatPrice(row.gasolina97)}
                    </td>
                    <td className={`px-3 py-3 text-right font-medium ${getChangeClass(row.kerosene, prevRow?.kerosene)}`}>
                      {formatPrice(row.kerosene ?? null)}
                    </td>
                    <td className={`px-3 py-3 text-right font-medium ${getChangeClass(row.eolica ?? null, prevRow?.eolica ?? null)}`}>
                      {formatPrice(row.eolica ?? null)}
                    </td>
                    <td className={`px-3 py-3 text-right font-medium ${getChangeClass(row.solar ?? null, prevRow?.solar ?? null)}`}>
                      {formatPrice(row.solar ?? null)}
                    </td>
                    <td className={`px-3 py-3 text-right font-medium ${getChangeClass(row.maritima ?? null, prevRow?.maritima ?? null)}`}>
                      {formatPrice(row.maritima ?? null)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
            Bajó más de 5%
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-red-500"></span>
            Subió más de 5%
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
