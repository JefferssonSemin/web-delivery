"use client"

import { useCallback } from "react"
import { apiClient } from "@/lib/api-client"
import { useCrud } from "./use-crud"
import type { Product, CreateProductRequest, UpdateProductRequest } from "@/types/product"

export function useProducts() {
  const fetchItems = useCallback(() => apiClient.getProducts(), [])
  const createItem = useCallback((product: CreateProductRequest) => apiClient.createProduct(product), [])
  const updateItem = useCallback(
    (id: string, product: UpdateProductRequest) => apiClient.updateProduct(id, product),
    [],
  )
  const deleteItem = useCallback((id: string) => apiClient.deleteProduct(id), [])

  return useCrud<Product, CreateProductRequest, UpdateProductRequest>({
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  })
}
