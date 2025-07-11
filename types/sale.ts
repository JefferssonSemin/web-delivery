export interface Sale {
  id: string
  sku: string | null
  quantityItems: number
  value: number
  discount: number
  status: number
  saleDate: string
  customerId: string
  userId: string
  productVariationId: string
  customer?: {
    id: string
    name: string
    cpf: string
  }
  user?: {
    id: string
    userName: string
  }
  productVariation?: {
    id: string
    name: string
    sku: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface CreateSaleRequest {
  sku: string | null
  quantityItems: number
  value: number
  discount: number
  status: number
  saleDate: string
  customerId: string
  userId: string
  productVariationId: string
}

export interface UpdateSaleRequest extends CreateSaleRequest {
  id: string
}

export interface SaleResponse {
  id: string
  sku: string | null
  quantityItems: number
  value: number
  discount: number
  status: number
  saleDate: string
  customerId: string
  userId: string
  productVariationId: string
  customer?: {
    id: string
    name: string
    cpf: string
  }
  user?: {
    id: string
    userName: string
  }
  productVariation?: {
    id: string
    name: string
    sku: string
  }
  createdAt?: string
  updatedAt?: string
}

// Enum para status da venda
export enum SaleStatus {
  PENDING = 1,
  CONFIRMED = 2,
  SHIPPED = 3,
  DELIVERED = 4,
  CANCELLED = 5,
}

// Função para obter o label do status
export function getSaleStatusLabel(status: number): string {
  switch (status) {
    case SaleStatus.PENDING:
      return "Pendente"
    case SaleStatus.CONFIRMED:
      return "Confirmada"
    case SaleStatus.SHIPPED:
      return "Enviada"
    case SaleStatus.DELIVERED:
      return "Entregue"
    case SaleStatus.CANCELLED:
      return "Cancelada"
    default:
      return "Desconhecido"
  }
}

// Função para obter a variante do badge do status
export function getSaleStatusVariant(status: number): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case SaleStatus.PENDING:
      return "secondary"
    case SaleStatus.CONFIRMED:
      return "default"
    case SaleStatus.SHIPPED:
      return "outline"
    case SaleStatus.DELIVERED:
      return "default"
    case SaleStatus.CANCELLED:
      return "destructive"
    default:
      return "secondary"
  }
}
