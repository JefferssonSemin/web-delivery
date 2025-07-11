"use client"

import { useState, useEffect, useCallback } from "react"
import { useSales } from "@/hooks/use-sales"
import { useCustomers } from "@/hooks/use-customers"
import { useProductVariations } from "@/hooks/use-product-variations"
import CrudManagement from "@/components/common/crud-management"
import SaleModal from "./sale-modal"
import { Badge } from "@/components/ui/badge"
import type { Sale } from "@/types/sale"
import { getSaleStatusLabel, getSaleStatusVariant } from "@/types/sale"

export default function SaleManagement() {
  const { items: sales, loading, error, fetch, remove } = useSales()
  const { customers, fetchCustomers } = useCustomers()
  const { items: productVariations, fetch: fetchProductVariations } = useProductVariations()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSale, setEditingSale] = useState<Sale | null>(null)

  // Buscar clientes e variações de produto apenas uma vez
  useEffect(() => {
    fetchCustomers()
    fetchProductVariations()
  }, [fetchCustomers, fetchProductVariations])

  const getCustomerName = useCallback(
    (customerId: string) => {
      const customer = customers.find((c) => c.id === customerId)
      return customer?.name || "Cliente não encontrado"
    },
    [customers],
  )

  const getProductVariationName = useCallback(
    (productVariationId: string) => {
      const variation = productVariations.find((v) => v.id === productVariationId)
      return variation?.name || "Variação não encontrada"
    },
    [productVariations],
  )

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }, [])

  const columns = [
    { key: "sku", label: "SKU" },
    {
      key: "customerId",
      label: "Cliente",
      render: (sale: Sale) => getCustomerName(sale.customerId),
    },
    {
      key: "productVariationId",
      label: "Produto",
      render: (sale: Sale) => getProductVariationName(sale.productVariationId),
    },
    {
      key: "quantityItems",
      label: "Quantidade",
      render: (sale: Sale) => `${sale.quantityItems} item(s)`,
    },
    {
      key: "value",
      label: "Valor",
      render: (sale: Sale) => formatCurrency(sale.value),
    },
    {
      key: "discount",
      label: "Desconto",
      render: (sale: Sale) => formatCurrency(sale.discount),
    },
    {
      key: "total",
      label: "Total",
      render: (sale: Sale) => <span className="font-medium">{formatCurrency(sale.value - sale.discount)}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (sale: Sale) => (
        <Badge variant={getSaleStatusVariant(sale.status)}>{getSaleStatusLabel(sale.status)}</Badge>
      ),
    },
    {
      key: "saleDate",
      label: "Data da Venda",
      render: (sale: Sale) => (sale.saleDate ? new Date(sale.saleDate).toLocaleDateString("pt-BR") : "N/A"),
    },
  ]

  const handleAdd = useCallback(() => {
    setEditingSale(null)
    setIsModalOpen(true)
  }, [])

  const handleEdit = useCallback((sale: Sale) => {
    setEditingSale(sale)
    setIsModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (id: string, name?: string) => {
      if (window.confirm(`Tem certeza que deseja excluir esta venda?`)) {
        const result = await remove(id)
        if (!result.success) {
          alert(`Erro ao excluir venda: ${result.error}`)
        }
      }
    },
    [remove],
  )

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setEditingSale(null)
  }, [])

  const handleSuccess = useCallback(() => {
    handleCloseModal()
    fetch()
  }, [handleCloseModal, fetch])

  return (
    <CrudManagement
      title="Gerenciamento de Vendas"
      description="Gerencie as vendas do sistema"
      items={sales}
      loading={loading}
      error={error}
      columns={columns}
      searchFields={["sku"]}
      onFetch={fetch}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      renderModal={
        <SaleModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          sale={editingSale}
          onSuccess={handleSuccess}
          customers={customers}
          productVariations={productVariations}
        />
      }
    />
  )
}
