"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCustomers } from "@/hooks/use-customers"
import type { Customer, CreateCustomerRequest } from "@/types/customer"
import { AlertCircle } from "lucide-react"

interface CustomerModalProps {
  isOpen: boolean
  onClose: () => void
  customer?: Customer | null
  onSuccess: () => void
}

export default function CustomerModal({ isOpen, onClose, customer, onSuccess }: CustomerModalProps) {
  const { createCustomer, updateCustomer, loading } = useCustomers()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    dateOfBirth: "",
    address: {
      cep: "",
      city: "",
      uf: "",
      address: "",
      number: "",
      complement: "",
    },
  })
  const [error, setError] = useState("")

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email || "",
        cpf: customer.cpf || "",
        phone: customer.phone || "",
        dateOfBirth: customer.dateOfBirth || "",
        address: {
          cep: customer.address?.cep || "",
          city: customer.address?.city || "",
          uf: customer.address?.uf || "",
          address: customer.address?.address || "",
            number: customer.address?.number || "",
          complement: customer.address?.complement || "",
        },
      })
    } else {
      setFormData({
        name: "",
        email: "",
        cpf: "",
        phone: "",
        dateOfBirth: "",
        address: {
          cep: "",
          city: "",
          uf: "",
          address: "",
          number: "",
          complement: "",
        },
      })
    }
    setError("")
  }, [customer, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name) {
      setError("Preencha todos os campos obrigatórios")
      return
    }

    try {
      const customerData: CreateCustomerRequest = {
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth || undefined,
        address: formData.address,
      }

      let result
      if (customer) {
        result = await updateCustomer(customer.id, { ...customerData, id: customer.id })
      } else {
        result = await createCustomer(customerData)
      }

      if (result.success) {
        onSuccess()
      } else {
        setError(result.error || "Erro ao salvar cliente")
      }
    } catch (err) {
      setError("Erro inesperado")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("address.")) {
      const addressField = field.replace("address.", "")
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{customer ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
          <DialogDescription>
            {customer
              ? "Edite as informações do cliente abaixo."
              : "Preencha as informações para criar um novo cliente."}
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

            {/* Dados Pessoais */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Dados Pessoais</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Nome completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange("cpf", e.target.value)}
                    placeholder="000.000.000-00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Endereço</h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={formData.address.cep}
                    onChange={(e) => handleInputChange("address.cep", e.target.value)}
                    placeholder="00000-000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={formData.address.city}
                    onChange={(e) => handleInputChange("address.city", e.target.value)}
                    placeholder="Nome da cidade"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="uf">UF</Label>
                  <Input
                    id="uf"
                    value={formData.address.uf}
                    onChange={(e) => handleInputChange("address.uf", e.target.value)}
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={formData.address.address}
                    onChange={(e) => handleInputChange("address.address", e.target.value)}
                    placeholder="Nome da rua"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    value={formData.address.number}
                    onChange={(e) => handleInputChange("address.number", e.target.value)}
                    placeholder="123"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  value={formData.address.complement}
                  onChange={(e) => handleInputChange("address.complement", e.target.value)}
                  placeholder="Apartamento, sala, etc."
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : customer ? "Salvar Alterações" : "Criar Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
