import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import authService from '@features/Auth/services/authService'

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

// Interfaces para as ações
interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials {
  name: string
  email: string
  password: string
}

interface ResetPasswordData {
  token: string
  password: string
}

// Estado inicial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true, // Começa como true para verificar o token existente no início
  error: null
}

// Thunk: Carrega o usuário atual ao iniciar a aplicação (verifica o token JWT)
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentUser()
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erro ao carregar usuário'
      )
    }
  }
)

// Thunk: Login com email e senha
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

// Thunk: Login com Google
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

// Thunk: Registro de usuário
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

// Thunk: Verificação de email
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await authService.verifyEmail(token)
      return response // Agora contém dados do usuário além da mensagem
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erro ao verificar email'
      )
    }
  }
)

// Thunk: Reenviar email de verificação
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

// Thunk: Esqueci a senha
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

// Thunk: Redefinir senha
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

// Thunk: Logout
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

// Criação do slice com reducers sincronos e assíncronos
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Reducer síncrono para limpar erros
    clearError: (state) => {
      state.error = null
    }
  },
  // Reducers para as ações assíncronas (thunks)
  extraReducers: (builder) => {
    builder
      // Casos para loadUser
      .addCase(loadUser.pending, (state) => {
        state.loading = true
      })
      .addCase(loadUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
        state.error = null
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.error = action.payload as string
      })

      // Casos para login
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

      // Casos para googleLogin
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

      // Casos para register
      .addCase(register.pending, (state) => {
        state.loading = true
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
        state.error = null

        // Se o resultado contiver um objeto 'user', configuramos o estado de autenticação
        if ('id' in action.payload) {
          state.isAuthenticated = true
          state.user = action.payload as User
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Casos para verifyEmail
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false
        state.error = null

        // Se a resposta incluir dados do usuário, atualize o estado de autenticação
        if (action.payload?.user) {
          state.isAuthenticated = true
          state.user = action.payload.user
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Casos para resendVerificationEmail
      .addCase(resendVerificationEmail.pending, (state) => {
        state.loading = true
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Casos para forgotPassword
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Casos para resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.loading = true
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Casos para logout
      .addCase(logout.pending, (state) => {
        state.loading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.error = null
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        // Mesmo com erro, tentamos limpar o estado de autenticação
        state.isAuthenticated = false
        state.user = null
      })
  }
})

// Exportamos a ação clearError
export const { clearError } = authSlice.actions

// Exportamos o reducer
export default authSlice.reducer
