"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

export function ApiStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [apiStatus, setApiStatus] = useState<"connected" | "disconnected" | "checking">("checking")

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Tentar fazer uma requisição simples para verificar se a API está disponível
        const response = await fetch("/api/v1/health", {
          method: "GET",
          timeout: 5000,
        } as any)

        setApiStatus(response.ok ? "connected" : "disconnected")
      } catch (error) {
        setApiStatus("disconnected")
      }
    }

    // Verificar status inicial
    checkApiStatus()

    // Verificar periodicamente
    const interval = setInterval(checkApiStatus, 30000) // A cada 30 segundos

    // Monitorar conexão de rede
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      clearInterval(interval)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        variant: "destructive" as const,
        icon: WifiOff,
        text: "Offline",
        description: "Sem conexão com a internet",
      }
    }

    switch (apiStatus) {
      case "connected":
        return {
          variant: "default" as const,
          icon: Wifi,
          text: "API Conectada",
          description: "Sistema funcionando normalmente",
        }
      case "disconnected":
        return {
          variant: "secondary" as const,
          icon: WifiOff,
          text: "Modo Offline",
          description: "Usando dados locais",
        }
      default:
        return {
          variant: "secondary" as const,
          icon: Wifi,
          text: "Verificando...",
          description: "Testando conexão",
        }
    }
  }

  const status = getStatusInfo()
  const Icon = status.icon

  return (
    <div className="flex items-center space-x-2">
      <Badge variant={status.variant} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span className="text-xs">{status.text}</span>
      </Badge>
    </div>
  )
}
