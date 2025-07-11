"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useSales } from "@/hooks/use-sales"
import { useCustomers } from "@/hooks/use-customers"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Activity, TrendingUp, ShoppingCart, DollarSign } from "lucide-react"
import { getSaleStatusLabel, getSaleStatusVariant } from "@/types/sale"

export default function DashboardPage() {
  const { isAuthenticated, loading } = useAuth()
  const { items: sales, fetch: fetchSales } = useSales()
  const { customers, fetchCustomers } = useCustomers()
  const router = useRouter()
  const [salesMetrics, setSalesMetrics] = useState({
    totalSales: 0,
    totalRevenue: 0,
    pendingSales: 0,
    completedSales: 0,
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchSales()
      fetchCustomers()
    }
  }, [isAuthenticated, fetchSales, fetchCustomers])

  useEffect(() => {
    if (sales.length > 0) {
      const totalSales = sales.length
      const totalRevenue = sales.reduce((sum, sale) => sum + (sale.value - sale.discount), 0)
      const pendingSales = sales.filter((sale) => sale.status === 1).length
      const completedSales = sales.filter((sale) => sale.status === 4).length

      setSalesMetrics({
        totalSales,
        totalRevenue,
        pendingSales,
        completedSales,
      })
    }
  }, [sales])

  // Função para obter nome do cliente
  const getCustomerName = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId)
    return customer?.name || "Cliente não encontrado"
  }

  // Função para formatar ID da venda
  const formatSaleId = (id: string | number) => {
    const idStr = String(id)
    return idStr.length > 8 ? idStr.slice(0, 8) : idStr
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo ao painel de gerenciamento</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesMetrics.totalSales}</div>
              <p className="text-xs text-muted-foreground">Vendas realizadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(salesMetrics.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">Valor total das vendas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas Pendentes</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesMetrics.pendingSales}</div>
              <p className="text-xs text-muted-foreground">Aguardando processamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas Entregues</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesMetrics.completedSales}</div>
              <p className="text-xs text-muted-foreground">Vendas concluídas</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Acesso Rápido</CardTitle>
              <CardDescription>Funcionalidades principais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => router.push("/vendas")}
                  className="p-4 border rounded-lg hover:bg-green-50 transition-colors text-left border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
                >
                  <ShoppingCart className="h-6 w-6 text-green-600 mb-2" />
                  <p className="font-medium text-green-800">Gerenciar Vendas</p>
                  <p className="text-xs text-green-600">Criar, visualizar e gerenciar vendas</p>
                </button>
                <button
                  onClick={() => router.push("/clientes")}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Users className="h-6 w-6 text-blue-500 mb-2" />
                  <p className="font-medium">Gerenciar Clientes</p>
                  <p className="text-xs text-muted-foreground">Visualizar, criar e editar clientes</p>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vendas Recentes</CardTitle>
              <CardDescription>Últimas vendas no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sales.slice(0, 5).map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Venda #{formatSaleId(sale.id)}</p>
                        <p className="text-xs text-muted-foreground">{getCustomerName(sale.customerId)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(sale.value - sale.discount)}
                      </p>
                      <Badge variant={getSaleStatusVariant(sale.status)} className="text-xs">
                        {getSaleStatusLabel(sale.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
                {sales.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Nenhuma venda registrada</p>
                    <button
                      onClick={() => router.push("/vendas")}
                      className="mt-2 text-sm text-green-600 hover:text-green-700 underline"
                    >
                      Criar primeira venda
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
