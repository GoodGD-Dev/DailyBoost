import axios from 'axios'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@core'

// ========== CONFIGURAÇÃO DA API ==========
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Configura axios para sempre enviar cookies nas requisições
// Isso permite que o backend mantenha sessões de autenticação
axios.defaults.withCredentials = true

// ========== INTERFACES TYPESCRIPT ==========

// Define a estrutura dos dados do usuário
interface User {
  id: string
  name: string
  email: string
  isEmailVerified: boolean
}

// Dados necessários para login
interface LoginCredentials {
  email: string
  password: string
}

// Dados necessários para registro
interface RegisterData {
  name: string
  email: string
  password: string
}

// ========== FUNÇÕES DO SERVIÇO DE AUTENTICAÇÃO ==========

// ========== REGISTRO DE USUÁRIO ==========
// Registra um novo usuário e retorna os dados dele
const register = async (userData: RegisterData): Promise<User> => {
  // Envia dados para endpoint de registro
  const response = await axios.post(`${API_URL}/auth/register`, userData)

  // O backend retorna { success: true, user: {...}, message: "..." }
  // Mas só precisamos do objeto user
  return response.data.user
}

// ========== VERIFICAÇÃO DE EMAIL ==========
// Verifica o email usando o token enviado por email
const verifyEmail = async (
  token: string
): Promise<{ message: string; user?: User }> => {
  // Faz GET request com o token na URL
  const response = await axios.get(`${API_URL}/auth/verify-email/${token}`)

  // Retorna resposta completa (pode incluir dados atualizados do usuário)
  return response.data
}

// ========== REENVIO DE EMAIL DE VERIFICAÇÃO ==========
// Reenvia o email de verificação para um endereço específico
const resendVerificationEmail = async (
  email: string
): Promise<{ message: string }> => {
  // Envia POST com o email no corpo da requisição
  const response = await axios.post(`${API_URL}/auth/resend-verification`, {
    email
  })

  // Retorna apenas a mensagem de confirmação
  return response.data
}

// ========== LOGIN COM EMAIL/SENHA ==========
// Autentica usuário com credenciais tradicionais
const login = async (credentials: LoginCredentials): Promise<User> => {
  // Envia credenciais para endpoint de login
  const response = await axios.post(`${API_URL}/auth/login`, credentials)

  // Retorna dados do usuário autenticado
  return response.data.user
}

// ========== LOGIN COM GOOGLE (BACKEND) ==========
// Envia token do Google para o backend validar
const googleLogin = async (idToken: string): Promise<User> => {
  // Envia token JWT do Google para o backend
  const response = await axios.post(`${API_URL}/auth/google`, { idToken })

  // Backend valida o token com Google e retorna dados do usuário
  return response.data.user
}

// ========== INÍCIO DO LOGIN COM GOOGLE (FRONTEND) ==========
// Abre popup do Google e obtém o token JWT
const initiateGoogleLogin = async (): Promise<string> => {
  // Cria provedor de autenticação do Google
  const provider = new GoogleAuthProvider()

  // Abre popup do Google para login
  // signInWithPopup gerencia todo o fluxo OAuth
  const result = await signInWithPopup(auth, provider)

  // Extrai dados do usuário do resultado
  const user = result.user

  // Validação de segurança
  if (!user) {
    throw new Error('Não foi possível autenticar com o Google')
  }

  // Obtém o token JWT do usuário autenticado
  // Esse token será enviado para nosso backend
  const idToken = await user.getIdToken()
  return idToken
}

// ========== ESQUECI A SENHA ==========
// Envia email de recuperação de senha
const forgotPassword = async (email: string): Promise<{ message: string }> => {
  // Envia email para endpoint de recuperação
  const response = await axios.post(`${API_URL}/auth/forgot-password`, {
    email
  })

  // Retorna confirmação de que email foi enviado
  return response.data
}

// ========== REDEFINIR SENHA ==========
// Redefine a senha usando token do email de recuperação
const resetPassword = async (
  token: string,
  password: string
): Promise<{ message: string }> => {
  // Envia nova senha junto com token de validação
  const response = await axios.put(`${API_URL}/auth/reset-password/${token}`, {
    password
  })

  // Retorna confirmação de que senha foi alterada
  return response.data
}

// ========== OBTER USUÁRIO ATUAL ==========
// Verifica se há um usuário logado (valida token/cookie)
const getCurrentUser = async (): Promise<User> => {
  // Faz requisição autenticada para obter dados do usuário
  // O backend verifica o cookie/token automaticamente
  const response = await axios.get(`${API_URL}/auth/me`)

  // Retorna dados do usuário atual
  return response.data.user
}

// ========== LOGOUT ==========
// Desloga o usuário tanto no Firebase quanto no backend
const logout = async (): Promise<{ message: string }> => {
  // ========== LOGOUT DO FIREBASE ==========
  // Se há usuário logado no Firebase, faz logout dele também
  if (auth.currentUser) {
    await auth.signOut()
  }

  // ========== LOGOUT DO BACKEND ==========
  // Informa ao backend para invalidar sessão/cookie
  const response = await axios.get(`${API_URL}/auth/logout`)

  // Retorna confirmação de logout
  return response.data
}

// ========== OBJETO DE SERVIÇO ==========
// Agrupa todas as funções em um objeto para exportação
const authService = {
  register,
  verifyEmail,
  resendVerificationEmail,
  login,
  googleLogin,
  initiateGoogleLogin,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  logout
}

export default authService
