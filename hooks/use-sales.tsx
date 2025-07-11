"use client"

import { useState, useCallback } from "react"
import { apiClient } from "@/lib/api-client"
import type { Sale, CreateSaleRequest, UpdateSaleRequest, SaleResponse } from "@/types/sale"

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mapSaleResponse = (response: SaleResponse): Sale => ({
    id: response.id,
    sku: response.sku,
    quantityItems: response.quantityItems,
    value: response.value,
    discount: response.discount,
    status: response.status,
    saleDate: response.saleDate,
    customerId: response.customerId,
    userId: response.userId,
    productVariationId: response.productVariationId,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  })

  const fetch = useCallback(async () => {
    console.log("[Sales] Iniciando busca de vendas...")
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.getSales()
      console.log("[Sales] Resposta da API:", response)

      if (response.success && response.data) {
        const mappedSales = response.data.map(mapSaleResponse)
        setSales(mappedSales)
        console.log("[Sales] Vendas mapeadas:", mappedSales)
      } else {
        const errorMsg = response.error || "Erro ao carregar vendas"
        console.error("[Sales] Erro na resposta:", errorMsg)
        setError(errorMsg)
        setSales([])
      }
    } catch (err) {
      const errorMsg = "Erro de conexão"
      console.error("[Sales] Erro de conexão:", err)
      setError(errorMsg)
      setSales([])
    } finally {
      setLoading(false)
    }
  }, [])

  const create = useCallback(
    async (saleData: CreateSaleRequest): Promise<{ success: boolean; error?: string }> => {
      setLoading(true)
      setError(null)

      try {
        console.log("[Sales] Criando venda:", saleData)
        const response = await apiClient.createSale(saleData)

        console.log("[Sales] Resposta da criação:", response)

        if (response.success && response.data) {
          const newSale = mapSaleResponse(response.data)
          setSales((prev) => [...prev, newSale])
          return { success: true }
        } else {
          const errorMsg = response.error || "Erro ao criar venda"
          setError(errorMsg)
          return { success: false, error: errorMsg }
        }
      } catch (err) {
        const errorMsg = "Erro de conexão"
        console.error("[Sales] Erro ao criar venda:", err)
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const update = useCallback(
    async (id: string, saleData: UpdateSaleRequest): Promise<{ success: boolean; error?: string }> => {
      setLoading(true)
      setError(null)

      try {
        console.log("[Sales] Atualizando venda:", id, saleData)
        const response = await apiClient.updateSale(id, saleData)

        console.log("[Sales] Resposta da atualização:", response)

        if (response.success && response.data) {
          const updatedSale = mapSaleResponse(response.data)
          setSales((prev) => prev.map((sale) => (sale.id === id ? updatedSale : sale)))
          return { success: true }
        } else {
          const errorMsg = response.error || "Erro ao atualizar venda"
          setError(errorMsg)
          return { success: false, error: errorMsg }
        }
      } catch (err) {
        const errorMsg = "Erro de conexão"
        console.error("[Sales] Erro ao atualizar venda:", err)
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const remove = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      setLoading(true)
      setError(null)

      try {
        console.log("[Sales] Excluindo venda:", id)
        const response = await apiClient.deleteSale(id)

        console.log("[Sales] Resposta da exclusão:", response)

        if (response.success) {
          setSales((prev) => prev.filter((sale) => sale.id !== id))
          return { success: true }
        } else {
          const errorMsg = response.error || "Erro ao excluir venda"
          setError(errorMsg)
          return { success: false, error: errorMsg }
        }
      } catch (err) {
        const errorMsg = "Erro de conexão"
        console.error("[Sales] Erro ao excluir venda:", err)
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return {
    items: sales,
    loading,
    error,
    fetch,
    create,
    update,
    remove,
  }
}
