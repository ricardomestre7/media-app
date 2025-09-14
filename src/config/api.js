// Configurações da API
export const API_CONFIG = {
  // URL base da API do VPS
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  
  // Timeout para requisições (em ms)
  TIMEOUT: 30000,
  
  // Configurações de retry
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  
  // Configurações de upload
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/avi',
    'video/mov',
    'audio/mp3',
    'audio/wav',
    'audio/ogg'
  ],
  
  // Configurações de cache
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
};

// Endpoints da API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/auth/profile',
  },
  MEDIA: {
    LIST: '/api/media',
    UPLOAD: '/api/media/upload',
    DELETE: '/api/media/:id',
    UPDATE: '/api/media/:id',
    SHARE: '/api/media/:id/share',
    DOWNLOAD: '/api/media/:id/download',
    THUMBNAIL: '/api/media/:id/thumbnail',
    PREVIEW: '/api/media/:id/preview',
  },
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE: '/api/user/profile',
  },
  STATS: {
    STORAGE: '/api/stats/storage',
    MEDIA: '/api/stats/media',
  },
  SEARCH: {
    MEDIA: '/api/search',
  },
};

