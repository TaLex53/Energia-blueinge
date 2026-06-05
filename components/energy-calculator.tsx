"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, Calculator } from "lucide-react"
import { FUEL_ENERGY } from "@/lib/types"
import type { FuelKey, YearlyAverage } from "@/lib/types"

interface EnergyCalculatorProps {
  yearlyAverages: YearlyAverage[]
  currentPrices: Record<FuelKey, number | null>
}

const fuelLabels: Record<FuelKey, string> = {
  gasolina93: "Gasolina 93",
  gasolina95: "Gasolina 95",
  gasolina97: "Gasolina 97",
  diesel: "Petróleo Diesel",
  glp: "GLP",
  gnc: "GNC",
  kerosene: "Kerosene",
  solar: "Solar",
  eolica: "Eólica",
  maritima: "Marítima",
  red_electrica: "Red Eléctrica",
}

const fuelUnits: Record<FuelKey, string> = {
  gasolina93: "litro",
  gasolina95: "litro",
  gasolina97: "litro",
  diesel: "litro",
  glp: "kg",
  gnc: "m³",
  kerosene: "litro",
  solar: "kWh",
  eolica: "kWh",
  maritima: "kWh",
  red_electrica: "kWh",
}

export function EnergyCalculator({ yearlyAverages, currentPrices }: EnergyCalculatorProps) {
  const [selectedFuel, setSelectedFuel] = useState<FuelKey>("gasolina93")
  const [budget, setBudget] = useState<number>(10000)
  const [selectedYear, setSelectedYear] = useState<number | "current">("current")

  const years = useMemo(() => {
    const uniqueYears = [...new Set(yearlyAverages.map(y => y.year))].sort((a, b) => b - a)
    return uniqueYears
  }, [yearlyAverages])

  const calculation = useMemo(() => {
    let price: number | null = null

    if (selectedYear === "current") {
      price = currentPrices[selectedFuel]
    } else {
      const yearData = yearlyAverages.find(y => y.year === selectedYear)
      if (yearData) {
        price = yearData[selectedFuel as keyof YearlyAverage] as number | null
      }
    }

    if (!price || price === 0) {
      return null
    }

    const energyPerUnit = FUEL_ENERGY[selectedFuel]
    const quantity = budget / price
    const totalEnergy = quantity * energyPerUnit
    const costPerKwh = price / energyPerUnit

    return {
      price,
      quantity,
      totalEnergy,
      costPerKwh,
      unit: fuelUnits[selectedFuel],
    }
  }, [selectedFuel, budget, selectedYear, currentPrices, yearlyAverages])

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary/10 p-2">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Calculadora de Energía</CardTitle>
            <CardDescription>Calcula los kWh que puedes obtener según tu presupuesto</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Tipo de Combustible</label>
            <Select value={selectedFuel} onValueChange={(v) => setSelectedFuel(v as FuelKey)}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(fuelLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Año de Referencia</label>
            <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(v === "current" ? "current" : Number(v))}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Precio Actual</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Presupuesto (CLP)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="flex h-9 w-full rounded-md border border-input bg-secondary/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              min={0}
              step={1000}
            />
          </div>
        </div>

        {calculation ? (
          <div className="grid gap-4 rounded-lg bg-secondary/30 p-4 md:grid-cols-4">
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Precio por {calculation.unit}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                ${calculation.price.toLocaleString("es-CL")}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Cantidad</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {calculation.quantity.toFixed(2)} <span className="text-sm font-normal">{calculation.unit}s</span>
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Energía Total</p>
              <p className="mt-1 text-2xl font-bold text-primary">
                {calculation.totalEnergy.toFixed(1)} <span className="text-sm font-normal">kWh</span>
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Costo por kWh</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                ${calculation.costPerKwh.toFixed(0)} <span className="text-sm font-normal">/kWh</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-lg bg-secondary/30 p-8 text-muted-foreground">
            <Zap className="mr-2 h-5 w-5" />
            No hay datos de precio disponibles para esta selección
          </div>
        )}

        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
          <h4 className="mb-2 text-sm font-medium">Poder Calorífico por Combustible</h4>
          <div className="grid gap-2 text-xs text-muted-foreground md:grid-cols-4">
            <div>Gasolinas: 9.5 kWh/L</div>
            <div>Diesel: 10.0 kWh/L</div>
            <div>GLP: 12.8 kWh/kg</div>
            <div>GNC: 9.0 kWh/m³</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
