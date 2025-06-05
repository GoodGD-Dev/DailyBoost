import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@core'
import { AuthLayout, clearError, forgotPassword } from '@auth'
import { Btns, FormInput, pageAnimations } from '@shared'

const ForgotPassword: React.FC = () => {
  // ========== HOOKS ==========
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((state) => state.auth)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // ========== TRATAMENTO DE ERRO DIRETO ==========
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
        toast.success('Email de redefinição enviado!')
      } catch (error) {
        // Erro já tratado pelo useEffect
      }
    }
  })

  // ========== RENDER ==========
  return (
    <AuthLayout title="Esqueci a Senha">
      {isSubmitted ? (
        <motion.div variants={pageAnimations.item}>
          <div className="theme-alert-success">
            <div className="flex items-center mb-2">
              <Mail className="w-5 h-5 mr-2" />
              <span className="font-medium">Email enviado!</span>
            </div>
            <p className="mb-2">
              Enviamos um email com instruções para redefinir sua senha. Por
              favor, verifique sua caixa de entrada.
            </p>
            <p className="text-sm theme-text-success-600">
              Redirecionando para a página inicial em alguns segundos...
            </p>
          </div>

          <div className="text-center space-y-2">
            <div>
              <button
                onClick={() => navigate('/')}
                className="theme-link font-medium"
              >
                Ir para página inicial agora
              </button>
            </div>
            <div>
              <Link
                to="/login"
                className="theme-text-gray-600 hover:theme-text-gray-700 text-sm transition-colors duration-200"
              >
                Voltar para o login
              </Link>
            </div>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <motion.p
            className="theme-text-gray-600 mb-6"
            variants={pageAnimations.item}
          >
            Digite seu email abaixo e enviaremos um link para redefinir sua
            senha.
          </motion.p>

          <FormInput
            id="email"
            label="Email"
            type="email"
            fieldProps={formik.getFieldProps('email')}
            error={formik.errors.email}
            touched={formik.touched.email}
            className="mb-6"
          />

          <motion.div className="mb-6" variants={pageAnimations.item}>
            <Btns
              text="Enviar Link de Redefinição"
              loading={loading}
              disabled={!(formik.isValid && formik.dirty)}
              icon={<Mail className="h-4 w-4" />}
            />
          </motion.div>

          <motion.div
            className="text-center text-sm"
            variants={pageAnimations.item}
          >
            <Link to="/login" className="theme-link">
              Voltar para o login
            </Link>
          </motion.div>
        </form>
      )}
    </AuthLayout>
  )
}

export default ForgotPassword
