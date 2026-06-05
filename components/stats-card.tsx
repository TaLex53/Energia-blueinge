"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, Zap, Fuel, DollarSign, BarChart3 } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  subtitle?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  icon: "zap" | "fuel" | "dollar" | "chart"
}

const iconMap = {
  zap: Zap,
  fuel: Fuel,
  dollar: DollarSign,
  chart: BarChart3,
}

export function StatsCard({ title, value, subtitle, trend, trendValue, icon }: StatsCardProps) {
  const Icon = iconMap[icon]
  
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="rounded-md bg-primary/10 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {(subtitle || trendValue) && (
          <div className="mt-1 flex items-center gap-2">
            {trend && trendValue && (
              <span className={`flex items-center text-xs ${
                trend === "up" ? "text-green-500" : 
                trend === "down" ? "text-red-500" : 
                "text-muted-foreground"
              }`}>
                {trend === "up" && <TrendingUp className="mr-1 h-3 w-3" />}
                {trend === "down" && <TrendingDown className="mr-1 h-3 w-3" />}
                {trend === "neutral" && <Minus className="mr-1 h-3 w-3" />}
                {trendValue}
              </span>
            )}
            {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
