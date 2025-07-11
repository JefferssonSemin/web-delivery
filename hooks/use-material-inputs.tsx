"use client"

import { useCallback } from "react"
import { apiClient } from "@/lib/api-client"
import { useCrud } from "./use-crud"
import type { MaterialInput, CreateMaterialInputRequest, UpdateMaterialInputRequest } from "@/types/material-input"

export function useMaterialInputs() {
  const fetchItems = useCallback(async () => {
    console.log("[useMaterialInputs] Fetching material inputs...")
    const result = await apiClient.getMaterialInputs()
    console.log("[useMaterialInputs] API Result:", result)
    return result
  }, [])

  const createItem = useCallback((materialInput: CreateMaterialInputRequest) => {
    console.log("[useMaterialInputs] Creating material input:", materialInput)
    return apiClient.createMaterialInput(materialInput)
  }, [])

  const updateItem = useCallback((id: string, materialInput: UpdateMaterialInputRequest) => {
    console.log("[useMaterialInputs] Updating material input:", id, materialInput)
    return apiClient.updateMaterialInput(id, materialInput)
  }, [])

  const deleteItem = useCallback((id: string) => {
    console.log("[useMaterialInputs] Deleting material input:", id)
    return apiClient.deleteMaterialInput(id)
  }, [])

  return useCrud<MaterialInput, CreateMaterialInputRequest, UpdateMaterialInputRequest>({
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  })
}
