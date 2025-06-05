import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import 'react-toastify/dist/ReactToastify.css'
import { store } from '@core'
import { ThemeProvider, ThemedToastContainer } from '@theme'
import App from './App'
import './index.css'
import './styles/themeClasses.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultThemeName="Default">
        <App />
        <ThemedToastContainer />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
)
