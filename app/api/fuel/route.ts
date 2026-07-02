import { NextResponse } from "next/server";
import { getServerFuelData } from "@/lib/server/fuel-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region");
    const refresh = searchParams.get("refresh") === "true";

    const data = await getServerFuelData(refresh);

    if (region) {
      const filteredStations = data.stations.filter(
        (s) => s.region.toLowerCase().includes(region.toLowerCase())
      );
      return NextResponse.json({
        ...data,
        stations: filteredStations,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching fuel data on server:", error);
    return NextResponse.json(
      { error: "Error interno en el servidor al cargar datos de combustibles" },
      { status: 500 }
    );
  }
}
