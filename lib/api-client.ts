import type { LoginRequest, LoginResponse, AuthError } from "@/types/auth"
import type { CreateCustomerRequest, UpdateCustomerRequest, CustomerResponse } from "@/types/customer"
import type { Color, CreateColorRequest, UpdateColorRequest } from "@/types/color"
import type { Size, CreateSizeRequest, UpdateSizeRequest } from "@/types/size"
import type { Mesh, CreateMeshRequest, UpdateMeshRequest } from "@/types/mesh"
import type { Material, CreateMaterialRequest, UpdateMaterialRequest } from "@/types/material"
import type { MaterialInput, CreateMaterialInputRequest, UpdateMaterialInputRequest } from "@/types/material-input"
import type { Product, CreateProductRequest, UpdateProductRequest } from "@/types/product"
import type {
  ProductVariation,
  CreateProductVariationRequest,
  UpdateProductVariationRequest,
} from "@/types/product-variation"
import type { CreateSaleRequest, UpdateSaleRequest, SaleResponse } from "@/types/sale"

interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

class ApiClient {
  private baseUrl = "https://4e706072e4bf.ngrok-free.app"
  private token: string | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("erp_token")
      console.log("[API] Initialized with token:", this.token ? "Present" : "Not found")
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("erp_token", token)
        console.log("[API] Token saved to localStorage")
      } else {
        localStorage.removeItem("erp_token")
        console.log("[API] Token removed from localStorage")
      }
    }
  }

  getToken(): string | null {
    // Ensure token is loaded from localStorage if not set
    if (!this.token && typeof window !== "undefined") {
      this.token = localStorage.getItem("erp_token")
      if (this.token) {
        console.log("[API] Token loaded from localStorage")
      }
    }
    return this.token
  }

  ensureToken(): boolean {
    const token = this.getToken()
    if (!token) {
      console.error("[API] No authentication token available")
      return false
    }
    return true
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Accept-Language": "pt-BR",
    }

    const token = this.getToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
      console.log("[API] Adding Authorization header with token")
    } else {
      console.log("[API] No token available, request will be sent without Authorization header")
    }

    return headers
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      // Skip token check for login endpoint
      if (endpoint !== "/Login") {
        if (!this.ensureToken()) {
          return {
            success: false,
            error: "Token de autenticação não encontrado. Faça login novamente.",
          }
        }
      }

      const url = `${this.baseUrl}${endpoint}`
      const config: RequestInit = {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      }

      console.log(`[API] ${options.method || "GET"} ${url}`)
      if (config.body) {
        try {
          console.log("[API] Body:", JSON.parse(config.body as string))
        } catch (e) {
          console.log("[API] Body: [Could not parse]")
        }
      }

      const response = await fetch(url, config)

      if (!response.ok) {
        try {
          const errorText = await response.text()
          let errorData: AuthError
          try {
            errorData = JSON.parse(errorText)
          } catch {
            errorData = { errors: [errorText || `Erro HTTP: ${response.status}`] }
          }

          const errorMessage =
            errorData.errors && errorData.errors.length > 0 ? errorData.errors[0] : `Erro HTTP: ${response.status}`

          console.error("[API] Request failed:", errorMessage)
          return {
            success: false,
            error: errorMessage,
          }
        } catch (parseError) {
          console.error("[API] Error parsing error response:", parseError)
          return {
            success: false,
            error: `Erro HTTP: ${response.status} - ${response.statusText}`,
          }
        }
      }

      const contentType = response.headers.get("content-type")
      let data = null

      if (contentType && contentType.includes("application/json")) {
        const text = await response.text()
        if (text) {
          try {
            data = JSON.parse(text)
          } catch (parseError) {
            console.error("[API] Erro ao fazer parse do JSON:", parseError)
            return {
              success: false,
              error: "Resposta inválida do servidor",
            }
          }
        }
      }

      console.log("[API] Request successful:", data)
      return {
        success: true,
        data,
      }
    } catch (error) {
      console.error("[API] Erro na requisição:", error)
      return {
        success: false,
        error: "Erro de conexão com o servidor",
      }
    }
  }

  // Autenticação
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>("/Login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  // Clientes
  async getCustomers(): Promise<ApiResponse<CustomerResponse[]>> {
    return this.request<CustomerResponse[]>("/Customer", { method: "GET" })
  }

  async createCustomer(customer: CreateCustomerRequest): Promise<ApiResponse<CustomerResponse>> {
    return this.request<CustomerResponse>("/Customer", {
      method: "POST",
      body: JSON.stringify(customer),
    })
  }

  async updateCustomer(id: string, customer: UpdateCustomerRequest): Promise<ApiResponse<CustomerResponse>> {
    return this.request<CustomerResponse>(`/Customer/${id}`, {
      method: "PUT",
      body: JSON.stringify(customer),
    })
  }

  async deleteCustomer(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/Customer/${id}`, { method: "DELETE" })
  }

  // Cores
  async getColors(): Promise<ApiResponse<Color[]>> {
    return this.request<Color[]>("/Color", { method: "GET" })
  }

  async createColor(color: CreateColorRequest): Promise<ApiResponse<Color>> {
    return this.request<Color>("/Color", {
      method: "POST",
      body: JSON.stringify(color),
    })
  }

  async updateColor(id: string, color: UpdateColorRequest): Promise<ApiResponse<Color>> {
    return this.request<Color>(`/Color/${id}`, {
      method: "PUT",
      body: JSON.stringify(color),
    })
  }

  async deleteColor(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/Color/${id}`, { method: "DELETE" })
  }

  // Tamanhos
  async getSizes(): Promise<ApiResponse<Size[]>> {
    return this.request<Size[]>("/Size", { method: "GET" })
  }

  async createSize(size: CreateSizeRequest): Promise<ApiResponse<Size>> {
    return this.request<Size>("/Size", {
      method: "POST",
      body: JSON.stringify(size),
    })
  }

  async updateSize(id: string, size: UpdateSizeRequest): Promise<ApiResponse<Size>> {
    return this.request<Size>(`/Size/${id}`, {
      method: "PUT",
      body: JSON.stringify(size),
    })
  }

  async deleteSize(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/Size/${id}`, { method: "DELETE" })
  }

  // Malhas
  async getMeshes(): Promise<ApiResponse<Mesh[]>> {
    return this.request<Mesh[]>("/Mesh", { method: "GET" })
  }

  async createMesh(mesh: CreateMeshRequest): Promise<ApiResponse<Mesh>> {
    return this.request<Mesh>("/Mesh", {
      method: "POST",
      body: JSON.stringify(mesh),
    })
  }

  async updateMesh(id: string, mesh: UpdateMeshRequest): Promise<ApiResponse<Mesh>> {
    return this.request<Mesh>(`/Mesh/${id}`, {
      method: "PUT",
      body: JSON.stringify(mesh),
    })
  }

  async deleteMesh(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/Mesh/${id}`, { method: "DELETE" })
  }

  // Materiais
  async getMaterials(): Promise<ApiResponse<Material[]>> {
    return this.request<Material[]>("/Material", { method: "GET" })
  }

  async createMaterial(material: CreateMaterialRequest): Promise<ApiResponse<Material>> {
    return this.request<Material>("/Material", {
      method: "POST",
      body: JSON.stringify(material),
    })
  }

  async updateMaterial(id: string, material: UpdateMaterialRequest): Promise<ApiResponse<Material>> {
    return this.request<Material>(`/Material/${id}`, {
      method: "PUT",
      body: JSON.stringify(material),
    })
  }

  async deleteMaterial(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/Material/${id}`, { method: "DELETE" })
  }

  // Entradas de Material
  async getMaterialInputs(): Promise<ApiResponse<MaterialInput[]>> {
    return this.request<MaterialInput[]>("/MaterialInput", { method: "GET" })
  }

  async createMaterialInput(materialInput: CreateMaterialInputRequest): Promise<ApiResponse<MaterialInput>> {
    return this.request<MaterialInput>("/MaterialInput", {
      method: "POST",
      body: JSON.stringify(materialInput),
    })
  }

  async updateMaterialInput(
    id: string,
    materialInput: UpdateMaterialInputRequest,
  ): Promise<ApiResponse<MaterialInput>> {
    return this.request<MaterialInput>(`/MaterialInput/${id}`, {
      method: "PUT",
      body: JSON.stringify(materialInput),
    })
  }

  async deleteMaterialInput(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/MaterialInput/${id}`, { method: "DELETE" })
  }

  // Produtos
  async getProducts(): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>("/Product", { method: "GET" })
  }

  async createProduct(product: CreateProductRequest): Promise<ApiResponse<Product>> {
    return this.request<Product>("/Product", {
      method: "POST",
      body: JSON.stringify(product),
    })
  }

  async updateProduct(id: string, product: UpdateProductRequest): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/Product/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    })
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/Product/${id}`, { method: "DELETE" })
  }

  // Variações de Produto
  async getProductVariations(): Promise<ApiResponse<ProductVariation[]>> {
    return this.request<ProductVariation[]>("/ProductVariation", { method: "GET" })
  }

  async createProductVariation(
    productVariation: CreateProductVariationRequest,
  ): Promise<ApiResponse<ProductVariation>> {
    return this.request<ProductVariation>("/ProductVariation", {
      method: "POST",
      body: JSON.stringify(productVariation),
    })
  }

  async updateProductVariation(
    id: string,
    productVariation: UpdateProductVariationRequest,
  ): Promise<ApiResponse<ProductVariation>> {
    return this.request<ProductVariation>(`/ProductVariation/${id}`, {
      method: "PUT",
      body: JSON.stringify(productVariation),
    })
  }

  async deleteProductVariation(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/ProductVariation/${id}`, { method: "DELETE" })
  }

  // Vendas
  async getSales(): Promise<ApiResponse<SaleResponse[]>> {
    return this.request<SaleResponse[]>("/sale", { method: "GET" })
  }

  async createSale(sale: CreateSaleRequest): Promise<ApiResponse<SaleResponse>> {
    return this.request<SaleResponse>("/sale", {
      method: "POST",
      body: JSON.stringify(sale),
    })
  }

  async updateSale(id: string, sale: UpdateSaleRequest): Promise<ApiResponse<SaleResponse>> {
    return this.request<SaleResponse>(`/sale/${id}`, {
      method: "PUT",
      body: JSON.stringify(sale),
    })
  }

  async deleteSale(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/sale/${id}`, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient()
