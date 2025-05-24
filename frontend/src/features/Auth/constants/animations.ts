import { Variants } from 'framer-motion'

// ========== ANIMAÇÕES BÁSICAS ==========
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4
    }
  }
}

export const slideUpVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4
    }
  }
}

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

// ========== ANIMAÇÕES CUSTOMIZÁVEIS ==========
export const createSlideUpVariants = (
  duration = 0.4,
  yOffset = 20
): Variants => ({
  hidden: { y: yOffset, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration
    }
  }
})

export const createContainerVariants = (staggerDelay = 0.1): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay
    }
  }
})

export const createFadeInVariants = (duration = 0.4, delay = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration,
      delay
    }
  }
})

// ========== ANIMAÇÕES ESPECÍFICAS ==========
export const formVariants = {
  container: containerVariants,
  item: slideUpVariants
}

export const pageVariants = {
  container: createContainerVariants(0.15),
  item: createSlideUpVariants(0.5, 30)
}

export const cardVariants = {
  container: fadeInVariants,
  item: createSlideUpVariants(0.3, 15)
}
