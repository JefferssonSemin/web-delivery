"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import {
  LayoutDashboard,
  Users,
  Palette,
  Ruler,
  Layers,
  Package,
  ArrowDownToLine,
  ShoppingBag,
  Sparkles,
  ShoppingCart,
  LogOut,
  Menu,
  X,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Clientes", href: "/clientes", icon: Users },
    { name: "Cores", href: "/cores", icon: Palette },
    { name: "Tamanhos", href: "/tamanhos", icon: Ruler },
    { name: "Tipos de Malha", href: "/malhas", icon: Layers },
    { name: "Materiais", href: "/materiais", icon: Package },
    { name: "Entrada de Material", href: "/entrada-material", icon: ArrowDownToLine },
    { name: "Produtos", href: "/produtos", icon: ShoppingBag },
    { name: "Variações de Produto", href: "/variacoes-produto", icon: Sparkles },
    // Divisor aqui
    { type: "divider" },
    // Vendas após o divisor
    { name: "Vendas", href: "/vendas", icon: ShoppingCart },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const renderNavigationItem = (item: any, index: number) => {
    if (item.type === "divider") {
      return <div key={`divider-${index}`} className="border-t border-gray-200 my-2" />
    }

    return (
      <button
        key={item.name}
        onClick={() => router.push(item.href)}
        className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      >
        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
        {item.name}
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <h1 className="text-xl font-bold text-gray-900">ERP Sistema</h1>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            {navigation.map((item, index) => {
              if (item.type === "divider") {
                return <div key={`divider-${index}`} className="border-t border-gray-200 my-2" />
              }

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    router.push(item.href)
                    setSidebarOpen(false)
                  }}
                  className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4 border-b">
            <h1 className="text-xl font-bold text-gray-900">ERP Sistema</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            {navigation.map((item, index) => renderNavigationItem(item, index))}
          </nav>
          <div className="border-t p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">{user?.name?.charAt(0) || "U"}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name || "Usuário"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.userName}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="w-full bg-transparent">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Olá, {user?.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
