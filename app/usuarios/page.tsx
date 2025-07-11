"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import DashboardLayout from "@/components/layout/dashboard-layout"
import UserManagement from "@/components/users/user-management"

export default function UsuariosPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <UserManagement />
    </DashboardLayout>
  )
}
