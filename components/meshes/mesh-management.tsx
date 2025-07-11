"use client"

import { useState } from "react"
import { useMeshes } from "@/hooks/use-meshes"
import CrudManagement from "@/components/common/crud-management"
import MeshModal from "./mesh-modal"
import type { Mesh } from "@/types/mesh"

export default function MeshManagement() {
  const { items: meshes, loading, error, fetch, remove } = useMeshes()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMesh, setEditingMesh] = useState<Mesh | null>(null)

  const columns = [
    { key: "name", label: "Nome" },
    { key: "composition", label: "Composição" },
    {
      key: "createdAt",
      label: "Data de Criação",
      render: (mesh: Mesh) => (mesh.createdAt ? new Date(mesh.createdAt).toLocaleDateString("pt-BR") : "N/A"),
    },
  ]

  const handleAdd = () => {
    setEditingMesh(null)
    setIsModalOpen(true)
  }

  const handleEdit = (mesh: Mesh) => {
    setEditingMesh(mesh)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o tipo de malha "${name}"?`)) {
      const result = await remove(id)
      if (!result.success) {
        alert(`Erro ao excluir tipo de malha: ${result.error}`)
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingMesh(null)
  }

  const handleSuccess = () => {
    handleCloseModal()
    fetch()
  }

  return (
    <CrudManagement
      title="Gerenciamento de Tipos de Malha"
      description="Gerencie os tipos de malha disponíveis no sistema"
      items={meshes}
      loading={loading}
      error={error}
      columns={columns}
      searchFields={["name", "composition"]}
      onFetch={fetch}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      renderModal={
        <MeshModal isOpen={isModalOpen} onClose={handleCloseModal} mesh={editingMesh} onSuccess={handleSuccess} />
      }
    />
  )
}
