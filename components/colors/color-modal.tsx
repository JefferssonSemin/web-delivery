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
import { useColors } from "@/hooks/use-colors"
import type { Color } from "@/types/color"
import { AlertCircle } from "lucide-react"

interface ColorModalProps {
  isOpen: boolean
  onClose: () => void
  color?: Color | null
  onSuccess: () => void
}

export default function ColorModal({ isOpen, onClose, color, onSuccess }: ColorModalProps) {
  const { create, update, loading } = useColors()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    if (color) {
      setFormData({
        name: color.name,
        description: color.description,
      })
    } else {
      setFormData({
        name: "",
        description: "",
      })
    }
    setError("")
  }, [color, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) {
      setError("Nome é obrigatório")
      return
    }

    try {
      let result
      if (color) {
        result = await update(color.id, { ...formData, id: color.id })
      } else {
        result = await create(formData)
      }

      if (result.success) {
        onSuccess()
      } else {
        setError(result.error || "Erro ao salvar cor")
      }
    } catch (err) {
      setError("Erro inesperado")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{color ? "Editar Cor" : "Nova Cor"}</DialogTitle>
          <DialogDescription>
            {color ? "Edite as informações da cor abaixo." : "Preencha as informações para criar uma nova cor."}
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
                placeholder="Nome da cor"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição da cor"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : color ? "Salvar Alterações" : "Criar Cor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
