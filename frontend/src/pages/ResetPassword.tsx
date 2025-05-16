import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAppDispatch, useAppSelector } from '../core/store/hooks'
import { resetPassword, clearError } from '../core/store/slices/authSlice'
import { toast } from 'react-toastify'
import FormButton from '../features/Auth/components/FormButton'
import { motion } from 'framer-motion'

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((state) => state.auth)
  const [isSuccess, setIsSuccess] = useState(false)

  // Exibir erro no toast, se houver
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  // Validação com Yup
  const validationSchema = Yup.object({
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
      password: '',
      confirmPassword: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!token) {
        toast.error('Token inválido')
        return
      }

      try {
        await dispatch(
          resetPassword({ token, password: values.password })
        ).unwrap()
        setIsSuccess(true)
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } catch (error) {
        // Erro já tratado no useEffect
      }
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
          Redefinir Senha
        </motion.h2>

        {isSuccess ? (
          <motion.div variants={itemVariants}>
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              Senha redefinida com sucesso! Você será redirecionado para a
              página de login em instantes.
            </div>
            <div className="text-center">
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700"
              >
                Ir para o login agora
              </Link>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <motion.div className="mb-4" variants={itemVariants}>
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Nova Senha
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
                Confirmar Nova Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...formik.getFieldProps('confirmPassword')}
                className="input"
              />
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className="error-text">
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
            </motion.div>

            <motion.div className="mb-6" variants={itemVariants}>
              <FormButton
                text="Redefinir Senha"
                loading={loading}
                disabled={!(formik.isValid && formik.dirty)}
              />
            </motion.div>

            <motion.div className="text-center text-sm" variants={itemVariants}>
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700"
              >
                Voltar para o login
              </Link>
            </motion.div>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}

export default ResetPassword
