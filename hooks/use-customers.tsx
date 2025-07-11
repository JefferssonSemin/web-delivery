"use client"

import { useState, useCallback } from "react"
import { apiClient } from "@/lib/api-client"
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest, CustomerResponse } from "@/types/customer"

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mapCustomerResponse = (response: CustomerResponse): Customer => ({
    id: response.id,
    name: response.name,
    email: response.email,
    phone: response.phone,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  })

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("[Customers] Iniciando busca de clientes...")
      const response = await apiClient.getCustomers()

      console.log("[Customers] Resposta da API:", response)

      if (response.success) {
        // Verificar se response.data existe e é um array
        if (response.data && Array.isArray(response.data)) {
          console.log("[Customers] Dados recebidos (array):", response.data)
          const mappedCustomers = response.data.map(mapCustomerResponse)
          setCustomers(mappedCustomers)
        } else if (response.data) {
          // Se response.data não é um array, verificar se é um objeto com propriedade que contém o array
          console.log("[Customers] Dados recebidos (objeto):", response.data)

          // Tentar diferentes estruturas possíveis da resposta
          let customerArray: any[] = []

          const data = response.data as any
          if (data.customers && Array.isArray(data.customers)) {
            customerArray = data.customers
          } else if (data.data && Array.isArray(data.data)) {
            customerArray = data.data
          } else if (data.items && Array.isArray(data.items)) {
            customerArray = data.items
          } else {
            // Se response.data é um objeto único, transformar em array
            customerArray = [response.data]
          }

          console.log("[Customers] Array de clientes extraído:", customerArray)
          const mappedCustomers = customerArray.map(mapCustomerResponse)
          setCustomers(mappedCustomers)
        } else {
          // Se não há dados, definir array vazio
          console.log("[Customers] Nenhum dado retornado, definindo array vazio")
          setCustomers([])
        }
      } else {
        const errorMsg = response.error || "Erro ao carregar clientes"
        console.error("[Customers] Erro na resposta:", errorMsg)
        setError(errorMsg)
        setCustomers([]) // Definir array vazio em caso de erro
      }
    } catch (err) {
      const errorMsg = "Erro de conexão"
      console.error("[Customers] Erro de conexão:", err)
      setError(errorMsg)
      setCustomers([]) // Definir array vazio em caso de erro
    } finally {
      setLoading(false)
    }
  }, [])

  const createCustomer = async (customerData: CreateCustomerRequest): Promise<{ success: boolean; error?: string }> => {
    setLoading(true)
    setError(null)

    try {
      console.log("[Customers] Criando cliente:", customerData)
      const response = await apiClient.createCustomer(customerData)

      console.log("[Customers] Resposta da criação:", response)

      if (response.success && response.data) {
        const newCustomer = mapCustomerResponse(response.data)
        setCustomers((prev) => [...prev, newCustomer])
        return { success: true }
      } else {
        const errorMsg = response.error || "Erro ao criar cliente"
        setError(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch (err) {
      const errorMsg = "Erro de conexão"
      console.error("[Customers] Erro ao criar cliente:", err)
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const updateCustomer = async (
    id: string,
    customerData: UpdateCustomerRequest,
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true)
    setError(null)

    try {
      console.log("[Customers] Atualizando cliente:", id, customerData)
      const response = await apiClient.updateCustomer(id, customerData)

      console.log("[Customers] Resposta da atualização:", response)

      if (response.success && response.data) {
        const updatedCustomer = mapCustomerResponse(response.data)
        setCustomers((prev) => prev.map((customer) => (customer.id === id ? updatedCustomer : customer)))
        return { success: true }
      } else {
        const errorMsg = response.error || "Erro ao atualizar cliente"
        setError(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch (err) {
      const errorMsg = "Erro de conexão"
      console.error("[Customers] Erro ao atualizar cliente:", err)
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const deleteCustomer = async (id: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true)
    setError(null)

    try {
      console.log("[Customers] Excluindo cliente:", id)
      const response = await apiClient.deleteCustomer(id)

      console.log("[Customers] Resposta da exclusão:", response)

      if (response.success) {
        setCustomers((prev) => prev.filter((customer) => customer.id !== id))
        return { success: true }
      } else {
        const errorMsg = response.error || "Erro ao excluir cliente"
        setError(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch (err) {
      const errorMsg = "Erro de conexão"
      console.error("[Customers] Erro ao excluir cliente:", err)
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  }
}
