"use client"

import { useState } from "react"
import { useColors } from "@/hooks/use-colors"
import CrudManagement from "@/components/common/crud-management"
import ColorModal from "./color-modal"
import type { Color } from "@/types/color"

export default function ColorManagement() {
  const { items: colors, loading, error, fetch, remove } = useColors()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingColor, setEditingColor] = useState<Color | null>(null)

  const columns = [
    { key: "name", label: "Nome" },
    { key: "description", label: "Descrição" },
    {
      key: "createdAt",
      label: "Data de Criação",
      render: (color: Color) => (color.createdAt ? new Date(color.createdAt).toLocaleDateString("pt-BR") : "N/A"),
    },
  ]

  const handleAdd = () => {
    setEditingColor(null)
    setIsModalOpen(true)
  }

  const handleEdit = (color: Color) => {
    setEditingColor(color)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a cor "${name}"?`)) {
      const result = await remove(id)
      if (!result.success) {
        alert(`Erro ao excluir cor: ${result.error}`)
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingColor(null)
  }

  const handleSuccess = () => {
    handleCloseModal()
    fetch()
  }

  return (
    <CrudManagement
      title="Gerenciamento de Cores"
      description="Gerencie as cores disponíveis no sistema"
      items={colors}
      loading={loading}
      error={error}
      columns={columns}
      searchFields={["name", "description"]}
      onFetch={fetch}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      renderModal={
        <ColorModal isOpen={isModalOpen} onClose={handleCloseModal} color={editingColor} onSuccess={handleSuccess} />
      }
    />
  )
}
