// Configuração real do servidor
export const config = {
  // Configurações do Servidor
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // URL do Frontend
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // JWT Secret (GERE UMA CHAVE SEGURA)
  jwtSecret: process.env.JWT_SECRET || 'midia_azul_jwt_secret_2024_very_secure_key_123456789',
  
  // Configurações do Banco de Dados
  dbPath: process.env.DB_PATH || './database/midia_azul.db',
  
  // Configurações de Upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 2147483648, // 2GB para VPS
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  
  // Configurações de Streaming
  enableStreaming: process.env.ENABLE_STREAMING !== 'false',
  chunkSize: parseInt(process.env.CHUNK_SIZE) || 1048576, // 1MB chunks
  
  // Configurações de VPS
  vpsStoragePath: process.env.VPS_STORAGE_PATH || '/var/media-storage',
  maxStorageSize: parseInt(process.env.MAX_STORAGE_SIZE) || 1099511627776, // 1TB
  
  // Configurações de Thumbnail
  thumbnailWidth: parseInt(process.env.THUMBNAIL_WIDTH) || 300,
  thumbnailHeight: parseInt(process.env.THUMBNAIL_HEIGHT) || 300,
  
  // Configurações de Rate Limiting
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 900000, // 15 min
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  
  // Configurações de CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // Tipos de arquivo permitidos
  allowedFileTypes: [
    // Imagens
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/tiff',
    'image/svg+xml',
    
    // Vídeos
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/quicktime',
    'video/mkv',
    'video/webm',
    'video/flv',
    'video/wmv',
    'video/3gp',
    
    // Áudio
    'audio/mp3',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/aac',
    'audio/flac',
    'audio/m4a',
    'audio/wma'
  ],
  
  // Extensões de arquivo permitidas
  allowedExtensions: [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.svg',
    '.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv', '.wmv', '.3gp',
    '.mp3', '.wav', '.ogg', '.aac', '.flac', '.m4a', '.wma'
  ]
};


