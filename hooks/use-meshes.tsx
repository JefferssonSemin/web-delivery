"use client"

import { useCallback } from "react"
import { apiClient } from "@/lib/api-client"
import { useCrud } from "./use-crud"
import type { Mesh, CreateMeshRequest, UpdateMeshRequest } from "@/types/mesh"

export function useMeshes() {
  const fetchItems = useCallback(() => apiClient.getMeshes(), [])
  const createItem = useCallback((mesh: CreateMeshRequest) => apiClient.createMesh(mesh), [])
  const updateItem = useCallback((id: string, mesh: UpdateMeshRequest) => apiClient.updateMesh(id, mesh), [])
  const deleteItem = useCallback((id: string) => apiClient.deleteMesh(id), [])

  return useCrud<Mesh, CreateMeshRequest, UpdateMeshRequest>({
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  })
}
