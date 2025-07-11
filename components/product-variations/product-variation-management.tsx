"use client"

import { useState, useCallback, useEffect } from "react"
import { useProductVariations } from "@/hooks/use-product-variations"
import { useProducts } from "@/hooks/use-products"
import { useSizes } from "@/hooks/use-sizes"
import CrudManagement from "@/components/common/crud-management"
import ProductVariationModal from "./product-variation-modal"
import { Badge } from "@/components/ui/badge"
import type { ProductVariation } from "@/types/product-variation"
import { getGenderLabel } from "@/types/product-variation"

export default function ProductVariationManagement() {
  const { items: productVariations, loading, error, fetch, remove } = useProductVariations()
  const { items: products, fetch: fetchProducts } = useProducts()
  const { items: sizes, fetch: fetchSizes } = useSizes()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProductVariation, setEditingProductVariation] = useState<ProductVariation | null>(null)

  // Buscar dados relacionados apenas uma vez
  useEffect(() => {
    fetchProducts()
    fetchSizes()
  }, [fetchProducts, fetchSizes])

  const getProductName = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.id === productId)
      return product?.name || "Produto não encontrado"
    },
    [products],
  )

  const getSizeName = useCallback(
    (sizeId: string) => {
      const size = sizes.find((s) => s.id === sizeId)
      return size?.name || "Tamanho não encontrado"
    },
    [sizes],
  )

  const columns = [
    { key: "name", label: "Nome" },
    {
      key: "productId",
      label: "Produto",
      render: (productVariation: ProductVariation) => getProductName(productVariation.productId),
    },
    {
      key: "sizeId",
      label: "Tamanho",
      render: (productVariation: ProductVariation) => getSizeName(productVariation.sizeId),
    },
    {
      key: "gender",
      label: "Gênero",
      render: (productVariation: ProductVariation) => getGenderLabel(productVariation.gender),
    },
    {
      key: "isCap",
      label: "É Boné",
      render: (productVariation: ProductVariation) => (
        <Badge variant={productVariation.isCap ? "default" : "secondary"}>
          {productVariation.isCap ? "Sim" : "Não"}
        </Badge>
      ),
    },
    {
      key: "isPocket",
      label: "Tem Bolso",
      render: (productVariation: ProductVariation) => (
        <Badge variant={productVariation.isPocket ? "default" : "secondary"}>
          {productVariation.isPocket ? "Sim" : "Não"}
        </Badge>
      ),
    },
    {
      key: "withRib",
      label: "Com Punho",
      render: (productVariation: ProductVariation) => (
        <Badge variant={productVariation.withRib ? "default" : "secondary"}>
          {productVariation.withRib ? "Sim" : "Não"}
        </Badge>
      ),
    },
    {
      key: "enable",
      label: "Ativo",
      render: (productVariation: ProductVariation) => (
        <Badge variant={productVariation.enable ? "default" : "secondary"}>
          {productVariation.enable ? "Sim" : "Não"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Data de Criação",
      render: (productVariation: ProductVariation) =>
        productVariation.createdAt ? new Date(productVariation.createdAt).toLocaleDateString("pt-BR") : "N/A",
    },
  ]

  const handleAdd = useCallback(() => {
    setEditingProductVariation(null)
    setIsModalOpen(true)
  }, [])

  const handleEdit = useCallback((productVariation: ProductVariation) => {
    setEditingProductVariation(productVariation)
    setIsModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (id: string, name?: string) => {
      if (window.confirm(`Tem certeza que deseja excluir esta variação de produto?`)) {
        const result = await remove(id)
        if (!result.success) {
          alert(`Erro ao excluir variação de produto: ${result.error}`)
        }
      }
    },
    [remove],
  )

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setEditingProductVariation(null)
  }, [])

  const handleSuccess = useCallback(() => {
    handleCloseModal()
    fetch()
  }, [handleCloseModal, fetch])

  return (
    <CrudManagement
      title="Gerenciamento de Variações de Produto"
      description="Gerencie as variações de produtos disponíveis no sistema"
      items={productVariations}
      loading={loading}
      error={error}
      columns={columns}
      searchFields={["name", "gender"]}
      onFetch={fetch}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      renderModal={
        <ProductVariationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          productVariation={editingProductVariation}
          onSuccess={handleSuccess}
          products={products}
          sizes={sizes}
        />
      }
    />
  )
}
