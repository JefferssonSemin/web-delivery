"use client"

import { useState, useEffect, useCallback } from "react"
import { useSizes } from "@/hooks/use-sizes"
import { useMeshes } from "@/hooks/use-meshes"
import CrudManagement from "@/components/common/crud-management"
import SizeModal from "./size-modal"
import type { Size } from "@/types/size"

export default function SizeManagement() {
  const { items: sizes, loading, error, fetch, remove } = useSizes()
  const { items: meshes, fetch: fetchMeshes } = useMeshes()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSize, setEditingSize] = useState<Size | null>(null)

  // Buscar malhas apenas uma vez
  useEffect(() => {
    fetchMeshes()
  }, []) // Removido fetchMeshes da dependência

  const getMeshName = useCallback(
    (meshTypeId: string) => {
      const mesh = meshes.find((m) => m.id === meshTypeId)
      return mesh?.name || "N/A"
    },
    [meshes],
  )

  const columns = [
    { key: "name", label: "Nome" },
    { key: "weight", label: "Peso (g)" },
    { key: "width", label: "Largura (cm)" },
    { key: "height", label: "Altura (cm)" },
    { key: "length", label: "Comprimento (cm)" },
    {
      key: "meshTypeId",
      label: "Tipo de Malha",
      render: (size: Size) => getMeshName(size.meshTypeId),
    },
    {
      key: "createdAt",
      label: "Data de Criação",
      render: (size: Size) => (size.createdAt ? new Date(size.createdAt).toLocaleDateString("pt-BR") : "N/A"),
    },
  ]

  const handleAdd = useCallback(() => {
    setEditingSize(null)
    setIsModalOpen(true)
  }, [])

  const handleEdit = useCallback((size: Size) => {
    setEditingSize(size)
    setIsModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (id: string, name: string) => {
      if (window.confirm(`Tem certeza que deseja excluir o tamanho "${name}"?`)) {
        const result = await remove(id)
        if (!result.success) {
          alert(`Erro ao excluir tamanho: ${result.error}`)
        }
      }
    },
    [remove],
  )

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setEditingSize(null)
  }, [])

  const handleSuccess = useCallback(() => {
    handleCloseModal()
    fetch()
  }, [handleCloseModal, fetch])

  return (
    <CrudManagement
      title="Gerenciamento de Tamanhos"
      description="Gerencie os tamanhos disponíveis no sistema"
      items={sizes}
      loading={loading}
      error={error}
      columns={columns}
      searchFields={["name"]}
      onFetch={fetch}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      renderModal={
        <SizeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          size={editingSize}
          onSuccess={handleSuccess}
          meshes={meshes}
        />
      }
    />
  )
}
