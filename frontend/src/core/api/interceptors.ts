import { AxiosError, AxiosResponse } from 'axios'
import { apiClient } from './client'

// Request Interceptor - Adiciona tokens, logs, etc
apiClient.interceptors.request.use(
  (config) => {
    // Log das requisições em desenvolvimento
    if (import.meta.env.DEV) {
      console.log(
        `🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`
      )
    }

    // Adicionar headers dinâmicos se necessário
    // Ex: Authorization Bearer token (se não usar cookies)

    return config
  },
  (error) => {
    console.error('❌ [API Request Error]', error)
    return Promise.reject(error)
  }
)

// Response Interceptor - Trata respostas e erros globais
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log das respostas em desenvolvimento
    if (import.meta.env.DEV) {
      console.log(`✅ [API Response] ${response.status} ${response.config.url}`)
    }

    return response
  },
  (error: AxiosError) => {
    // Log de erros
    console.error('❌ [API Response Error]', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message
    })

    // Tratamento global de erros
    switch (error.response?.status) {
      case 401:
        // Token expirado ou inválido
        console.log('🔒 Unauthorized - redirecting to login')
        // Aqui você pode disparar uma ação global de logout
        // store.dispatch(authActions.logout())
        break

      case 403:
        console.log('🚫 Forbidden - insufficient permissions')
        break

      case 500:
        console.log('🔥 Server error')
        // Aqui você pode mostrar um toast global de erro
        break
    }

    return Promise.reject(error)
  }
)
