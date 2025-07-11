"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { apiClient } from "@/lib/api-client"
import type { User, LoginRequest } from "@/types/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há um usuário logado no localStorage
    const savedUser = localStorage.getItem("erp_user")
    const savedToken = localStorage.getItem("erp_token")

    if (savedUser && savedToken) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      apiClient.setToken(savedToken)
    }
    setLoading(false)
  }, [])

  const login = async (credentials: LoginRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiClient.login(credentials)

      if (response.success && response.data?.token && response.data?.userName) {
        const userData: User = {
          id: Date.now().toString(),
          userName: response.data.userName,
          name: response.data.userName,
          token: response.data.token,
        }

        setUser(userData)
        apiClient.setToken(response.data.token)
        localStorage.setItem("erp_user", JSON.stringify(userData))
        localStorage.setItem("erp_token", response.data.token)

        return { success: true }
      } else {
        return { success: false, error: response.error || "Credenciais inválidas" }
      }
    } catch (error) {
      console.error("Erro no login:", error)
      return { success: false, error: "Erro de conexão com o servidor" }
    }
  }

  const logout = () => {
    setUser(null)
    apiClient.setToken(null)
    localStorage.removeItem("erp_user")
    localStorage.removeItem("erp_token")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
