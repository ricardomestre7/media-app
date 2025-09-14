// Configurações de ambiente
export const ENV = {
  // URL da API do VPS
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  
  // Configurações da aplicação
  APP_NAME: 'Mídia Azul',
  APP_VERSION: '1.0.0',
  
  // Modo de desenvolvimento
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};

// Para configurar a URL do VPS, edite a variável VITE_API_URL no arquivo .env
// ou modifique diretamente o valor acima


