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
import { useSales } from "@/hooks/use-sales"
import { useAuth } from "@/hooks/use-auth"
import type { Sale } from "@/types/sale"
import { SaleStatus, getSaleStatusLabel } from "@/types/sale"
import { AlertCircle } from "lucide-react"

interface SaleModalProps {
  isOpen: boolean
  onClose: () => void
  sale?: Sale | null
  onSuccess: () => void
  customers: any[]
  productVariations: any[]
}

export default function SaleModal({ isOpen, onClose, sale, onSuccess, customers, productVariations }: SaleModalProps) {
  const { create, update, loading } = useSales()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    sku: "",
    quantityItems: 1,
    value: 0,
    discount: 0,
    status: SaleStatus.PENDING,
    customerId: "",
    userId: "",
    productVariationId: "",
    saleDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  })
  const [error, setError] = useState("")

  useEffect(() => {
    if (sale) {
      setFormData({
        sku: sale.sku || "",
        quantityItems: sale.quantityItems,
        value: sale.value,
        discount: sale.discount,
        status: sale.status,
        customerId: sale.customerId,
        userId: sale.userId,
        productVariationId: sale.productVariationId,
        saleDate: sale.saleDate ? sale.saleDate.split('T')[0] : new Date().toISOString().split('T')[0],
      })
    } else {
      setFormData({
        sku: "",
        quantityItems: 1,
        value: 0,
        discount: 0,
        status: SaleStatus.PENDING,
        customerId: "",
        userId: user?.id || "",
        productVariationId: "",
        saleDate: new Date().toISOString().split('T')[0],
      })
    }
    setError("")
  }, [sale, isOpen, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.customerId) {
      setError("Cliente é obrigatório")
      return
    }

    if (!formData.productVariationId) {
      setError("Variação do produto é obrigatória")
      return
    }

    if (formData.quantityItems <= 0) {
      setError("Quantidade deve ser maior que zero")
      return
    }

    if (formData.value <= 0) {
      setError("Valor deve ser maior que zero")
      return
    }

    if (formData.discount < 0) {
      setError("Desconto não pode ser negativo")
      return
    }

    if (formData.discount >= formData.value) {
      setError("Desconto não pode ser maior ou igual ao valor")
      return
    }

    try {
      const saleData = {
        sku: formData.sku || null,
        quantityItems: formData.quantityItems,
        value: formData.value,
        discount: formData.discount,
        status: formData.status,
        customerId: formData.customerId,
        userId: formData.userId || user?.id || "",
        productVariationId: formData.productVariationId,
        saleDate: formData.saleDate,
      }

      console.log("[SaleModal] Dados do formulário:", saleData)

      let result
      if (sale) {
        result = await update(sale.id, { ...saleData, id: sale.id })
      } else {
        result = await create(saleData)
      }

      console.log("[SaleModal] Resultado:", result)

      if (result.success) {
        onSuccess()
      } else {
        setError(result.error || "Erro ao salvar venda")
      }
    } catch (err) {
      console.error("[SaleModal] Erro:", err)
      setError("Erro inesperado")
    }
  }

  const totalValue = formData.value - formData.discount

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{sale ? "Editar Venda" : "Nova Venda"}</DialogTitle>
          <DialogDescription>
            {sale ? "Edite as informações da venda abaixo." : "Preencha as informações para criar uma nova venda."}
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="Código SKU (opcional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantityItems">Quantidade *</Label>
                <Input
                  id="quantityItems"
                  type="number"
                  value={formData.quantityItems}
                  onChange={(e) => setFormData({ ...formData, quantityItems: Number(e.target.value) })}
                  placeholder="1"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerId">Cliente *</Label>
              <Select
                value={String(formData.customerId)}
                onValueChange={(value) => {
                  console.log("[SaleModal] Selecionando cliente:", value)
                  setFormData({ ...formData, customerId: value })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">Nenhum cliente encontrado</div>
                  ) : (
                    customers.map((customer) => (
                      <SelectItem key={customer.id} value={String(customer.id)}>
                        {customer.name} - {customer.email}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {customers.length === 0 && (
                <p className="text-sm text-muted-foreground">Cadastre primeiro um cliente na seção "Clientes"</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="productVariationId">Variação do Produto *</Label>
              <Select
                value={String(formData.productVariationId)}
                onValueChange={(value) => {
                  console.log("[SaleModal] Selecionando variação do produto:", value)
                  setFormData({ ...formData, productVariationId: value })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a variação do produto" />
                </SelectTrigger>
                <SelectContent>
                  {productVariations.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">Nenhuma variação encontrada</div>
                  ) : (
                    productVariations.map((variation) => (
                      <SelectItem key={variation.id} value={String(variation.id)}>
                        {variation.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {productVariations.length === 0 && (
                <p className="text-sm text-muted-foreground">Cadastre primeiro uma variação de produto na seção "Variações de Produto"</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Valor (R$) *</Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Desconto (R$)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="saleDate">Data da Venda *</Label>
                <Input
                  id="saleDate"
                  type="date"
                  value={formData.saleDate}
                  onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status.toString()}
                  onValueChange={(value) => {
                    console.log("[SaleModal] Selecionando status:", value)
                    setFormData({ ...formData, status: Number(value) })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SaleStatus)
                      .filter((value) => typeof value === "number")
                      .map((status) => (
                        <SelectItem key={status} value={status.toString()}>
                          {getSaleStatusLabel(status)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Resumo da venda */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-gray-900">Resumo da Venda</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Valor:</span>
                  <span>R$ {formData.value.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Desconto:</span>
                  <span>- R$ {formData.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2 col-span-2">
                  <span>Total:</span>
                  <span>R$ {totalValue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : sale ? "Salvar Alterações" : "Criar Venda"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
