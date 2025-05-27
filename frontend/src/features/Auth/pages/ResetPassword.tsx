import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@core'
import { clearError, formVariants, resetPassword } from '@features'

// ========== COMPONENTES REUTILIZÁVEIS ==========
import AuthForm from '@/features/Auth/layout/AuthLayout'
import FormInput from '@shared/ui/FormInput'
import FormButton from '@/shared/ui/FormButton'
import StatusMessage from '@shared/ui/StatusMessage'

const ResetPassword: React.FC = () => {
  // ========== HOOKS ==========
  const { token } = useParams<{ token: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((state) => state.auth)
  const [isSuccess, setIsSuccess] = useState(false)

  // ========== EFFECT PARA TRATAMENTO DE ERROS ==========
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
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } catch (error) {
        // Erros são tratados pelo useEffect
      }
    }
  })

  // ========== RENDER ==========
  return (
    <AuthForm title="Redefinir Senha">
      {/* ========== RENDERIZAÇÃO CONDICIONAL ========== */}
      {isSuccess ? (
        // ========== ESTADO: SENHA REDEFINIDA COM SUCESSO ==========
        <motion.div variants={formVariants.item}>
          <StatusMessage
            type="success"
            message="Senha redefinida com sucesso! Você será redirecionado para a página de login em instantes."
          />

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
        // ========== ESTADO: FORMULÁRIO DE REDEFINIÇÃO ==========
        <form onSubmit={formik.handleSubmit}>
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

          <motion.div className="mb-6" variants={formVariants.item}>
            <FormButton
              text="Redefinir Senha"
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
    </AuthForm>
  )
}

export default ResetPassword
