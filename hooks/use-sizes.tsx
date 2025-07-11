"use client"

import { useCallback } from "react"
import { apiClient } from "@/lib/api-client"
import { useCrud } from "./use-crud"
import type { Size, CreateSizeRequest, UpdateSizeRequest } from "@/types/size"

export function useSizes() {
  const fetchItems = useCallback(() => apiClient.getSizes(), [])
  const createItem = useCallback((size: CreateSizeRequest) => apiClient.createSize(size), [])
  const updateItem = useCallback((id: string, size: UpdateSizeRequest) => apiClient.updateSize(id, size), [])
  const deleteItem = useCallback((id: string) => apiClient.deleteSize(id), [])

  return useCrud<Size, CreateSizeRequest, UpdateSizeRequest>({
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  })
}
