// src/services/authService.ts
import axios from 'axios'
import { auth } from '../config/firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Configuração do Axios com credenciais
axios.defaults.withCredentials = true

// Tipo para usuário retornado pela API
interface User {
  id: string
  name: string
  email: string
  isEmailVerified: boolean
}

// Tipo para credenciais de login
interface LoginCredentials {
  email: string
  password: string
}

// Tipo para dados de registro
interface RegisterData {
  name: string
  email: string
  password: string
}

// Registrar um novo usuário
const register = async (
  userData: RegisterData
): Promise<{ message: string }> => {
  const response = await axios.post(`${API_URL}/auth/register`, userData)
  return response.data
}

// Verificar Email
const verifyEmail = async (
  token: string
): Promise<{ message: string; user?: User }> => {
  const response = await axios.get(`${API_URL}/auth/verify-email/${token}`)
  return response.data
}

// Login com email e senha
const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials)
  return response.data.user
}

// Login com Google
const googleLogin = async (idToken: string): Promise<User> => {
  const response = await axios.post(`${API_URL}/auth/google`, { idToken })
  return response.data.user
}

// Iniciar login com Google (Firebase v9)
const initiateGoogleLogin = async (): Promise<string> => {
  const provider = new GoogleAuthProvider()

  const result = await signInWithPopup(auth, provider)
  const user = result.user

  if (!user) {
    throw new Error('Não foi possível autenticar com o Google')
  }

  const idToken = await user.getIdToken()
  return idToken
}

// Esqueci a senha
const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const response = await axios.post(`${API_URL}/auth/forgot-password`, {
    email
  })
  return response.data
}

// Resetar senha
const resetPassword = async (
  token: string,
  password: string
): Promise<{ message: string }> => {
  const response = await axios.put(`${API_URL}/auth/reset-password/${token}`, {
    password
  })
  return response.data
}

// Obter usuário atual
const getCurrentUser = async (): Promise<User> => {
  const response = await axios.get(`${API_URL}/auth/me`)
  return response.data.user
}

// Logout
const logout = async (): Promise<{ message: string }> => {
  // Faz logout no Firebase se estiver logado
  if (auth.currentUser) {
    await auth.signOut()
  }

  const response = await axios.get(`${API_URL}/auth/logout`)
  return response.data
}

const authService = {
  register,
  verifyEmail,
  login,
  googleLogin,
  initiateGoogleLogin,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  logout
}

export default authService
