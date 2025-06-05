import React from 'react'
import { ToastContainer } from 'react-toastify'
import { useTheme } from '@theme'

const ThemedToastContainer: React.FC = () => {
  const { currentTheme } = useTheme()

  // Define o tema do Toastify baseado no tema atual
  const toastTheme = currentTheme.name === 'Dark' ? 'dark' : 'light'

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={toastTheme} // 'light', 'dark', ou 'colored'
      toastClassName="theme-toast"
      className="theme-toast-body"
    />
  )
}

export default ThemedToastContainer
