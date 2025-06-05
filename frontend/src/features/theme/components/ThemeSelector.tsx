import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Check } from 'lucide-react'
import { useTheme } from '@theme'

const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      {/* Botão do seletor */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="theme-btn-secondary"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Palette className="w-4 h-4 mr-2" />
        {currentTheme.name}
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 right-0 z-50 theme-card min-w-[200px]"
          >
            <div className="p-2 space-y-1">
              {availableThemes.map((theme) => (
                <motion.button
                  key={theme.name}
                  onClick={() => {
                    setTheme(theme)
                    setIsOpen(false)
                  }}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 flex items-center justify-between
                    ${
                      currentTheme.name === theme.name
                        ? 'theme-bg-primary-100 theme-text-primary-700'
                        : 'hover:theme-bg-gray-100'
                    }
                  `}
                  whileHover={{ x: 2 }}
                >
                  <span className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-3 border border-gray-300"
                      style={{ backgroundColor: theme.colors.primary[500] }}
                    />
                    {theme.name}
                  </span>
                  {currentTheme.name === theme.name && (
                    <Check className="w-4 h-4 theme-text-primary-600" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay para fechar o dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  )
}

export default ThemeSelector
