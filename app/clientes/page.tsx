"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import DashboardLayout from "@/components/layout/dashboard-layout"
import CustomerManagement from "@/components/customers/customer-management"

export default function ClientesPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, loading, router])

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
      <CustomerManagement />
    </DashboardLayout>
  )
}
