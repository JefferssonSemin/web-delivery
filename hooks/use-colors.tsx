"use client"

import { useCallback } from "react"
import { apiClient } from "@/lib/api-client"
import { useCrud } from "./use-crud"
import type { Color, CreateColorRequest, UpdateColorRequest } from "@/types/color"

export function useColors() {
  const fetchItems = useCallback(() => apiClient.getColors(), [])
  const createItem = useCallback((color: CreateColorRequest) => apiClient.createColor(color), [])
  const updateItem = useCallback((id: string, color: UpdateColorRequest) => apiClient.updateColor(id, color), [])
  const deleteItem = useCallback((id: string) => apiClient.deleteColor(id), [])

  return useCrud<Color, CreateColorRequest, UpdateColorRequest>({
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  })
}
