import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { UserPlus } from 'lucide-react'
import { useAppDispatch, useAppSelector, register, clearError } from '@core'
import { useErrorHandlerFlexible } from '@features'

// Componentes reutilizáveis
import AuthLayout from '@/features/Auth/layout/AuthLayout'
import AuthForm from '@/features/Auth/components/AuthForm'

const Register: React.FC = () => {
  // ========== HOOKS ==========
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  )

  // ========== TRATAMENTO DE ERROS ==========
  useErrorHandlerFlexible({
    error,
    clearErrorAction: clearError
  })

  // ========== EFFECT PARA REDIRECIONAMENTO APÓS REGISTRO ==========
  useEffect(() => {
    if (isAuthenticated) {
      if (user && !user.isEmailVerified) {
        navigate('/verify-required')
      } else {
        navigate('/dashboard')
      }
    }
  }, [isAuthenticated, user, navigate])

  // ========== TIPOS ==========
  type RegisterFormValues = {
    name: string
    email: string
    password: string
    confirmPassword: string
  }

  // ========== CONFIGURAÇÃO DOS CAMPOS ==========
  const formFields = [
    {
      id: 'name',
      label: 'Nome',
      type: 'text'
    },
    {
      id: 'email',
      label: 'Email',
      type: 'email'
    },
    {
      id: 'password',
      label: 'Senha',
      type: 'password'
    },
    {
      id: 'confirmPassword',
      label: 'Confirmar Senha',
      type: 'password'
    }
  ]

  // ========== VALIDAÇÃO COM YUP ==========
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Nome é obrigatório')
      .min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    password: Yup.string()
      .required('Senha é obrigatória')
      .min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Senhas não conferem')
      .required('Confirmação de senha é obrigatória')
  })

  // ========== VALORES INICIAIS ==========
  const initialValues: RegisterFormValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  }

  // ========== FUNÇÃO DE SUBMIT ==========
  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      const { confirmPassword, ...userData } = values
      await dispatch(register(userData)).unwrap()
    } catch (error) {
      // Erro será tratado pelo hook
    }
  }

  // ========== RENDER ==========
  return (
    <AuthLayout title="Criar Conta">
      <AuthForm<RegisterFormValues>
        fields={formFields}
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitButton={{
          text: 'Criar Conta',
          loading,
          variant: 'primary',
          size: 'md',
          icon: <UserPlus className="h-4 w-4" />,
          className: 'shadow-lg hover:shadow-xl'
        }}
        links={{
          switchForm: {
            text: 'Já tem uma conta?',
            linkText: 'Faça login',
            to: '/login'
          }
        }}
        showGoogleButton={true}
      />
    </AuthLayout>
  )
}

export default Register
