import axios, { AxiosInstance } from 'axios'

// Configuração base da API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Cria instância configurada do axios
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Export da URL base para casos específicos
export { API_URL }
