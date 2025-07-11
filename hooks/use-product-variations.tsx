"use client"

import { useCallback } from "react"
import { apiClient } from "@/lib/api-client"
import { useCrud } from "./use-crud"
import type {
  ProductVariation,
  CreateProductVariationRequest,
  UpdateProductVariationRequest,
} from "@/types/product-variation"

export function useProductVariations() {
  const fetchItems = useCallback(() => apiClient.getProductVariations(), [])
  const createItem = useCallback(
    (productVariation: CreateProductVariationRequest) => apiClient.createProductVariation(productVariation),
    [],
  )
  const updateItem = useCallback(
    (id: string, productVariation: UpdateProductVariationRequest) =>
      apiClient.updateProductVariation(id, productVariation),
    [],
  )
  const deleteItem = useCallback((id: string) => apiClient.deleteProductVariation(id), [])

  return useCrud<ProductVariation, CreateProductVariationRequest, UpdateProductVariationRequest>({
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  })
}
