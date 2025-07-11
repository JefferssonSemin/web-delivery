"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useCustomers } from "@/hooks/use-customers"
import CustomerModal from "./customer-modal"
import type { Customer } from "@/types/customer"
import { Plus, Edit, Trash2, Search, AlertCircle, RefreshCw } from "lucide-react"

export default function CustomerManagement() {
  const { customers, loading, error, fetchCustomers, deleteCustomer } = useCustomers()
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.cpf.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleOpenModal = (customer?: Customer) => {
    setEditingCustomer(customer || null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCustomer(null)
  }

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente "${name}"?`)) {
      const result = await deleteCustomer(id)
      if (!result.success) {
        alert(`Erro ao excluir cliente: ${result.error}`)
      }
    }
  }

  const handleRefresh = () => {
    fetchCustomers()
  }

  const formatCPF = (cpf: string) => {
    if (!cpf) return ""
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const formatPhone = (phone: string) => {
    if (!phone) return ""
    if (phone.length === 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    } else if (phone.length === 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
    }
    return phone
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Clientes</h1>
          <p className="text-gray-600">Gerencie os clientes do sistema</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button variant="link" className="ml-2 p-0 h-auto" onClick={handleRefresh}>
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>
                Total de {customers.length} clientes cadastrados
                {loading && (
                  <Badge variant="secondary" className="ml-2">
                    Carregando...
                  </Badge>
                )}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name || "N/A"}</TableCell>
                      <TableCell>{formatCPF(customer.cpf)}</TableCell>
                      <TableCell>{customer.email || "N/A"}</TableCell>
                      <TableCell>{formatPhone(customer.phone)}</TableCell>
                      <TableCell>{customer.address?.city || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleOpenModal(customer)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(customer.id, customer.name)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCustomers.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        {searchTerm ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
                        {!searchTerm && (
                          <div className="mt-2">
                            <Button variant="outline" onClick={() => handleOpenModal()}>
                              <Plus className="mr-2 h-4 w-4" />
                              Criar primeiro cliente
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <CustomerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        customer={editingCustomer}
        onSuccess={() => {
          handleCloseModal()
          fetchCustomers()
        }}
      />
    </div>
  )
}
