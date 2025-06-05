import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { Key, CheckCircle } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@core'
import { clearError, resetPassword, AuthLayout } from '@features'
import { Btns, FormInput, pageAnimations } from '@shared'

const ResetPassword: React.FC = () => {
  // ========== HOOKS ==========
  const { token } = useParams<{ token: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((state) => state.auth)
  const [isSuccess, setIsSuccess] = useState(false)

  // ========== VALIDAÇÃO DO TOKEN ==========
  useEffect(() => {
    if (!token) {
      toast.error('Token de redefinição inválido')
      navigate('/forgot-password')
    }
  }, [token, navigate])

  // ========== TRATAMENTO DE ERRO DIRETO ==========
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  // ========== VALIDAÇÃO COM YUP ==========
  const validationSchema = Yup.object({
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
        toast.success('Senha redefinida com sucesso!')

        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } catch (error) {
        // Erro já tratado pelo useEffect
      }
    }
  })

  // ========== RENDER ==========
  return (
    <AuthLayout title="Redefinir Senha">
      {isSuccess ? (
        // ========== ESTADO: SENHA REDEFINIDA COM SUCESSO ==========
        <motion.div variants={pageAnimations.item}>
          <div className="theme-alert-success">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-6 h-6 mr-2" />
              <span className="font-medium">Senha redefinida!</span>
            </div>
            <p>
              Senha redefinida com sucesso! Você será redirecionado para a
              página de login em instantes.
            </p>
          </div>

          <div className="text-center">
            <Link to="/login" className="theme-link font-medium">
              Ir para o login agora
            </Link>
          </div>
        </motion.div>
      ) : (
        // ========== ESTADO: FORMULÁRIO DE REDEFINIÇÃO ==========
        <form onSubmit={formik.handleSubmit}>
          <motion.p
            className="theme-text-gray-600 mb-6 text-center"
            variants={pageAnimations.item}
          >
            Digite sua nova senha abaixo.
          </motion.p>

          <FormInput
            id="password"
            label="Nova Senha"
            type="password"
            fieldProps={formik.getFieldProps('password')}
            error={formik.errors.password}
            touched={formik.touched.password}
          />

          <FormInput
            id="confirmPassword"
            label="Confirmar Nova Senha"
            type="password"
            fieldProps={formik.getFieldProps('confirmPassword')}
            error={formik.errors.confirmPassword}
            touched={formik.touched.confirmPassword}
            className="mb-6"
          />

          <motion.div className="mb-6" variants={pageAnimations.item}>
            <Btns
              text="Redefinir Senha"
              loading={loading}
              disabled={!(formik.isValid && formik.dirty)}
              icon={<Key className="h-4 w-4" />}
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

export default ResetPassword
