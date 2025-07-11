export interface LoginRequest {
  userName: string
  password: string
}

export interface LoginResponse {
  userName: string | null
  token: string | null
}

export interface AuthError {
  errors: string[] | null
}

export interface User {
  id: string
  userName: string
  name: string
  token: string
}
