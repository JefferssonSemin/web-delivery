"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Plus, Edit, Trash2, RefreshCw } from "lucide-react"

interface Column<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
}

interface CrudManagementProps<T> {
  title: string
  description: string
  items: T[]
  loading: boolean
  error: string | null
  columns: Column<T>[]
  searchFields: string[]
  onFetch: () => void
  onAdd: () => void
  onEdit: (item: T) => void
  onDelete: (id: string, name?: string) => void
  renderModal?: React.ReactNode
}

export default function CrudManagement<T extends { id: string; name?: string }>({
  title,
  description,
  items,
  loading,
  error,
  columns,
  searchFields,
  onFetch,
  onAdd,
  onEdit,
  onDelete,
  renderModal,
}: CrudManagementProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    onFetch()
  }, [onFetch])

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items

    return items.filter((item) =>
      searchFields.some((field) => {
        const value = (item as any)[field]
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      }),
    )
  }, [items, searchTerm, searchFields])

  const handleRefresh = () => {
    onFetch()
  }

  // Debug: log para verificar os dados
  console.log(`[${title}] Items:`, items)
  console.log(`[${title}] Filtered Items:`, filteredItems)
  console.log(`[${title}] Loading:`, loading)
  console.log(`[${title}] Error:`, error)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              <Button onClick={onAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Novo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Badge variant="secondary">{filteredItems.length} itens</Badge>
          </div>

          {error && (
            <Alert className="mb-4">
              <AlertDescription>Erro: {error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column.key}>{column.label}</TableHead>
                    ))}
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">
                        {items.length === 0 ? "Nenhum item encontrado" : "Nenhum resultado para a pesquisa"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        {columns.map((column) => (
                          <TableCell key={column.key}>
                            {column.render ? column.render(item) : (item as any)[column.key]}
                          </TableCell>
                        ))}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => onDelete(item.id, item.name)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {renderModal}
    </div>
  )
}
