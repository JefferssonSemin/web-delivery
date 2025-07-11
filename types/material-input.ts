export interface MaterialInput {
  id: string
  meters: number
  weight: number
  totalPrice: number
  materialId: string
  material?: {
    id: string
    name: string
    supplie: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface CreateMaterialInputRequest {
  meters: number
  weight: number
  totalPrice: number
  materialId: string
}

export interface UpdateMaterialInputRequest extends CreateMaterialInputRequest {
  id: string
}
