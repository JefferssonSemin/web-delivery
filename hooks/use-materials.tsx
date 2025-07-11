"use client"

import { useCallback } from "react"
import { apiClient } from "@/lib/api-client"
import { useCrud } from "./use-crud"
import type { Material, CreateMaterialRequest, UpdateMaterialRequest } from "@/types/material"

export function useMaterials() {
  const fetchItems = useCallback(() => apiClient.getMaterials(), [])
  const createItem = useCallback((material: CreateMaterialRequest) => apiClient.createMaterial(material), [])
  const updateItem = useCallback(
    (id: string, material: UpdateMaterialRequest) => apiClient.updateMaterial(id, material),
    [],
  )
  const deleteItem = useCallback((id: string) => apiClient.deleteMaterial(id), [])

  return useCrud<Material, CreateMaterialRequest, UpdateMaterialRequest>({
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  })
}
