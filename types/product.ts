export interface Product {
  id: string
  cod: string
  name: string
  description: string
  isSet: boolean
  materialId: string
  material?: {
    id: string
    name: string
  }

  variationsCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateProductRequest {
  cod: string
  name: string
  description: string
  isSet: boolean
  materialId: string
}

export interface UpdateProductRequest extends CreateProductRequest {
  id: string
}
