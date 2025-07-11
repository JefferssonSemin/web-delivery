"use client"

import { useState, useEffect, useCallback } from "react"
import { useProducts } from "@/hooks/use-products"
import { useMaterials } from "@/hooks/use-materials"
import CrudManagement from "@/components/common/crud-management"
import ProductModal from "./product-modal"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types/product"

export default function ProductManagement() {
  const { items: products, loading, error, fetch, remove } = useProducts()
  const { items: materials, fetch: fetchMaterials } = useMaterials()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Buscar dados relacionados apenas uma vez
  useEffect(() => {
    fetchMaterials()
  }, [fetchMaterials])

  const getMaterialName = useCallback(
    (materialId: string) => {
      const material = materials.find((m) => m.id === materialId)
      return material?.name || "N/A"
    },
    [materials],
  )

  const columns = [
    { key: "name", label: "Nome" },
    { key: "description", label: "Descrição" },
    {
      key: "isSet",
      label: "É Conjunto",
      render: (product: Product) => (
        <Badge variant={product.isSet ? "default" : "secondary"}>{product.isSet ? "Sim" : "Não"}</Badge>
      ),
    },
    {
      key: "materialId",
      label: "Material",
      render: (product: Product) => getMaterialName(product.materialId),
    },
    {
      key: "createdAt",
      label: "Data de Criação",
      render: (product: Product) =>
        product.createdAt ? new Date(product.createdAt).toLocaleDateString("pt-BR") : "N/A",
    },
  ]

  const handleAdd = useCallback(() => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }, [])

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (id: string, name?: string) => {
      if (window.confirm(`Tem certeza que deseja excluir este produto?`)) {
        const result = await remove(id)
        if (!result.success) {
          alert(`Erro ao excluir produto: ${result.error}`)
        }
      }
    },
    [remove],
  )

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }, [])

  const handleSuccess = useCallback(() => {
    handleCloseModal()
    fetch()
  }, [handleCloseModal, fetch])

  return (
    <CrudManagement
      title="Gerenciamento de Produtos"
      description="Gerencie os produtos disponíveis no sistema"
      items={products}
      loading={loading}
      error={error}
      columns={columns}
      searchFields={["name", "description"]}
      onFetch={fetch}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      renderModal={
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          product={editingProduct}
          onSuccess={handleSuccess}
          materials={materials}
        />
      }
    />
  )
}
