"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin } from "lucide-react"
import type { ServiceStation } from "@/lib/types"

interface RegionMapProps {
  stations: ServiceStation[]
}

export function RegionMap({ stations }: RegionMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("all")

  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(stations.map(s => s.region).filter(Boolean))]
    return uniqueRegions.sort()
  }, [stations])

  const regionStats = useMemo(() => {
    const filtered = selectedRegion === "all" 
      ? stations 
      : stations.filter(s => s.region === selectedRegion)

    const withGas93 = filtered.filter(s => s.gasolina93 && s.gasolina93 > 0)
    const withDiesel = filtered.filter(s => s.diesel && s.diesel > 0)

    const avgGas93 = withGas93.length > 0 
      ? withGas93.reduce((acc, s) => acc + (s.gasolina93 || 0), 0) / withGas93.length 
      : null

    const avgDiesel = withDiesel.length > 0 
      ? withDiesel.reduce((acc, s) => acc + (s.diesel || 0), 0) / withDiesel.length 
      : null

    const minGas93 = withGas93.length > 0 
      ? Math.min(...withGas93.map(s => s.gasolina93!)) 
      : null

    const maxGas93 = withGas93.length > 0 
      ? Math.max(...withGas93.map(s => s.gasolina93!)) 
      : null

    return {
      total: filtered.length,
      avgGas93,
      avgDiesel,
      minGas93,
      maxGas93,
    }
  }, [stations, selectedRegion])

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-primary/10 p-2">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Precios por Región</CardTitle>
              <CardDescription>Estadísticas de precios actuales por zona geográfica</CardDescription>
            </div>
          </div>
          <Select value={selectedRegion} onValueChange={(value) => setSelectedRegion(value || "all")}>
            <SelectTrigger className="w-[200px] bg-secondary/50">
              <SelectValue placeholder="Seleccionar región" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las regiones</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-5">
          <div className="rounded-lg bg-secondary/30 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Estaciones</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{regionStats.total.toLocaleString("es-CL")}</p>
          </div>
          <div className="rounded-lg bg-secondary/30 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Prom. Gas 93</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {regionStats.avgGas93 ? `$${Math.round(regionStats.avgGas93).toLocaleString("es-CL")}` : "-"}
            </p>
          </div>
          <div className="rounded-lg bg-secondary/30 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Prom. Diesel</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {regionStats.avgDiesel ? `$${Math.round(regionStats.avgDiesel).toLocaleString("es-CL")}` : "-"}
            </p>
          </div>
          <div className="rounded-lg bg-secondary/30 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Mín. Gas 93</p>
            <p className="mt-1 text-2xl font-bold text-green-500">
              {regionStats.minGas93 ? `$${regionStats.minGas93.toLocaleString("es-CL")}` : "-"}
            </p>
          </div>
          <div className="rounded-lg bg-secondary/30 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Máx. Gas 93</p>
            <p className="mt-1 text-2xl font-bold text-red-500">
              {regionStats.maxGas93 ? `$${regionStats.maxGas93.toLocaleString("es-CL")}` : "-"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
