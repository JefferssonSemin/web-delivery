"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useMeshes } from "@/hooks/use-meshes"
import type { Mesh } from "@/types/mesh"
import { AlertCircle } from "lucide-react"

interface MeshModalProps {
  isOpen: boolean
  onClose: () => void
  mesh?: Mesh | null
  onSuccess: () => void
}

export default function MeshModal({ isOpen, onClose, mesh, onSuccess }: MeshModalProps) {
  const { create, update, loading } = useMeshes()
  const [formData, setFormData] = useState({
    name: "",
    composition: "",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    if (mesh) {
      setFormData({
        name: mesh.name,
        composition: mesh.composition,
      })
    } else {
      setFormData({
        name: "",
        composition: "",
      })
    }
    setError("")
  }, [mesh, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) {
      setError("Nome é obrigatório")
      return
    }

    if (!formData.composition.trim()) {
      setError("Composição é obrigatória")
      return
    }

    try {
      let result
      if (mesh) {
        result = await update(mesh.id, { ...formData, id: mesh.id })
      } else {
        result = await create(formData)
      }

      if (result.success) {
        onSuccess()
      } else {
        setError(result.error || "Erro ao salvar tipo de malha")
      }
    } catch (err) {
      setError("Erro inesperado")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mesh ? "Editar Tipo de Malha" : "Novo Tipo de Malha"}</DialogTitle>
          <DialogDescription>
            {mesh
              ? "Edite as informações do tipo de malha abaixo."
              : "Preencha as informações para criar um novo tipo de malha."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome do tipo de malha"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="composition">Composição *</Label>
              <Textarea
                id="composition"
                value={formData.composition}
                onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
                placeholder="Composição da malha (ex: 100% algodão)"
                rows={3}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : mesh ? "Salvar Alterações" : "Criar Tipo de Malha"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
