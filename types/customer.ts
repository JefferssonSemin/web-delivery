export interface Address {
  cep: string
  city: string
  uf: string
  address: string
  number: string
  complement?: string
}

export interface Customer {
  id: string
  name: string
  email?: string
  cpf?: string
  phone?: string
  dateOfBirth?: string
  address?: Address
  createdAt: string
  updatedAt?: string
}

export interface CreateCustomerRequest {
  name: string
  email?: string
  cpf?: string
  phone?: string
  dateOfBirth?: string
  address?: Address
}

export interface UpdateCustomerRequest extends CreateCustomerRequest {
  id: string
}

export interface CustomerResponse {
  id: string
  name: string
  email: string
  cpf: string
  phone: string
  dateOfBirth?: string
  address: Address
  createdAt: string
  updatedAt?: string
}
