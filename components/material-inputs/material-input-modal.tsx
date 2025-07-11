"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMaterialInputs } from "@/hooks/use-material-inputs"
import type { MaterialInput, CreateMaterialInputRequest, UpdateMaterialInputRequest } from "@/types/material-input"
import type { Material } from "@/types/material"

interface MaterialInputModalProps {
  isOpen: boolean
  onClose: () => void
  materialInput?: MaterialInput | null
  onSuccess: () => void
  materials: Material[]
}

export default function MaterialInputModal({
  isOpen,
  onClose,
  materialInput,
  onSuccess,
  materials,
}: MaterialInputModalProps) {
  const { create, update } = useMaterialInputs()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    materialId: "",
    meters: 0,
    weight: 0,
    totalPrice: 0,
  })

  useEffect(() => {
    if (materialInput) {
      setFormData({
        materialId: materialInput.materialId,
        meters: materialInput.meters,
        weight: materialInput.weight,
        totalPrice: materialInput.totalPrice,
      })
    } else {
      setFormData({
        materialId: "",
        meters: 0,
        weight: 0,
        totalPrice: 0,
      })
    }
  }, [materialInput])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let result
      if (materialInput) {
        const updateData: UpdateMaterialInputRequest = {
          id: materialInput.id,
          ...formData,
        }
        result = await update(materialInput.id, updateData)
      } else {
        const createData: CreateMaterialInputRequest = formData
        result = await create(createData)
      }

      if (result.success) {
        onSuccess()
      } else {
        alert(`Erro ao ${materialInput ? "atualizar" : "criar"} entrada de material: ${result.error}`)
      }
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro inesperado")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{materialInput ? "Editar Entrada de Material" : "Nova Entrada de Material"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="materialId">Material</Label>
            <Select value={String(formData.materialId)} onValueChange={(value) => handleInputChange("materialId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um material" />
              </SelectTrigger>
              <SelectContent>
                {materials.map((material) => (
                  <SelectItem key={material.id} value={String(material.id)}>
                    {material.name} - {material.supplie}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meters">Metros</Label>
            <Input
              id="meters"
              type="number"
              step="0.01"
              value={formData.meters}
              onChange={(e) => handleInputChange("meters", Number.parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.01"
              value={formData.weight}
              onChange={(e) => handleInputChange("weight", Number.parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalPrice">Preço Total</Label>
            <Input
              id="totalPrice"
              type="number"
              step="0.01"
              value={formData.totalPrice}
              onChange={(e) => handleInputChange("totalPrice", Number.parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : materialInput ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
