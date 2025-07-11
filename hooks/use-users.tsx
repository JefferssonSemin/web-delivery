"use client"

import { useState, useCallback, useEffect } from "react"
import type { User, CreateUserData, CreateUserRequest, UpdateUserRequest } from "@/types/user"
import { mapApiUserToUser } from "@/types/user"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

// Dados mockados para fallback
const mockUsers: User[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@loja.com",
    userName: "joao.silva",
    role: "admin",
    status: "active",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@loja.com",
    userName: "maria.santos",
    role: "user",
    status: "active",
    createdAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro@loja.com",
    userName: "pedro.costa",
    role: "manager",
    status: "inactive",
    createdAt: "2024-02-01T09:15:00Z",
  },
]

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [apiAvailable, setApiAvailable] = useState(true)
  const { token } = useAuth()

  // Atualizar token no cliente API quando mudar
  useEffect(() => {
    apiClient.setToken(token)
  }, [token])

  const fetchUsers = useCallback(async () => {
    setLoading(true)

    try {
      console.log("[Users] Buscando usuários da API...")
      const response = await apiClient.getUsers()

      if (response.success && response.data) {
        console.log("[Users] Usuários recebidos da API:", response.data)

        // Converter dados da API para formato interno
        const convertedUsers = response.data.map((apiUser, index) => mapApiUserToUser(apiUser, `api-${index}`))

        setUsers(convertedUsers)
        setApiAvailable(true)
      } else {
        console.warn("[Users] API não disponível, usando dados mockados:", response.error)
        setUsers(mockUsers)
        setApiAvailable(false)
      }
    } catch (error) {
      console.warn("[Users] Erro ao buscar usuários, usando dados mockados:", error)
      setUsers(mockUsers)
      setApiAvailable(false)
    } finally {
      setLoading(false)
    }
  }, [token])

  const createUser = async (userData: CreateUserData) => {
    setLoading(true)

    try {
      const createRequest: CreateUserRequest = {
        userName: userData.userName || null,
        password: userData.password || null,
        role: userData.role || null,
      }

      console.log("[Users] Criando usuário:", createRequest)
      const response = await apiClient.createUser(createRequest)

      if (response.success && response.data) {
        console.log("[Users] Usuário criado com sucesso:", response.data)

        // Converter resposta da API para formato interno
        const newUser = mapApiUserToUser(response.data, `new-${Date.now()}`)
        setUsers((prev) => [...prev, newUser])
        setApiAvailable(true)
      } else {
        if (apiAvailable) {
          throw new Error(response.error || "Erro ao criar usuário")
        } else {
          // Fallback para simulação local
          console.warn("[Users] API não disponível, simulando criação:", response.error)
          await new Promise((resolve) => setTimeout(resolve, 300))

          const newUser: User = {
            id: Date.now().toString(),
            name: userData.userName,
            email: `${userData.userName}@loja.com`,
            userName: userData.userName,
            role: (userData.role as "admin" | "user" | "manager") || "user",
            status: "active",
            createdAt: new Date().toISOString(),
          }

          setUsers((prev) => [...prev, newUser])
        }
      }
    } catch (error) {
      console.error("[Users] Erro ao criar usuário:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (id: string, userData: Partial<User>) => {
    setLoading(true)

    try {
      const updateRequest: UpdateUserRequest = {
        userName: userData.userName || null,
        role: userData.role || null,
      }

      console.log("[Users] Atualizando usuário:", updateRequest)
      const response = await apiClient.updateUser(updateRequest)

      if (response.success) {
        console.log("[Users] Usuário atualizado com sucesso:", response.data)
        setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, ...userData } : user)))
        setApiAvailable(true)
      } else {
        if (apiAvailable) {
          throw new Error(response.error || "Erro ao atualizar usuário")
        } else {
          // Fallback para simulação local
          console.warn("[Users] API não disponível, simulando atualização:", response.error)
          await new Promise((resolve) => setTimeout(resolve, 300))
          setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, ...userData } : user)))
        }
      }
    } catch (error) {
      console.error("[Users] Erro ao atualizar usuário:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id: string) => {
    setLoading(true)

    try {
      // Nota: A API não tem endpoint DELETE, então vamos simular
      console.log("[Users] Tentando excluir usuário (simulado):", id)

      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      setUsers((prev) => prev.filter((user) => user.id !== id))
      console.log("[Users] Usuário excluído (simulado)")
    } catch (error) {
      console.error("[Users] Erro ao excluir usuário:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getUserById = async (id: string): Promise<User | null> => {
    setLoading(true)

    try {
      console.log("[Users] Buscando usuário por ID:", id)
      const response = await apiClient.getUserById(id)

      if (response.success && response.data) {
        console.log("[Users] Usuário encontrado:", response.data)
        const user = mapApiUserToUser(response.data, id)
        setApiAvailable(true)
        return user
      } else {
        // Fallback para busca local
        console.warn("[Users] API não disponível, buscando localmente:", response.error)
        const user = users.find((u) => u.id === id) || null
        setApiAvailable(false)
        return user
      }
    } catch (error) {
      console.error("[Users] Erro ao buscar usuário:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    users,
    loading,
    apiAvailable,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
  }
}
