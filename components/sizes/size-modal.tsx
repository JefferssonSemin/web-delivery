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
import { useSizes } from "@/hooks/use-sizes"
import type { Size } from "@/types/size"
import { AlertCircle } from "lucide-react"

interface SizeModalProps {
  isOpen: boolean
  onClose: () => void
  size?: Size | null
  onSuccess: () => void
  meshes: any[]
}

export default function SizeModal({ isOpen, onClose, size, onSuccess, meshes }: SizeModalProps) {
  const { create, update, loading } = useSizes()
  const [formData, setFormData] = useState({
    name: "",
    weight: 0,
    width: 0,
    height: 0,
    length: 0,
    meshTypeId: "",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    if (size) {
      setFormData({
        name: size.name,
        weight: size.weight,
        width: size.width,
        height: size.height,
        length: size.length,
        meshTypeId: size.meshTypeId,
      })
    } else {
      setFormData({
        name: "",
        weight: 0,
        width: 0,
        height: 0,
        length: 0,
        meshTypeId: "",
      })
    }
    setError("")
  }, [size, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) {
      setError("Nome é obrigatório")
      return
    }

    if (!formData.meshTypeId) {
      setError("Tipo de malha é obrigatório")
      return
    }

    try {
      console.log("[SizeModal] Dados do formulário:", formData)

      let result
      if (size) {
        result = await update(size.id, { ...formData, id: size.id })
      } else {
        result = await create(formData)
      }

      console.log("[SizeModal] Resultado:", result)

      if (result.success) {
        onSuccess()
      } else {
        setError(result.error || "Erro ao salvar tamanho")
      }
    } catch (err) {
      console.error("[SizeModal] Erro:", err)
      setError("Erro inesperado")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{size ? "Editar Tamanho" : "Novo Tamanho"}</DialogTitle>
          <DialogDescription>
            {size ? "Edite as informações do tamanho abaixo." : "Preencha as informações para criar um novo tamanho."}
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
                placeholder="Nome do tamanho"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (g) *</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="width">Largura (cm) *</Label>
                <Input
                  id="width"
                  type="number"
                  value={formData.width}
                  onChange={(e) => setFormData({ ...formData, width: Number(e.target.value) })}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm) *</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="length">Comprimento (cm) *</Label>
                <Input
                  id="length"
                  type="number"
                  value={formData.length}
                  onChange={(e) => setFormData({ ...formData, length: Number(e.target.value) })}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meshTypeId">Tipo de Malha *</Label>
              <Select
                value={formData.meshTypeId}
                onValueChange={(value) => {
                  console.log("[SizeModal] Selecionando malha:", value)
                  setFormData({ ...formData, meshTypeId: value })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de malha" />
                </SelectTrigger>
                <SelectContent>
                  {meshes.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">Nenhum tipo de malha encontrado</div>
                  ) : (
                    meshes.map((mesh) => (
                      <SelectItem key={mesh.id} value={mesh.id}>
                        {mesh.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {meshes.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Cadastre primeiro um tipo de malha na seção "Tipos de Malha"
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : size ? "Salvar Alterações" : "Criar Tamanho"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
