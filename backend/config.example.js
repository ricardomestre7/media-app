// Arquivo de configuração de exemplo
// Copie este arquivo para config.js e configure suas variáveis

export const config = {
  // Configurações do Servidor
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // URL do Frontend
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // JWT Secret (GERE UMA CHAVE SEGURA)
  jwtSecret: process.env.JWT_SECRET || 'seu_jwt_secret_muito_seguro_aqui_123456789',
  
  // Configurações do Banco de Dados
  dbPath: process.env.DB_PATH || './database/midia_azul.db',
  
  // Configurações de Upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 104857600, // 100MB
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  
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
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/quicktime',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/mpeg'
  ]
};


