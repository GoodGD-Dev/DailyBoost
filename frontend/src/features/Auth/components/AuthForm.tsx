import React from 'react'
import { Link } from 'react-router-dom'
import { useFormik, FormikConfig } from 'formik'
import { motion } from 'framer-motion'
import { Schema } from 'yup'
import { FormButton, FormInput } from '@shared'
import { GoogleButton, formVariants } from '@features'

// ========== TIPOS ==========
interface FormField {
  id: string
  label: string
  type: string
}

type FormValues = Record<string, string>

interface AuthFormProps<T extends FormValues> {
  fields: FormField[]
  validationSchema: Schema<T>
  initialValues: T
  onSubmit: FormikConfig<T>['onSubmit']
  submitButton: {
    text: string
    loading: boolean
    icon?: React.ReactNode
    variant?: 'primary' | 'secondary'
    size?: 'sm' | 'md' | 'lg'
    className?: string
  }
  links?: {
    forgotPassword?: boolean
    switchForm: {
      text: string
      linkText: string
      to: string
    }
  }
  showGoogleButton?: boolean
  className?: string
}

// ========== COMPONENTE PRINCIPAL ==========
const AuthForm = <T extends FormValues>({
  fields,
  validationSchema,
  initialValues,
  onSubmit,
  submitButton,
  links,
  showGoogleButton = true,
  className = ''
}: AuthFormProps<T>) => {
  // ========== CONFIGURAÇÃO DO FORMIK ==========
  const formik = useFormik<T>({
    initialValues,
    validationSchema,
    onSubmit
  })

  // ========== RENDER ==========
  return (
    <form onSubmit={formik.handleSubmit} className={className}>
      {/* ========== CAMPOS DINÂMICOS ========== */}
      {fields.map((field, index) => (
        <FormInput
          key={field.id}
          id={field.id}
          label={field.label}
          type={field.type}
          fieldProps={formik.getFieldProps(field.id)}
          error={formik.errors[field.id] as string}
          touched={formik.touched[field.id] as boolean}
          className={index === fields.length - 1 ? 'mb-6' : ''}
        />
      ))}

      {/* ========== LINK "ESQUECEU A SENHA" (apenas no login) ========== */}
      {links?.forgotPassword && (
        <motion.div className="mb-6" variants={formVariants.item}>
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-900"
          >
            Esqueceu a senha?
          </Link>
        </motion.div>
      )}

      {/* ========== BOTÃO DE SUBMIT ========== */}
      <motion.div className="mb-4" variants={formVariants.item}>
        <FormButton
          text={submitButton.text}
          loading={submitButton.loading}
          disabled={!(formik.isValid && formik.dirty)}
          variant={submitButton.variant}
          size={submitButton.size}
          icon={submitButton.icon}
          className={submitButton.className}
        />
      </motion.div>

      {/* ========== DIVISOR "OU" (se Google Button estiver habilitado) ========== */}
      {showGoogleButton && (
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
      )}

      {/* ========== BOTÃO GOOGLE ========== */}
      {showGoogleButton && (
        <motion.div className="mb-6" variants={formVariants.item}>
          <GoogleButton />
        </motion.div>
      )}

      {/* ========== LINK PARA TROCAR DE FORMULÁRIO ========== */}
      {links?.switchForm && (
        <motion.div
          className="text-center text-sm"
          variants={formVariants.item}
        >
          {links.switchForm.text}{' '}
          <Link
            to={links.switchForm.to}
            className="text-blue-600 hover:text-primary-700"
          >
            {links.switchForm.linkText}
          </Link>
        </motion.div>
      )}
    </form>
  )
}

export default AuthForm
