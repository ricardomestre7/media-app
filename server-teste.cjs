const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'midia_azul_jwt_secret_2024_very_secure_key_123456789';

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Dados em memória (simulação)
let users = [
  {
    id: 1,
    email: 'admin@midiaazul.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // admin123
    name: 'Administrador',
    avatar: null
  }
];

let media = [
  {
    id: 1,
    user_id: 1,
    filename: 'exemplo.jpg',
    original_name: 'Foto de exemplo.jpg',
    file_path: '/uploads/exemplo.jpg',
    thumbnail_path: '/uploads/thumb_exemplo.jpg',
    file_size: 1024000,
    mime_type: 'image/jpeg',
    file_type: 'image',
    category: 'Exemplo',
    is_favorite: false,
    is_shared: false,
    is_deleted: false,
    created_at: new Date().toISOString()
  }
];

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    message: 'Mídia Azul API funcionando!'
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Mídia Azul API - Portal de Acesso ao VPS',
    version: '1.0.0',
    status: 'Funcionando!',
    endpoints: {
      health: '/health',
      auth: '/api/auth/login',
      media: '/api/media'
    }
  });
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios',
        code: 'MISSING_CREDENTIALS'
      });
    }

    // Buscar usuário
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Retornar dados do usuário (sem senha)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login realizado com sucesso!',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Listar mídias
app.get('/api/media', (req, res) => {
  try {
    const { type, category, search, page = 1, limit = 50 } = req.query;
    
    let filteredMedia = media.filter(item => !item.is_deleted);
    
    // Filtros
    if (type) {
      filteredMedia = filteredMedia.filter(item => item.file_type === type);
    }
    
    if (category) {
      filteredMedia = filteredMedia.filter(item => item.category === category);
    }
    
    if (search) {
      filteredMedia = filteredMedia.filter(item => 
        item.original_name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Paginação
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedMedia = filteredMedia.slice(startIndex, endIndex);
    
    res.json({
      media: paginatedMedia,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredMedia.length,
        pages: Math.ceil(filteredMedia.length / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('Erro ao listar mídias:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Estatísticas de armazenamento
app.get('/api/stats/storage', (req, res) => {
  try {
    const usedBytes = media.reduce((total, item) => total + item.file_size, 0);
    const totalBytes = 1099511627776; // 1TB
    const usedPercentage = Math.round((usedBytes / totalBytes) * 100);
    
    res.json({
      storage: {
        used: usedBytes,
        total: totalBytes,
        available: totalBytes - usedBytes,
        percentage: usedPercentage
      },
      files: {
        total: media.length,
        recent: media.filter(item => {
          const itemDate = new Date(item.created_at);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return itemDate > weekAgo;
        }).length,
        favorites: media.filter(item => item.is_favorite).length,
        shared: media.filter(item => item.is_shared).length
      }
    });
    
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Mídia Azul rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Frontend: http://localhost:5173`);
  console.log(`🔐 Login: admin@midiaazul.com / admin123`);
  console.log(`✅ API funcionando perfeitamente!`);
});
