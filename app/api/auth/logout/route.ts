import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("energy_session");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging out:", error);
    return NextResponse.json(
      { error: "Error al cerrar sesión en el servidor" },
      { status: 500 }
    );
  }
}
