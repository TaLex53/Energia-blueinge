"use client"

import React, { useState } from "react"
import { Search, Bell, User as UserIcon, Menu, LogOut, Zap } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface HeaderProps {
  onToggleCollapse?: () => void
  isCollapsed?: boolean
}

export function Header({ onToggleCollapse }: HeaderProps) {
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-card/40 backdrop-blur-md text-foreground shadow-sm">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        {/* Left Section: Collapse Menu Button + Brand Logo */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={onToggleCollapse}
            title="Alternar menú lateral"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/50 text-foreground transition hover:bg-muted"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-md">
              <img src="/iconbluein.png" alt="Logo BlueIn" className="h-full w-full object-cover" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-foreground">
              CalEnergy <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">IA</span>
            </span>
          </div>
        </div>

        {/* Middle / Search Section */}
        <div className="flex flex-1 justify-center max-w-xl px-2">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar planta de proceso, caldera, horno o combustible (/)..."
              className="w-full rounded-full border border-border/60 bg-background/60 py-2 pl-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-teal-500 focus:bg-background focus:outline-none focus:ring-1 focus:ring-teal-500 transition shadow-inner"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Right Section: Notifications & User */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Notification Bell */}
          <button
            title="Notificaciones"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/60 text-foreground transition hover:bg-muted shadow-sm"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-teal-500 ring-2 ring-background" />
          </button>

          {/* User Circular Button & Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              title={user ? `${user.name} - Ver perfil` : "Usuario"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/60 text-foreground transition hover:border-teal-500/50 hover:shadow-sm overflow-hidden"
            >
              {user && user.initials ? (
                <span className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-teal-500 to-blue-600 text-xs font-bold text-white">
                  {user.initials}
                </span>
              ) : (
                <UserIcon className="h-4 w-4" />
              )}
            </button>

            {/* Small Dropdown Popover */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border/60 bg-card p-3 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150 text-foreground">
                  {user && (
                    <div className="mb-2.5 border-b border-border/50 pb-2.5 px-1">
                      <p className="text-xs font-bold truncate">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">@{user.username || "usuario"}</p>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      logout()
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium text-destructive transition hover:bg-destructive/10"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
