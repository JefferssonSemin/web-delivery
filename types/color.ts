export interface Color {
  id: string
  name: string
  description: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateColorRequest {
  name: string
  description: string
}

export interface UpdateColorRequest extends CreateColorRequest {
  id: string
}
