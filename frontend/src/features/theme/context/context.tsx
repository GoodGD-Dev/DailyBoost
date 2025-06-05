import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react'
import {
  Theme,
  defaultTheme,
  darkTheme,
  oceanTheme,
  sunsetTheme,
  forestTheme
} from '@theme'

interface ThemeContextType {
  currentTheme: Theme
  setTheme: (theme: Theme) => void
  availableThemes: Theme[]
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
  defaultThemeName?: string
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultThemeName = 'Default'
}) => {
  const availableThemes = [
    defaultTheme,
    darkTheme,
    oceanTheme,
    sunsetTheme,
    forestTheme
  ]

  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    // Tenta recuperar o tema do localStorage
    const savedTheme = localStorage.getItem('selectedTheme')
    if (savedTheme) {
      const found = availableThemes.find((theme) => theme.name === savedTheme)
      if (found) return found
    }

    // Senão, usa o tema padrão especificado
    return (
      availableThemes.find((theme) => theme.name === defaultThemeName) ||
      defaultTheme
    )
  })

  // Salva o tema no localStorage quando muda
  useEffect(() => {
    localStorage.setItem('selectedTheme', currentTheme.name)

    // Aplica as variáveis CSS no documento
    const root = document.documentElement

    // Remove todas as classes de tema existentes
    availableThemes.forEach((theme) => {
      root.classList.remove(`theme-${theme.name.toLowerCase()}`)
    })

    // Adiciona a classe do tema atual
    root.classList.add(`theme-${currentTheme.name.toLowerCase()}`)

    // Define as variáveis CSS
    Object.entries(currentTheme.colors).forEach(([colorGroup, colors]) => {
      if (typeof colors === 'string') {
        root.style.setProperty(`--color-${colorGroup}`, colors)
      } else {
        Object.entries(colors).forEach(([shade, value]) => {
          root.style.setProperty(`--color-${colorGroup}-${shade}`, value)
        })
      }
    })
  }, [currentTheme, availableThemes])

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme)
  }

  const toggleTheme = () => {
    const currentIndex = availableThemes.findIndex(
      (theme) => theme.name === currentTheme.name
    )
    const nextIndex = (currentIndex + 1) % availableThemes.length
    setTheme(availableThemes[nextIndex])
  }

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        availableThemes,
        toggleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
