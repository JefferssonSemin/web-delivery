export interface ProductVariation {
  id: string
  name: string
  isCap: boolean
  isPocket: boolean
  withRib: boolean
  gender: number
  enable: boolean
  productId: string
  sizeId: string
  product?: {
    id: string
    name: string
  }
  size?: {
    id: string
    name: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface CreateProductVariationRequest {
  name: string
  isCap: boolean
  isPocket: boolean
  withRib: boolean
  gender: number
  enable: boolean
  productId: string
  sizeId: string
}

export interface UpdateProductVariationRequest extends CreateProductVariationRequest {
  id: string
}

// Enum para gênero
export enum Gender {
  MASCULINO = 1,
  FEMININO = 2,
  UNISSEX = 3,
  INFANTIL = 4,
}

// Função para obter o label do gênero
export function getGenderLabel(gender: number): string {
  switch (gender) {
    case Gender.MASCULINO:
      return "Masculino"
    case Gender.FEMININO:
      return "Feminino"
    case Gender.UNISSEX:
      return "Unissex"
    case Gender.INFANTIL:
      return "Infantil"
    default:
      return "Desconhecido"
  }
}
