// Configurações da API
export const API_CONFIG = {
  // URL base da API - ajuste conforme necessário
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  // Endpoints
  ENDPOINTS: {
    LOGIN: "/api/v1/Login",
    USERS: "/User",
    USER_BY_ID: (id: string) => `/User/${id}`,
    HEALTH: "/api/v1/health", // Para verificar status da API
  },

  // Configurações de timeout
  TIMEOUT: 10000, // 10 segundos

  // Configurações de retry
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
}

// Função para verificar se estamos em desenvolvimento
export const isDevelopment = process.env.NODE_ENV === "development"

// Função para log de debug (apenas em desenvolvimento)
export const debugLog = (...args: any[]) => {
  if (isDevelopment) {
    console.log("[ERP Debug]:", ...args)
  }
}

// Função para formatar erros da API
export const formatApiError = (error: any): string => {
  if (typeof error === "string") return error
  if (error?.errors && Array.isArray(error.errors)) {
    return error.errors[0] || "Erro desconhecido"
  }
  if (error?.message) return error.message
  return "Erro desconhecido"
}
