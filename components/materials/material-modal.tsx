"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useMaterials } from "@/hooks/use-materials"
import type { Material } from "@/types/material"
import { AlertCircle } from "lucide-react"

interface MaterialModalProps {
  isOpen: boolean
  onClose: () => void
  material?: Material | null
  onSuccess: () => void
  meshes: any[]
  colors: any[]
}

export default function MaterialModal({ isOpen, onClose, material, onSuccess, meshes, colors }: MaterialModalProps) {
  const { create, update, loading } = useMaterials()
  const [formData, setFormData] = useState({
    name: "",
    supplie: "",
    inside: 1,
    meshTypeId: "",
    colorId: "",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    if (material) {
      setFormData({
        name: material.name || "",
        supplie: material.supplie || "",
        inside: material.inside,
        meshTypeId: material.meshTypeId,
        colorId: material.colorId,
      })
    } else {
      setFormData({
        name: "",
        supplie: "",
        inside: 1,
        meshTypeId: "",
        colorId: "",
      })
    }
    setError("")
  }, [material, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.meshTypeId) {
      setError("Tipo de malha é obrigatório")
      return
    }

    if (!formData.colorId) {
      setError("Cor é obrigatória")
      return
    }

    if (formData.inside <= 0) {
      setError("Quantidade interna deve ser maior que zero")
      return
    }

    try {
      const materialData = {
        name: formData.name.trim() || null,
        supplie: formData.supplie.trim() || null,
        inside: formData.inside,
        meshTypeId: formData.meshTypeId,
        colorId: formData.colorId,
      }

      let result
      if (material) {
        result = await update(material.id, { ...materialData, id: material.id })
      } else {
        result = await create(materialData)
      }

      if (result.success) {
        onSuccess()
      } else {
        setError(result.error || "Erro ao salvar material")
      }
    } catch (err) {
      setError("Erro inesperado")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{material ? "Editar Material" : "Novo Material"}</DialogTitle>
          <DialogDescription>
            {material
              ? "Edite as informações do material abaixo."
              : "Preencha as informações para criar um novo material."}
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
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome do material (opcional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplie">Fornecedor</Label>
              <Input
                id="supplie"
                value={formData.supplie}
                onChange={(e) => setFormData({ ...formData, supplie: e.target.value })}
                placeholder="Nome do fornecedor (opcional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inside">Quantidade Interna *</Label>
              <Input
                id="inside"
                type="number"
                value={formData.inside}
                onChange={(e) => setFormData({ ...formData, inside: Number(e.target.value) })}
                placeholder="1"
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meshTypeId">Tipo de Malha *</Label>
              <Select
                value={formData.meshTypeId}
                onValueChange={(value) => setFormData({ ...formData, meshTypeId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de malha" />
                </SelectTrigger>
                <SelectContent>
                  {meshes.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">Nenhum tipo de malha encontrado</div>
                  ) : (
                    meshes.map((mesh) => (
                      <SelectItem key={mesh.id} value={String(mesh.id)}>
                        {mesh.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {meshes.length === 0 && (
                <p className="text-sm text-muted-foreground">Cadastre primeiro um tipo de malha na seção "Malhas"</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="colorId">Cor *</Label>
              <Select
                value={formData.colorId}
                onValueChange={(value) => setFormData({ ...formData, colorId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a cor" />
                </SelectTrigger>
                <SelectContent>
                  {colors.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">Nenhuma cor encontrada</div>
                  ) : (
                    colors.map((color) => (
                      <SelectItem key={color.id} value={String(color.id)}>
                        {color.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {colors.length === 0 && (
                <p className="text-sm text-muted-foreground">Cadastre primeiro uma cor na seção "Cores"</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : material ? "Salvar Alterações" : "Criar Material"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
