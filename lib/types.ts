export interface Servicentro {
  servicentro: string;
  region: string;
  provincia: string;
  comuna: string;
  direccion: string;
  coordenadas: string;
  tipoAtencion: string;
  gasolina93: number;
  diesel: number;
  gasolina95: number;
  glpVehicular: number;
  gnc: number;
  gasolina97: number;
  kerosene: number;
  ultimaActualizacion: string;
}

export interface GLPHistorico {
  fecha: string;
  anio: number;
  mes: number;
  regionNombre: string;
  regionCod: number;
  tipo: string;
  precioPesos: number;
  tamanio: string;
}

export interface FuelType {
  id: string;
  name: string;
  unit: string;
  kwhPerUnit: number;
  color: string;
}

export const FUEL_TYPES: FuelType[] = [
  { id: 'gasolina93', name: 'Gasolina 93', unit: 'litro', kwhPerUnit: 9.5, color: '#2dd4bf' },
  { id: 'gasolina95', name: 'Gasolina 95', unit: 'litro', kwhPerUnit: 9.6, color: '#60a5fa' },
  { id: 'gasolina97', name: 'Gasolina 97', unit: 'litro', kwhPerUnit: 9.7, color: '#f97316' },
  { id: 'diesel', name: 'Petróleo Diesel', unit: 'litro', kwhPerUnit: 10.0, color: '#a78bfa' },
  { id: 'kerosene', name: 'Kerosene', unit: 'litro', kwhPerUnit: 9.6, color: '#f472b6' },
  { id: 'glpVehicular', name: 'GLP Vehicular', unit: 'm³', kwhPerUnit: 6.9, color: '#4ade80' },
  { id: 'gnc', name: 'GNC', unit: 'm³', kwhPerUnit: 9.0, color: '#fbbf24' },
  { id: 'solar', name: 'Energía Solar', unit: 'kWh', kwhPerUnit: 1.0, color: '#fde047' },
  { id: 'eolica', name: 'Energía Eólica', unit: 'kWh', kwhPerUnit: 1.0, color: '#7dd3fc' },
  { id: 'maritima', name: 'Energía Marítima', unit: 'kWh', kwhPerUnit: 1.0, color: '#3b82f6' },
  { id: 'red_electrica', name: 'Red Eléctrica', unit: 'kWh', kwhPerUnit: 1.0, color: '#94a3b8' },
];

export interface PriceByYear {
  year: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
}

export interface EnergyEfficiency {
  fuelType: string;
  pricePerKwh: number;
  kwhPerUnit: number;
  pricePerUnit: number;
}

// Type for fuel keys
export type FuelKey = 
  | "gasolina93" 
  | "gasolina95" 
  | "gasolina97" 
  | "diesel" 
  | "glp" 
  | "gnc" 
  | "kerosene"
  | "solar"
  | "eolica"
  | "maritima"
  | "red_electrica";

// Energy content per unit (kWh)
export const FUEL_ENERGY: Record<FuelKey, number> = {
  gasolina93: 9.5,
  gasolina95: 9.6,
  gasolina97: 9.7,
  diesel: 10.0,
  glp: 12.8,
  gnc: 9.0,
  kerosene: 9.6,
  solar: 1.0,
  eolica: 1.0,
  maritima: 1.0,
  red_electrica: 1.0,
};

// Service station with processed fields
export interface ServiceStation {
  name: string;
  region: string;
  provincia: string;
  comuna: string;
  direccion: string;
  gasolina93: number | null;
  gasolina95: number | null;
  gasolina97: number | null;
  diesel: number | null;
  glp: number | null;
  gnc: number | null;
  kerosene: number | null;
}

// Yearly average prices
export interface YearlyAverage {
  year: number;
  gasolina93: number | null;
  gasolina95: number | null;
  gasolina97: number | null;
  diesel: number | null;
  glp: number | null;
  gnc: number | null;
  kerosene: number | null;
}
