export interface Mesh {
  id: string
  name: string
  composition: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateMeshRequest {
  name: string
  composition: string
}

export interface UpdateMeshRequest extends CreateMeshRequest {
  id: string
}
