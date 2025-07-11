"use client"

import { useState, useCallback, useEffect } from "react"
import { useMaterials } from "@/hooks/use-materials"
import { useMeshes } from "@/hooks/use-meshes"
import { useColors } from "@/hooks/use-colors"
import CrudManagement from "@/components/common/crud-management"
import MaterialModal from "./material-modal"
import type { Material } from "@/types/material"

export default function MaterialManagement() {
  const { items: materials, loading, error, fetch, remove } = useMaterials()
  const { items: meshes, fetch: fetchMeshes } = useMeshes()
  const { items: colors, fetch: fetchColors } = useColors()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)

  // Buscar malhas e cores apenas uma vez
  useEffect(() => {
    fetchMeshes()
    fetchColors()
  }, [fetchMeshes, fetchColors])

  const getMeshName = useCallback(
    (meshTypeId: string) => {
      const mesh = meshes.find((m) => m.id === meshTypeId)
      return mesh?.name || "Malha não encontrada"
    },
    [meshes],
  )

  const getColorName = useCallback(
    (colorId: string) => {
      const color = colors.find((c) => c.id === colorId)
      return color?.name || "Cor não encontrada"
    },
    [colors],
  )

  const columns = [
    { key: "name", label: "Nome" },
    { key: "supplie", label: "Fornecedor" },
    {
      key: "inside",
      label: "Quantidade Interna",
      render: (material: Material) => material.inside,
    },
    {
      key: "meshTypeId",
      label: "Tipo de Malha",
      render: (material: Material) => getMeshName(material.meshTypeId),
    },
    {
      key: "colorId",
      label: "Cor",
      render: (material: Material) => getColorName(material.colorId),
    },
    {
      key: "createdAt",
      label: "Data de Criação",
      render: (material: Material) =>
        material.createdAt ? new Date(material.createdAt).toLocaleDateString("pt-BR") : "N/A",
    },
  ]

  const handleAdd = useCallback(() => {
    setEditingMaterial(null)
    setIsModalOpen(true)
  }, [])

  const handleEdit = useCallback((material: Material) => {
    setEditingMaterial(material)
    setIsModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (id: string, name?: string) => {
      if (window.confirm(`Tem certeza que deseja excluir este material?`)) {
        const result = await remove(id)
        if (!result.success) {
          alert(`Erro ao excluir material: ${result.error}`)
        }
      }
    },
    [remove],
  )

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setEditingMaterial(null)
  }, [])

  const handleSuccess = useCallback(() => {
    handleCloseModal()
    fetch()
  }, [handleCloseModal, fetch])

  return (
    <CrudManagement
      title="Gerenciamento de Materiais"
      description="Gerencie os materiais disponíveis no sistema"
      items={materials}
      loading={loading}
      error={error}
      columns={columns}
      searchFields={["name", "supplie"]}
      onFetch={fetch}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      renderModal={
        <MaterialModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          material={editingMaterial}
          onSuccess={handleSuccess}
          meshes={meshes}
          colors={colors}
        />
      }
    />
  )
}
