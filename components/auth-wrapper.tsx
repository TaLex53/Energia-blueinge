"use client";

import React from "react";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { LoginPage } from "@/components/login-page";
import { Loader2 } from "lucide-react";

function AuthConsumer({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
          <p className="text-sm text-slate-400 font-medium">Verificando credenciales seguras...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <>{children}</>;
}

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthConsumer>{children}</AuthConsumer>
    </AuthProvider>
  );
}
