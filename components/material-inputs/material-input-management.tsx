"use client"

import { useState, useEffect, useCallback } from "react"
import { useMaterialInputs } from "@/hooks/use-material-inputs"
import { useMaterials } from "@/hooks/use-materials"
import CrudManagement from "@/components/common/crud-management"
import MaterialInputModal from "./material-input-modal"
import type { MaterialInput } from "@/types/material-input"

export default function MaterialInputManagement() {
  const { items: materialInputs, loading, error, fetch, remove } = useMaterialInputs()
  const { items: materials, fetch: fetchMaterials } = useMaterials()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMaterialInput, setEditingMaterialInput] = useState<MaterialInput | null>(null)

  useEffect(() => {
    fetchMaterials()
  }, [fetchMaterials])

  const getMaterialName = useCallback(
    (materialId: string) => {
      const material = materials.find((m) => m.id === materialId)
      return material?.name || "Material não encontrado"
    },
    [materials],
  )

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }, [])

  const columns = [
    {
      key: "material",
      label: "Material",
      render: (materialInput: MaterialInput) => {
        // Primeiro tenta usar o material aninhado, depois busca pelo ID
        if (materialInput.material?.name) {
          return materialInput.material.name
        }
        return getMaterialName(materialInput.materialId)
      },
    },
    {
      key: "meters",
      label: "Metros",
      render: (materialInput: MaterialInput) => `${materialInput.meters} m`,
    },
    {
      key: "totalPrice",
      label: "Preço Total",
      render: (materialInput: MaterialInput) => formatCurrency(materialInput.totalPrice),
    },
  ]

  const handleAdd = useCallback(() => {
    setEditingMaterialInput(null)
    setIsModalOpen(true)
  }, [])

  const handleEdit = useCallback((materialInput: MaterialInput) => {
    setEditingMaterialInput(materialInput)
    setIsModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm(`Tem certeza que deseja excluir esta entrada de material?`)) {
        const result = await remove(id)
        if (!result.success) {
          alert(`Erro ao excluir entrada de material: ${result.error}`)
        }
      }
    },
    [remove],
  )

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setEditingMaterialInput(null)
  }, [])

  const handleSuccess = useCallback(() => {
    handleCloseModal()
    fetch()
  }, [handleCloseModal, fetch])

  // Debug: log dos dados para verificar
  console.log("Material Inputs:", materialInputs)
  console.log("Materials:", materials)
  console.log("Loading:", loading)
  console.log("Error:", error)

  return (
    <CrudManagement
      title="Gerenciamento de Entrada de Material"
      description="Gerencie as entradas de material no sistema"
      items={materialInputs}
      loading={loading}
      error={error}
      columns={columns}
      searchFields={["materialId"]}
      onFetch={fetch}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      renderModal={
        <MaterialInputModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          materialInput={editingMaterialInput}
          onSuccess={handleSuccess}
          materials={materials}
        />
      }
    />
  )
}
