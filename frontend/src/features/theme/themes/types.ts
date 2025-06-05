export interface Theme {
  name: string
  colors: {
    // Cores primárias
    primary: {
      50: string
      100: string
      200: string
      300: string
      400: string
      500: string
      600: string
      700: string
      800: string
      900: string
    }
    // Cores secundárias
    secondary: {
      50: string
      100: string
      200: string
      300: string
      400: string
      500: string
      600: string
      700: string
      800: string
      900: string
    }
    // Status colors
    success: {
      50: string
      100: string
      200: string
      500: string
      600: string
      700: string
    }
    error: {
      50: string
      100: string
      200: string
      500: string
      600: string
      700: string
    }
    warning: {
      50: string
      100: string
      200: string
      500: string
      600: string
      700: string
    }
    info: {
      50: string
      100: string
      200: string
      500: string
      600: string
      700: string
    }
    // Tons neutros
    gray: {
      50: string
      100: string
      200: string
      300: string
      400: string
      500: string
      600: string
      700: string
      800: string
      900: string
    }
    // Cores especiais
    white: string
    black: string
  }
}
