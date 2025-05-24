import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@core/store/hooks'
import { forgotPassword, clearError } from '@core/store/slices/authSlice'
import FormButton from '@/shared/ui/FormButton'
import { formVariants } from '@features/Auth/constants/animations'

const ForgotPassword: React.FC = () => {
  // ========== HOOKS ==========
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((state) => state.auth)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // ========== EFFECT PARA TRATAMENTO DE ERROS ==========
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  // ========== VALIDAÇÃO COM YUP ==========
  const validationSchema = Yup.object({
    email: Yup.string().email('Email inválido').required('Email é obrigatório')
  })

  // ========== CONFIGURAÇÃO DO FORMIK ==========
  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema,

    onSubmit: async (values) => {
      try {
        await dispatch(forgotPassword(values.email)).unwrap()
        setIsSubmitted(true)
        // Mostra mensagem de sucesso
        toast.success('Email de redefinição enviado!')
      } catch (error) {}
    }
  })

  // ========== RENDER ==========
  return (
    <motion.div
      className="max-w-md mx-auto"
      variants={formVariants.container}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="card" variants={formVariants.item}>
        <motion.h2
          className="text-2xl font-bold text-center mb-6"
          variants={formVariants.item}
        >
          Esqueci a Senha
        </motion.h2>

        {isSubmitted ? (
          <motion.div variants={formVariants.item}>
            {/* ========== MENSAGEM DE SUCESSO COM COUNTDOWN ========== */}
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              <p className="mb-2">
                Enviamos um email com instruções para redefinir sua senha. Por
                favor, verifique sua caixa de entrada.
              </p>
              <p className="text-sm text-green-600">
                Redirecionando para a página inicial em alguns segundos...
              </p>
            </div>

            {/* Links de navegação */}
            <div className="text-center space-y-2">
              <div>
                <button
                  onClick={() => navigate('/')}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Ir para página inicial agora
                </button>
              </div>
              <div>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-700 text-sm"
                >
                  Voltar para o login
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <motion.p
              className="text-gray-600 mb-6"
              variants={formVariants.item}
            >
              Digite seu email abaixo e enviaremos um link para redefinir sua
              senha.
            </motion.p>

            <motion.div className="mb-6" variants={formVariants.item}>
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

            <motion.div className="mb-6" variants={formVariants.item}>
              <FormButton
                text="Enviar Link de Redefinição"
                loading={loading}
                disabled={!(formik.isValid && formik.dirty)}
              />
            </motion.div>

            <motion.div
              className="text-center text-sm"
              variants={formVariants.item}
            >
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
