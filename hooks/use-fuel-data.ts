"use client";

import { useState, useEffect } from "react";
import type { ServiceStation, YearlyAverage, FuelKey } from "@/lib/types";

export function useFuelData() {
  const [stations, setStations] = useState<ServiceStation[]>([]);
  const [yearlyAverages, setYearlyAverages] = useState<YearlyAverage[]>([]);
  const [currentPrices, setCurrentPrices] = useState<Record<FuelKey, number | null>>({
    gasolina93: null,
    gasolina95: null,
    gasolina97: null,
    diesel: null,
    glp: null,
    gnc: null,
    kerosene: null,
    solar: null,
    eolica: null,
    maritima: null,
    red_electrica: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Request processed data directly from our Next.js internal API server
        const response = await fetch("/api/fuel");
        if (!response.ok) {
          throw new Error("Error al obtener datos desde el servidor Next.js");
        }
        
        const data = await response.json();

        setStations(data.stations || []);
        setYearlyAverages(data.yearlyAverages || []);
        if (data.currentPrices) {
          setCurrentPrices(data.currentPrices);
        }
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar datos");
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    stations,
    yearlyAverages,
    currentPrices,
    isLoading,
    error,
  };
}
