"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useProductVariations } from "@/hooks/use-product-variations"
import type { ProductVariation } from "@/types/product-variation"
import { Gender, getGenderLabel } from "@/types/product-variation"
import { AlertCircle } from "lucide-react"

interface ProductVariationModalProps {
  isOpen: boolean
  onClose: () => void
  productVariation?: ProductVariation | null
  onSuccess: () => void
  products: any[]
  sizes: any[]
}

export default function ProductVariationModal({
  isOpen,
  onClose,
  productVariation,
  onSuccess,
  products,
  sizes,
}: ProductVariationModalProps) {
  const { create, update, loading } = useProductVariations()
  const [formData, setFormData] = useState({
    name: "",
    isCap: false,
    isPocket: false,
    withRib: false,
    gender: Gender.MASCULINO,
    enable: true,
    productId: "",
    sizeId: "",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    if (productVariation) {
      setFormData({
        name: productVariation.name,
        isCap: productVariation.isCap,
        isPocket: productVariation.isPocket,
        withRib: productVariation.withRib,
        gender: productVariation.gender,
        enable: productVariation.enable,
        productId: productVariation.productId,
        sizeId: productVariation.sizeId,
      })
    } else {
      setFormData({
        name: "",
        isCap: false,
        isPocket: false,
        withRib: false,
        gender: Gender.MASCULINO,
        enable: true,
        productId: "",
        sizeId: "",
      })
    }
    setError("")
  }, [productVariation, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) {
      setError("Nome é obrigatório")
      return
    }

    if (!formData.productId) {
      setError("Produto é obrigatório")
      return
    }

    if (!formData.sizeId) {
      setError("Tamanho é obrigatório")
      return
    }

    try {
      console.log("[ProductVariationModal] Dados do formulário:", formData)

      let result
      if (productVariation) {
        result = await update(productVariation.id, { ...formData, id: productVariation.id })
      } else {
        result = await create(formData)
      }

      console.log("[ProductVariationModal] Resultado:", result)

      if (result.success) {
        onSuccess()
      } else {
        setError(result.error || "Erro ao salvar variação de produto")
      }
    } catch (err) {
      console.error("[ProductVariationModal] Erro:", err)
      setError("Erro inesperado")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{productVariation ? "Editar Variação de Produto" : "Nova Variação de Produto"}</DialogTitle>
          <DialogDescription>
            {productVariation
              ? "Edite as informações da variação abaixo."
              : "Preencha as informações para criar uma nova variação."}
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
                placeholder="Nome da variação"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productId">Produto *</Label>
                <Select
                  value={String(formData.productId)}
                  onValueChange={(value) => {
                    console.log("[ProductVariationModal] Selecionando produto:", value)
                    setFormData({ ...formData, productId: value })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">Nenhum produto encontrado</div>
                    ) : (
                      products.map((product) => (
                        <SelectItem key={product.id} value={String(product.id)}>
                          {product.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {products.length === 0 && (
                  <p className="text-sm text-muted-foreground">Cadastre primeiro um produto na seção "Produtos"</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sizeId">Tamanho *</Label>
                <Select
                  value={String(formData.sizeId)}
                  onValueChange={(value) => {
                    console.log("[ProductVariationModal] Selecionando tamanho:", value)
                    setFormData({ ...formData, sizeId: value })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">Nenhum tamanho encontrado</div>
                    ) : (
                      sizes.map((size) => (
                        <SelectItem key={size.id} value={String(size.id)}>
                          {size.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {sizes.length === 0 && (
                  <p className="text-sm text-muted-foreground">Cadastre primeiro um tamanho na seção "Tamanhos"</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gênero</Label>
              <Select
                value={formData.gender.toString()}
                onValueChange={(value) => {
                  console.log("[ProductVariationModal] Selecionando gênero:", value)
                  setFormData({ ...formData, gender: Number(value) })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o gênero" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Gender)
                    .filter((value) => typeof value === "number")
                    .map((gender) => (
                      <SelectItem key={gender} value={gender.toString()}>
                        {getGenderLabel(gender)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Características</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isCap"
                    checked={formData.isCap}
                    onCheckedChange={(checked) => setFormData({ ...formData, isCap: checked as boolean })}
                  />
                  <Label htmlFor="isCap">É boné</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPocket"
                    checked={formData.isPocket}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPocket: checked as boolean })}
                  />
                  <Label htmlFor="isPocket">Tem bolso</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="withRib"
                    checked={formData.withRib}
                    onCheckedChange={(checked) => setFormData({ ...formData, withRib: checked as boolean })}
                  />
                  <Label htmlFor="withRib">Com punho</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enable"
                    checked={formData.enable}
                    onCheckedChange={(checked) => setFormData({ ...formData, enable: checked as boolean })}
                  />
                  <Label htmlFor="enable">Ativo</Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : productVariation ? "Salvar Alterações" : "Criar Variação"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
