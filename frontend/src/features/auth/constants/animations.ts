import { Variants } from 'framer-motion'

// ========== ANIMAÇÕES BASE ==========
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4 }
  }
}

export const slideUp: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4 }
  }
}

export const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

// ========== ANIMAÇÕES PARA PÁGINAS ==========
export const pageAnimations = {
  container: stagger,
  item: slideUp
}

// ========== ANIMAÇÕES PARA CARDS ==========
export const cardAnimations = {
  container: fadeIn,
  item: {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  }
}

// ========== FUNÇÕES HELPER PARA CUSTOMIZAÇÃO ==========
export const createSlideUp = (duration = 0.4, yOffset = 20): Variants => ({
  hidden: { y: yOffset, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration }
  }
})

export const createStagger = (delay = 0.1): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: delay }
  }
})

export const createFadeIn = (duration = 0.4, delay = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration, delay }
  }
})

// ========== ANIMAÇÕES ESPECÍFICAS ==========
export const buttonHover = {
  whileHover: { scale: 1.02, y: -1 },
  whileTap: { scale: 0.98, y: 0 }
}

export const modalAnimations = {
  overlay: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  modal: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  }
}

// ========== TRANSIÇÕES PADRÃO ==========
export const transitions = {
  fast: { duration: 0.2 },
  normal: { duration: 0.4 },
  slow: { duration: 0.6 },
  spring: { type: 'spring', stiffness: 300, damping: 30 }
}

// ========== EXPORT DEFAULT PARA COMPATIBILIDADE ==========
// Mantém compatibilidade com o código existente
export const formVariants = pageAnimations
