"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useUsers } from "@/hooks/use-users"
import type { User, CreateUserData } from "@/types/user"
import { Plus, Edit, Trash2, Search, AlertCircle, CheckCircle } from "lucide-react"

export default function UserManagement() {
  const { users, loading, apiAvailable, createUser, updateUser, deleteUser, fetchUsers } = useUsers()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    role: "user" as "admin" | "user" | "manager",
  })
  const [formError, setFormError] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        userName: user.userName,
        password: "", // Não mostrar senha existente
        role: user.role,
      })
    } else {
      setEditingUser(null)
      setFormData({
        userName: "",
        password: "",
        role: "user",
      })
    }
    setFormError("")
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingUser(null)
    setFormError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    if (!formData.userName) {
      setFormError("Nome de usuário é obrigatório")
      return
    }

    if (!editingUser && !formData.password) {
      setFormError("Senha é obrigatória para novos usuários")
      return
    }

    try {
      if (editingUser) {
        // Atualizar usuário existente
        await updateUser(editingUser.id, {
          userName: formData.userName,
          role: formData.role,
        })
      } else {
        // Criar novo usuário
        const createData: CreateUserData = {
          userName: formData.userName,
          password: formData.password,
          role: formData.role,
        }
        await createUser(createData)
      }
      handleCloseDialog()
    } catch (error: any) {
      setFormError(error.message || "Erro ao salvar usuário. Tente novamente.")
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await deleteUser(id)
      } catch (error) {
        alert("Erro ao excluir usuário")
      }
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "manager":
        return "default"
      default:
        return "secondary"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador"
      case "manager":
        return "Gerente"
      default:
        return "Usuário"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
          <p className="text-gray-600">Gerencie os usuários do sistema</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingUser ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
              <DialogDescription>
                {editingUser
                  ? "Edite as informações do usuário abaixo."
                  : "Preencha as informações para criar um novo usuário."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {formError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="userName">Nome de Usuário</Label>
                  <Input
                    id="userName"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    placeholder="nome.usuario"
                    required
                  />
                </div>

                {!editingUser && (
                  <div className="grid gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Digite a senha"
                      required
                    />
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="role">Função</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: "admin" | "user" | "manager") => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="manager">Gerente</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : editingUser ? "Salvar Alterações" : "Criar Usuário"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status da API */}
      <div className="flex items-center space-x-2">
        {apiAvailable ? (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Conectado à API</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-orange-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Modo offline - usando dados locais</span>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>Total de {users.length} usuários cadastrados</CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome de Usuário</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.userName}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>{getRoleLabel(user.role)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "destructive"}>
                        {user.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {searchTerm ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
