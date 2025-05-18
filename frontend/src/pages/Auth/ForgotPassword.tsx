import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAppDispatch, useAppSelector } from '@core/store/hooks'
import { forgotPassword, clearError } from '@core/store/slices/authSlice'
import { toast } from 'react-toastify'
import FormButton from '@features/Auth/components/FormButton'
import { motion } from 'framer-motion'

const ForgotPassword: React.FC = () => {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  // Validação com Yup
  const validationSchema = Yup.object({
    email: Yup.string().email('Email inválido').required('Email é obrigatório')
  })

  // Configuração do Formik
  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(forgotPassword(values.email)).unwrap()
        setIsSubmitted(true)
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
          Esqueci a Senha
        </motion.h2>

        {isSubmitted ? (
          <motion.div variants={itemVariants}>
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              Enviamos um email com instruções para redefinir sua senha. Por
              favor, verifique sua caixa de entrada.
            </div>
            <div className="text-center">
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700"
              >
                Voltar para o login
              </Link>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <motion.p className="text-gray-600 mb-6" variants={itemVariants}>
              Digite seu email abaixo e enviaremos um link para redefinir sua
              senha.
            </motion.p>

            <motion.div className="mb-6" variants={itemVariants}>
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

            <motion.div className="mb-6" variants={itemVariants}>
              <FormButton
                text="Enviar Link de Redefinição"
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

export default ForgotPassword
