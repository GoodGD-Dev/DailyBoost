import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAppDispatch, useAppSelector } from '@core/store/hooks'
import { register, clearError } from '@core/store/slices/authSlice'
import { toast } from 'react-toastify'
import FormButton from '@features/Auth/components/FormButton'
import GoogleButton from '@features/Auth/components/GoogleButton'
import { motion } from 'framer-motion'

const Register: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  // Redirecionar após registro bem-sucedido
  useEffect(() => {
    if (isAuthenticated) {
      // Se o usuário está autenticado mas o email não está verificado
      if (user && !user.isEmailVerified) {
        navigate('/verify-required')
      } else {
        // Se o email está verificado, redireciona para o dashboard
        navigate('/dashboard')
      }
    }
  }, [isAuthenticated, user, navigate])

  // Validação com Yup
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

  // Configuração do Formik
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
        // Não precisamos mais do toast nem do navigate aqui, pois o useEffect
        // cuidará do redirecionamento baseado no estado isAuthenticated
      } catch (error) {}
    }
  })

  // Animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  }

  return (
    <motion.div
      className="max-w-md mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="card" variants={itemVariants}>
        <motion.h2
          className="text-2xl font-bold text-center mb-6"
          variants={itemVariants}
        >
          Criar Conta
        </motion.h2>

        <form onSubmit={formik.handleSubmit}>
          <motion.div className="mb-4" variants={itemVariants}>
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Nome
            </label>
            <input
              id="name"
              type="text"
              {...formik.getFieldProps('name')}
              className="input"
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="error-text">{formik.errors.name}</div>
            ) : null}
          </motion.div>

          <motion.div className="mb-4" variants={itemVariants}>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...formik.getFieldProps('email')}
              className="input"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error-text">{formik.errors.email}</div>
            ) : null}
          </motion.div>

          <motion.div className="mb-4" variants={itemVariants}>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              {...formik.getFieldProps('password')}
              className="input"
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="error-text">{formik.errors.password}</div>
            ) : null}
          </motion.div>

          <motion.div className="mb-6" variants={itemVariants}>
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 mb-2"
            >
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...formik.getFieldProps('confirmPassword')}
              className="input"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="error-text">{formik.errors.confirmPassword}</div>
            ) : null}
          </motion.div>

          <motion.div className="mb-4" variants={itemVariants}>
            <FormButton
              text="Registrar"
              loading={loading}
              disabled={!(formik.isValid && formik.dirty)}
            />
          </motion.div>

          <motion.div
            className="relative mb-4 flex items-center justify-center"
            variants={itemVariants}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </motion.div>

          <motion.div className="mb-6" variants={itemVariants}>
            <GoogleButton />
          </motion.div>

          <motion.div className="text-center text-sm" variants={itemVariants}>
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700"
            >
              Faça login
            </Link>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default Register
