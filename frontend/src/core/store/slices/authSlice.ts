import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import authService from '@features/Auth/services/authService'

// ========== DEFINIÇÃO DE TIPOS/INTERFACES ==========

// Interface para o estado de autenticação
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

// Interface para o usuário
interface User {
  id: string
  name: string
  email: string
  isEmailVerified: boolean
}

// ========== INTERFACES PARA DADOS DE ENTRADA ==========

// Dados necessários para fazer login
interface LoginCredentials {
  email: string
  password: string
}

// Dados necessários para se registrar
interface RegisterCredentials {
  name: string
  email: string
  password: string
}

// Dados para redefinir senha
interface ResetPasswordData {
  token: string
  password: string
}

// ========== ESTADO INICIAL ==========

// Estado inicial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true, // Começa como true para verificar o token existente no início
  error: null
}

// ========== AÇÕES ASSÍNCRONAS (THUNKS) ==========
// Cada thunk representa uma operação que pode demorar (chamada para API)

// Verifica se há um usuário logado quando a aplicação inicia
// (verifica se existe um token JWT válido salvo no navegador)
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentUser()
    } catch (error: any) {
      // Se der erro, retorna uma mensagem amigável
      return rejectWithValue(
        error.response?.data?.message || 'Erro ao carregar usuário'
      )
    }
  }
)

// Faz login com email e senha
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      return await authService.login(credentials)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erro ao fazer login'
      )
    }
  }
)

// Faz login usando conta do Google
export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (idToken: string, { rejectWithValue }) => {
    try {
      return await authService.googleLogin(idToken)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erro ao fazer login com Google'
      )
    }
  }
)

// Registra um novo usuário
export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterCredentials, { rejectWithValue }) => {
    try {
      // Retorna o usuário
      return await authService.register(userData)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erro ao registrar usuário'
      )
    }
  }
)

// Verifica o email usando o token enviado por email
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await authService.verifyEmail(token)
      return response // Retorna dados atualizados do usuário
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erro ao verificar email'
      )
    }
  }
)

// Reenvia o email de verificação
export const resendVerificationEmail = createAsyncThunk(
  'auth/resendVerificationEmail',
  async (email: string, { rejectWithValue }) => {
    try {
      return await authService.resendVerificationEmail(email)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erro ao reenviar email de verificação'
      )
    }
  }
)

// Solicita recuperação de senha (envia email com link)
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      return await authService.forgotPassword(email)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erro ao enviar email de recuperação'
      )
    }
  }
)

// Redefine a senha usando o token do email
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: ResetPasswordData, { rejectWithValue }) => {
    try {
      return await authService.resetPassword(data.token, data.password)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erro ao redefinir senha'
      )
    }
  }
)

// Faz logout (remove token e limpa dados)
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.logout()
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erro ao fazer logout'
      )
    }
  }
)

// ========== SLICE - CONFIGURAÇÃO PRINCIPAL ==========

const authSlice = createSlice({
  name: 'auth',
  initialState,

  // ========== REDUCERS SÍNCRONOS ==========
  // Ações que acontecem imediatamente, sem esperar API
  reducers: {
    // Limpa mensagens de erro
    clearError: (state) => {
      state.error = null
    }
  },

  // ========== REDUCERS ASSÍNCRONOS ==========
  // Define o que acontece quando cada thunk (ação assíncrona) executa
  // Cada thunk tem 3 estados: pending (carregando), fulfilled (sucesso), rejected (erro)
  extraReducers: (builder) => {
    builder
      // ========== CASOS PARA loadUser ==========
      .addCase(loadUser.pending, (state) => {
        state.loading = true // Mostra indicador de carregamento
      })
      .addCase(loadUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false // Para loading
        state.isAuthenticated = true // Marca como autenticado
        state.user = action.payload // Salva dados do usuário
        state.error = null // Limpa erros
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false // Para loading
        state.isAuthenticated = false // Não autenticado
        state.user = null // Remove dados do usuário
        state.error = action.payload as string // Salva mensagem de erro
      })

      // ========== CASOS PARA login ==========
      .addCase(login.pending, (state) => {
        state.loading = true
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // ========== CASOS PARA googleLogin ==========
      .addCase(googleLogin.pending, (state) => {
        state.loading = true
      })
      .addCase(googleLogin.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
        state.error = null
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // ========== CASOS PARA register ==========
      .addCase(register.pending, (state) => {
        state.loading = true
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
        state.error = null

        // Verificação extra para garantir que recebemos dados válidos do usuário
        if ('id' in action.payload) {
          state.isAuthenticated = true
          state.user = action.payload as User
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // ========== CASOS PARA verifyEmail ==========
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false
        state.error = null

        // Se a verificação trouxer dados atualizados do usuário, salva eles
        if (action.payload?.user) {
          state.isAuthenticated = true
          state.user = action.payload.user
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // ========== CASOS PARA resendVerificationEmail ==========
      .addCase(resendVerificationEmail.pending, (state) => {
        state.loading = true
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.loading = false
        state.error = null
        // Não muda dados do usuário - apenas confirma que email foi enviado
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // ========== CASOS PARA forgotPassword ==========
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false
        state.error = null
        // Apenas confirma que email de recuperação foi enviado
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // ========== CASOS PARA resetPassword ==========
      .addCase(resetPassword.pending, (state) => {
        state.loading = true
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false
        state.error = null
        // Senha foi redefinida com sucesso
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // ========== CASOS PARA logout ==========
      .addCase(logout.pending, (state) => {
        state.loading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = false // Marca como não autenticado
        state.user = null // Remove dados do usuário
        state.error = null
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        // Mesmo com erro, tenta limpar o estado (segurança)
        state.isAuthenticated = false
        state.user = null
      })
  }
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
