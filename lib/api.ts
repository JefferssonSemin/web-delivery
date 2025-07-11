import type { CreateUserRequest, UpdateUserRequest, ApiUser, ProblemDetails } from "@/types/user"

interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl

    // Recuperar token do localStorage se disponível
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token")
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("token", token)
      } else {
        localStorage.removeItem("token")
      }
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    return headers
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const config: RequestInit = {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      }

      console.log(`[API] ${options.method || "GET"} ${url}`, config.body ? JSON.parse(config.body as string) : "")

      const response = await fetch(url, config)

      if (!response.ok) {
        // Tentar extrair mensagem de erro da resposta
        try {
          const errorData: ProblemDetails = await response.json()
          const errorMessage =
            errorData.errors && errorData.errors.length > 0 ? errorData.errors[0] : `Erro HTTP: ${response.status}`

          return {
            success: false,
            error: errorMessage,
          }
        } catch {
          return {
            success: false,
            error: `Erro HTTP: ${response.status}`,
          }
        }
      }

      // Verificar se há conteúdo na resposta
      const contentType = response.headers.get("content-type")
      let data = null

      if (contentType && contentType.includes("application/json")) {
        const text = await response.text()
        if (text) {
          data = JSON.parse(text)
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      console.error("Erro na requisição:", error)
      return {
        success: false,
        error: "Erro de conexão com o servidor",
      }
    }
  }

  // Métodos específicos para usuários
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<ApiUser>> {
    return this.request<ApiUser>("/User", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async getUsers(): Promise<ApiResponse<ApiUser[]>> {
    return this.request<ApiUser[]>("/User", { method: "GET" })
  }

  async getUserById(id: string): Promise<ApiResponse<ApiUser>> {
    return this.request<ApiUser>(`/User/${id}`, { method: "GET" })
  }

  async updateUser(userData: UpdateUserRequest): Promise<ApiResponse<ApiUser>> {
    return this.request<ApiUser>("/User", {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  }

  // Métodos de conveniência genéricos
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

// Instância singleton do cliente API
export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || "")

// Hook para usar o cliente API com token atualizado
export function useApiClient() {
  const updateToken = (token: string | null) => {
    apiClient.setToken(token)
  }

  return {
    apiClient,
    updateToken,
  }
}
