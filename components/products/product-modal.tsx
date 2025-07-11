"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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
import { useProducts } from "@/hooks/use-products"
import type { Product } from "@/types/product"
import { AlertCircle } from "lucide-react"

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product?: Product | null
  onSuccess: () => void
  materials: any[]
}

export default function ProductModal({ isOpen, onClose, product, onSuccess, materials }: ProductModalProps) {
  const { create, update, loading } = useProducts()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isSet: false,
    materialId: "",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        isSet: product.isSet,
        materialId: product.materialId,
      })
    } else {
      setFormData({
        name: "",
        description: "",
        isSet: false,
        materialId: "",
      })
    }
    setError("")
  }, [product, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) {
      setError("Nome é obrigatório")
      return
    }

    if (!formData.materialId) {
      setError("Material é obrigatório")
      return
    }

    try {
      console.log("[ProductModal] Dados do formulário:", formData)

      let result
      if (product) {
        result = await update(product.id, {
          ...formData, id: product.id,
          cod: ""
        })
      } else {
        result = await create({ ...formData, cod: "" })
      }

      console.log("[ProductModal] Resultado:", result)

      if (result.success) {
        onSuccess()
      } else {
        setError(result.error || "Erro ao salvar produto")
      }
    } catch (err) {
      console.error("[ProductModal] Erro:", err)
      setError("Erro inesperado")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{product ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          <DialogDescription>
            {product
              ? "Edite as informações do produto abaixo."
              : "Preencha as informações para criar um novo produto."}
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
                placeholder="Nome do produto"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição do produto"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isSet"
                checked={formData.isSet}
                onCheckedChange={(checked) => setFormData({ ...formData, isSet: checked as boolean })}
              />
              <Label htmlFor="isSet">É um conjunto</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="materialId">Material *</Label>
                <Select
                  value={String(formData.materialId)}
                  onValueChange={(value) => {
                    console.log("[ProductModal] Selecionando material:", value)
                    setFormData({ ...formData, materialId: value })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">Nenhum material encontrado</div>
                    ) : (
                      materials.map((material) => (
                        <SelectItem key={material.id} value={String(material.id)}>
                          {material.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {materials.length === 0 && (
                  <p className="text-sm text-muted-foreground">Cadastre primeiro um material na seção "Materiais"</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : product ? "Salvar Alterações" : "Criar Produto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
