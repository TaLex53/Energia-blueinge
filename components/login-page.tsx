"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AlertCircle } from "lucide-react";

export function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login(username, password);
    if (!result.success) {
      setError(result.error || "Error al iniciar sesión");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top Header Bar */}
      <header className="w-full border-b border-border/50 bg-card/40 px-6 py-4 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full shadow">
            <img src="/iconbluein.png" alt="Logo BlueIn" className="h-full w-full object-cover" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            CalEnergy <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">IA</span>
          </span>
        </div>
      </header>

      {/* Main Centered Login Section */}
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6 animate-in fade-in-50 duration-300">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Iniciar sesión
            </h1>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Ingresa tu correo electrónico y contraseña para entrar a tu cuenta.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Correo electrónico o usuario"
                required
                className="w-full rounded-md border border-border/80 bg-card/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-blue-600 focus:bg-card focus:outline-none focus:ring-1 focus:ring-blue-600 transition shadow-sm"
              />
            </div>

            <div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
                className="w-full rounded-md border border-border/80 bg-card/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-blue-600 focus:bg-card focus:outline-none focus:ring-1 focus:ring-blue-600 transition shadow-sm"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                style={{ backgroundColor: "#2563eb" }}
                className="rounded-lg bg-blue-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-blue-600/30 border border-blue-400/40 transition-all hover:bg-blue-500 hover:shadow-blue-600/50 active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? "INICIANDO..." : "INICIAR SESIÓN"}
              </button>

              <button
                type="button"
                onClick={() => alert("Por favor contacta al administrador del sistema para restablecer tu contraseña.")}
                className="text-xs font-semibold text-blue-400 transition hover:text-blue-300 hover:underline uppercase tracking-wide"
              >
                OLVIDÉ MI CONTRASEÑA
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
