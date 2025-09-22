// Configuración centralizada de la API
export const API_CONFIG = {
  // URL del backend (cambia solo aquí para toda la app)
  BASE_URL: 'https://metamotivacion-api.loca.lt',
  
  // Endpoints
  ENDPOINTS: {
    LOGIN: '/api/v1/login/access-token',
    REGISTER: '/api/v1/users/register', 
    CHECK_IN: '/api/v1/check-in/',
    QUESTIONS: '/api/v1/questions/',
    ANSWERS: '/api/v1/questions/answers',
    MOTIVATION_HISTORY: '/api/v1/dashboard/motivation-history',
    QUESTIONNAIRE_SUMMARY: '/api/v1/dashboard/questionnaire-summary'
  }
};

// Función helper para construir URLs completas
export const getApiUrl = (endpoint = '') => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Export por defecto para facilitar importación
export default API_CONFIG;
