import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Por favor ingresa usuario y contraseña" },
        { status: 400 }
      );
    }

    const cleanUser = username.trim();
    const displayName = cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1);
    const initials = cleanUser.substring(0, 2).toUpperCase();

    const userData = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      username: cleanUser,
      name: displayName,
      initials,
    };

    const cookieStore = await cookies();
    cookieStore.set("energy_session", JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("Error en login API:", error);
    return NextResponse.json(
      { error: "Error interno en inicio de sesión" },
      { status: 500 }
    );
  }
}
