export interface Material {
  id: string
  name?: string
  supplie: string | null
  inside: number
  meshTypeId: string
  colorId: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateMaterialRequest {
  name: string | null
  supplie: string | null
  inside: number
  meshTypeId: string
  colorId: string
}

export interface UpdateMaterialRequest extends CreateMaterialRequest {
  id: string
}
