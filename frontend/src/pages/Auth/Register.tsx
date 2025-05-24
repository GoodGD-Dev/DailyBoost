import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { motion } from 'framer-motion'
import { UserPlus } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@core/store/hooks'
import { register, clearError } from '@core/store/slices/authSlice'
import { useErrorHandlerFlexible } from '@/features/Auth/hooks/useErrorHandler'
import { formVariants } from '@features/Auth/constants/animations'

// ========== COMPONENTES REUTILIZÁVEIS ==========
import AuthForm from '@shared/ui/AuthForm'
import FormInput from '@shared/ui/FormInput'
import FormButton from '@/shared/ui/FormButton'
import GoogleButton from '@features/Auth/components/GoogleButton'

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

  // ========== CONFIGURAÇÃO DO FORMIK ==========
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { confirmPassword, ...userData } = values
        await dispatch(register(userData)).unwrap()
      } catch (error) {
        // Erro será tratado pelo hook
      }
    }
  })

  // ========== RENDER ==========
  return (
    <AuthForm title="Criar Conta">
      <form onSubmit={formik.handleSubmit}>
        {/* ========== CAMPOS DO FORMULÁRIO ========== */}
        <FormInput
          id="name"
          label="Nome"
          type="text"
          fieldProps={formik.getFieldProps('name')}
          error={formik.errors.name}
          touched={formik.touched.name}
        />

        <FormInput
          id="email"
          label="Email"
          type="email"
          fieldProps={formik.getFieldProps('email')}
          error={formik.errors.email}
          touched={formik.touched.email}
        />

        <FormInput
          id="password"
          label="Senha"
          type="password"
          fieldProps={formik.getFieldProps('password')}
          error={formik.errors.password}
          touched={formik.touched.password}
        />

        <FormInput
          id="confirmPassword"
          label="Confirmar Senha"
          type="password"
          fieldProps={formik.getFieldProps('confirmPassword')}
          error={formik.errors.confirmPassword}
          touched={formik.touched.confirmPassword}
          className="mb-6" // Mais espaço antes do botão
        />

        {/* ========== BOTÃO DE REGISTRO ========== */}
        <motion.div className="mb-4" variants={formVariants.item}>
          <FormButton
            text="Criar Conta"
            loading={loading}
            disabled={!(formik.isValid && formik.dirty)}
            variant="primary"
            size="md"
            icon={<UserPlus className="h-4 w-4" />}
            className="shadow-lg hover:shadow-xl"
          />
        </motion.div>

        {/* ========== DIVISOR "OU" ========== */}
        <motion.div
          className="relative mb-4 flex items-center justify-center"
          variants={formVariants.item}
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou</span>
          </div>
        </motion.div>

        {/* ========== BOTÃO GOOGLE ========== */}
        <motion.div className="mb-6" variants={formVariants.item}>
          <GoogleButton />
        </motion.div>

        {/* ========== LINK PARA LOGIN ========== */}
        <motion.div
          className="text-center text-sm"
          variants={formVariants.item}
        >
          Já tem uma conta?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700">
            Faça login
          </Link>
        </motion.div>
      </form>
    </AuthForm>
  )
}

export default Register
