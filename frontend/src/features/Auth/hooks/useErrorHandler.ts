import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit'
import { useAppDispatch } from '@/core/store/hooks'

interface UseErrorHandlerFlexibleOptions {
  error: string | null
  clearErrorAction:
    | ActionCreatorWithoutPayload<string>
    | (() => { type: string; payload?: unknown })
  showToast?: boolean
  toastType?: 'error' | 'warning' | 'info'
  onError?: (error: string) => void
}

export const useErrorHandlerFlexible = ({
  error,
  clearErrorAction,
  showToast = true,
  toastType = 'error',
  onError
}: UseErrorHandlerFlexibleOptions) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (error) {
      // Callback customizado se fornecido
      if (onError) {
        onError(error)
      }

      // Mostra toast se habilitado
      if (showToast) {
        toast[toastType](error)
      }

      // Limpa o erro do estado
      dispatch(clearErrorAction())
    }
  }, [error, dispatch, clearErrorAction, showToast, toastType, onError])
}
