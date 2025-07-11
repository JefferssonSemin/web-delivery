export interface Size {
  id: string
  name: string
  weight: number
  width: number
  height: number
  length: number
  meshTypeId: string
  meshType?: {
    id: string
    name: string
    composition: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface CreateSizeRequest {
  name: string
  weight: number
  width: number
  height: number
  length: number
  meshTypeId: string
}

export interface UpdateSizeRequest extends CreateSizeRequest {
  id: string
}
