"use client";

import { useState, useEffect } from "react";
import Papa from "papaparse";
import type { ServiceStation, YearlyAverage, FuelKey } from "@/lib/types";

const parseNumber = (value: string): number | null => {
  if (!value || value === "0" || value.trim() === "") return null;
  const cleaned = value.replace(/\./g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
};

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
        // Load all servicentros files
        const servicentroFiles = [
          "/data/servicentros-1.csv",
          "/data/servicentros-2.csv",
          "/data/servicentros-3.csv",
        ];

        const servicentroPromises = servicentroFiles.map(async (file) => {
          const response = await fetch(file);
          const text = await response.text();
          return new Promise<ServiceStation[]>((resolve) => {
            Papa.parse(text, {
              header: false,
              skipEmptyLines: true,
              complete: (results: any) => {
                const data = results.data.slice(1).map((row: unknown) => {
                  const r = row as string[];
                  return {
                    name: r[0] || "",
                    region: r[1] || "",
                    provincia: r[2] || "",
                    comuna: r[3] || "",
                    direccion: r[4] || "",
                    gasolina93: parseNumber(r[7]),
                    diesel: parseNumber(r[8]),
                    gasolina95: parseNumber(r[9]),
                    glp: parseNumber(r[10]),
                    gnc: parseNumber(r[11]),
                    gasolina97: parseNumber(r[12]),
                    kerosene: parseNumber(r[13]),
                  };
                });
                resolve(data);
              },
            });
          });
        });

        // Load GLP historico for yearly averages
        const glpResponse = await fetch("/data/glp-historico.csv");
        const glpText = await glpResponse.text();
        
        const glpData = await new Promise<Array<{ year: number; price: number }>>((resolve) => {
          Papa.parse(glpText, {
            header: false,
            delimiter: ";",
            skipEmptyLines: true,
            complete: (results: any) => {
              const data = results.data.slice(1).map((row: unknown) => {
                const r = row as string[];
                return {
                  year: parseInt(r[1]) || 0,
                  price: parseNumber(r[6]) || 0,
                };
              }).filter(d => d.year > 0 && d.price && d.price > 0);
              resolve(data);
            },
          });
        });

        const servicentrosResults = await Promise.all(servicentroPromises);

        // Combine and deduplicate servicentros
        const allStations = servicentrosResults.flat();
        const uniqueStations = allStations.filter(
          (s, index, self) =>
            index === self.findIndex(
              (t) => t.direccion === s.direccion && t.name === s.name
            )
        );

        setStations(uniqueStations);

        // Calculate current prices (average from all stations)
        const prices: Record<FuelKey, number[]> = {
          gasolina93: [],
          gasolina95: [],
          gasolina97: [],
          diesel: [],
          glp: [],
          gnc: [],
          kerosene: [],
          solar: [],
          eolica: [],
          maritima: [],
          red_electrica: [],
        };

        uniqueStations.forEach(s => {
          if (s.gasolina93) prices.gasolina93.push(s.gasolina93);
          if (s.gasolina95) prices.gasolina95.push(s.gasolina95);
          if (s.gasolina97) prices.gasolina97.push(s.gasolina97);
          if (s.diesel) prices.diesel.push(s.diesel);
          if (s.glp) prices.glp.push(s.glp);
          if (s.gnc) prices.gnc.push(s.gnc);
          if (s.kerosene) prices.kerosene.push(s.kerosene);
        });

        const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

        setCurrentPrices({
          gasolina93: avg(prices.gasolina93),
          gasolina95: avg(prices.gasolina95),
          gasolina97: avg(prices.gasolina97),
          diesel: avg(prices.diesel),
          glp: avg(prices.glp),
          gnc: avg(prices.gnc),
          kerosene: avg(prices.kerosene),
          solar: 30,
          eolica: 41,
          maritima: 150,
          red_electrica: 265,
        });

        // Calculate yearly averages from GLP data and estimate fuel prices
        const yearMap = new Map<number, number[]>();
        glpData.forEach((d: any) => {
          if (!yearMap.has(d.year)) yearMap.set(d.year, []);
          yearMap.get(d.year)!.push(d.price);
        });

        // Create yearly averages with estimated prices based on GLP trends
        const glpYearlyAverages: YearlyAverage[] = [];
        yearMap.forEach((priceList, year) => {
          const avgGlpPrice = priceList.reduce((a, b) => a + b, 0) / priceList.length;
          // GLP price is per 5kg, convert to per kg
          const glpPerKg = avgGlpPrice / 5;
          
          // Estimate other fuel prices based on typical ratios (these are rough estimates for historical context)
          // Gasolina typically costs around 0.08x of GLP per kg in terms of energy value
          const baseRatio = glpPerKg * 0.12;
          
          glpYearlyAverages.push({
            year,
            gasolina93: Math.round(baseRatio * 6),
            gasolina95: Math.round(baseRatio * 6.3),
            gasolina97: Math.round(baseRatio * 6.6),
            diesel: Math.round(baseRatio * 5.5),
            glp: Math.round(glpPerKg),
            gnc: null,
            kerosene: Math.round(baseRatio * 5.3),
          });
        });

        // Add current year with actual data if available
        const currentYear = new Date().getFullYear();
        if (!glpYearlyAverages.find(y => y.year === currentYear)) {
          glpYearlyAverages.push({
            year: currentYear,
            gasolina93: avg(prices.gasolina93),
            gasolina95: avg(prices.gasolina95),
            gasolina97: avg(prices.gasolina97),
            diesel: avg(prices.diesel),
            glp: avg(prices.glp),
            gnc: avg(prices.gnc),
            kerosene: avg(prices.kerosene),
          });
        }

        setYearlyAverages(glpYearlyAverages.sort((a, b) => a.year - b.year));
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
