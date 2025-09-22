// src/styles/theme.js
export const theme = {
  // Colores principales para adolescentes
  colors: {
    // Gradientes principales
    primary: '#6C63FF',      // Violeta moderno
    secondary: '#FF6B9D',    // Rosa vibrante
    tertiary: '#4ECDC4',     // Verde agua
    accent: '#FFE66D',       // Amarillo alegre
    
    // Estados emocionales
    success: '#00D4AA',      // Verde éxito
    warning: '#FFB800',      // Amarillo alerta
    error: '#FF4757',        // Rojo suave
    info: '#5352ED',         // Azul información
    
    // Neutros modernos
    white: '#FFFFFF',
    background: '#F8F9FF',   // Fondo muy suave
    surface: '#FFFFFF',
    text: {
      primary: '#2D3142',    // Gris oscuro suave
      secondary: '#6B7280',  // Gris medio
      light: '#9CA3AF',      // Gris claro
      white: '#FFFFFF'
    },
    
    // Gradientes para elementos
    gradients: {
      primary: ['#6C63FF', '#FF6B9D'],
      secondary: ['#FF6B9D', '#FFE66D'],
      success: ['#00D4AA', '#4ECDC4'],
      sunset: ['#FF8A80', '#FFD54F'],
      ocean: ['#4FC3F7', '#29B6F6'],
      forest: ['#81C784', '#66BB6A']
    }
  },
  
  // Sombras modernas
  shadows: {
    small: {
      shadowColor: '#6C63FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4
    },
    medium: {
      shadowColor: '#6C63FF',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8
    },
    large: {
      shadowColor: '#6C63FF',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 12
    }
  },
  
  // Espaciado consistente
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  
  // Bordes redondeados
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    round: 50
  },
  
  // Tipografía
  fonts: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 32,
      hero: 48
    },
    weights: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800'
    }
  }
};
