import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

// Importar rotas
import authRoutes from './routes/auth.js';
import mediaRoutes from './routes/media.js';
import userRoutes from './routes/user.js';
import statsRoutes from './routes/stats.js';
import searchRoutes from './routes/search.js';

// Importar middleware
import { authenticateToken } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

// Importar inicialização do banco
import { initDatabase } from './database/init.js';

// Configuração
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Muitas tentativas, tente novamente em 15 minutos'
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(limiter);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Criar diretórios necessários
const uploadsDir = path.join(__dirname, 'uploads');
const thumbnailsDir = path.join(__dirname, 'uploads', 'thumbnails');
const mediaDir = path.join(__dirname, 'uploads', 'media');

await fs.ensureDir(uploadsDir);
await fs.ensureDir(thumbnailsDir);
await fs.ensureDir(mediaDir);

// Servir arquivos estáticos
app.use('/uploads', express.static(uploadsDir));

// Rotas públicas
app.use('/api/auth', authRoutes);

// Middleware de autenticação para rotas protegidas
app.use('/api', authenticateToken);

// Rotas protegidas
app.use('/api/media', mediaRoutes);
app.use('/api/user', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/search', searchRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Mídia Azul API - Portal de Acesso ao VPS',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      media: '/api/media',
      user: '/api/user',
      stats: '/api/stats',
      search: '/api/search'
    }
  });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Inicializar banco de dados e iniciar servidor
async function startServer() {
  try {
    await initDatabase();
    console.log('✅ Banco de dados inicializado');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📁 Uploads: ${uploadsDir}`);
      console.log(`🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Erro ao inicializar servidor:', error);
    process.exit(1);
  }
}

startServer();

