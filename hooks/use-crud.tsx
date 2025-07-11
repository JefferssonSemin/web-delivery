"use client"

import { useState, useCallback } from "react"

interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

interface UseCrudOptions<T, CreateT, UpdateT> {
  fetchItems: () => Promise<ApiResponse<T[]>>
  createItem: (item: CreateT) => Promise<ApiResponse<T>>
  updateItem: (id: string, item: UpdateT) => Promise<ApiResponse<T>>
  deleteItem: (id: string) => Promise<ApiResponse<void>>
}

export function useCrud<T, CreateT, UpdateT>({
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
}: UseCrudOptions<T, CreateT, UpdateT>) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    console.log("[useCrud] Starting fetch...")
    setLoading(true)
    setError(null)

    try {
      const result = await fetchItems()
      console.log("[useCrud] Fetch result:", result)

      if (result.success && result.data) {
        setItems(result.data)
        console.log("[useCrud] Items set:", result.data)
      } else {
        setError(result.error || "Erro ao carregar dados")
        setItems([])
      }
    } catch (err) {
      console.error("[useCrud] Fetch error:", err)
      setError("Erro inesperado ao carregar dados")
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [fetchItems])

  const create = useCallback(
    async (item: CreateT) => {
      const result = await createItem(item)
      if (result.success) {
        await fetch()
      }
      return result
    },
    [createItem, fetch],
  )

  const update = useCallback(
    async (id: string, item: UpdateT) => {
      const result = await updateItem(id, item)
      if (result.success) {
        await fetch()
      }
      return result
    },
    [updateItem, fetch],
  )

  const remove = useCallback(
    async (id: string) => {
      const result = await deleteItem(id)
      if (result.success) {
        await fetch()
      }
      return result
    },
    [deleteItem, fetch],
  )

  return {
    items,
    loading,
    error,
    fetch,
    create,
    update,
    remove,
  }
}
