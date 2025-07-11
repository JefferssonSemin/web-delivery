// Tipos baseados na API real
export interface ApiUser {
  userName: string | null
  role: string | null
  token?: string | null // Presente em algumas respostas
}

export interface CreateUserRequest {
  userName: string | null
  password: string | null
  role: string | null
}

export interface UpdateUserRequest {
  userName: string | null
  role: string | null
}

export interface ApiUserResponse {
  userName: string | null
  role: string | null
}

export interface ProblemDetails {
  errors: string[] | null
}

// Tipo interno para o frontend (mantendo compatibilidade)
export interface User {
  id: string
  name: string
  email: string
  userName: string
  role: "admin" | "user" | "manager"
  status: "active" | "inactive"
  createdAt: string
}

export interface CreateUserData {
  userName: string
  password: string
  role: string
}

// Função para converter ApiUser para User interno
export function mapApiUserToUser(apiUser: ApiUser, id?: string): User {
  return {
    id: id || Date.now().toString(),
    name: apiUser.userName || "Usuário",
    email: `${apiUser.userName}@loja.com`, // Simulado
    userName: apiUser.userName || "",
    role: (apiUser.role as "admin" | "user" | "manager") || "user",
    status: "active",
    createdAt: new Date().toISOString(),
  }
}

// Função para converter User interno para API
export function mapUserToApiUser(user: User): UpdateUserRequest {
  return {
    userName: user.userName,
    role: user.role,
  }
}
