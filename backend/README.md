# Mídia Azul - Backend API

Backend API para o portal Mídia Azul - Acesso ao VPS com 1TB de armazenamento.

## 🚀 Funcionalidades

- ✅ **Autenticação JWT** - Login seguro com tokens
- ✅ **Upload de Mídias** - Suporte a imagens, vídeos e áudios
- ✅ **Geração de Thumbnails** - Automática para imagens
- ✅ **Sistema de Busca** - Busca avançada e sugestões
- ✅ **Estatísticas** - Uso de armazenamento e métricas
- ✅ **Compartilhamento** - Links seguros para compartilhar
- ✅ **Banco SQLite** - Banco de dados local
- ✅ **Rate Limiting** - Proteção contra spam
- ✅ **Validação** - Validação de dados e arquivos

## 📦 Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
Crie um arquivo `.env` na raiz do backend:
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=seu_jwt_secret_muito_seguro_aqui
DB_PATH=./database/midia_azul.db
MAX_FILE_SIZE=104857600
UPLOAD_PATH=./uploads
```

3. **Executar o servidor:**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 🔧 Configuração

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|---------|
| `PORT` | Porta do servidor | 3001 |
| `NODE_ENV` | Ambiente (development/production) | development |
| `FRONTEND_URL` | URL do frontend | http://localhost:5173 |
| `JWT_SECRET` | Chave secreta para JWT | midia_azul_jwt_secret_2024_very_secure_key_123456789 |
| `DB_PATH` | Caminho do banco SQLite | ./database/midia_azul.db |
| `MAX_FILE_SIZE` | Tamanho máximo de arquivo (bytes) | 104857600 (100MB) |
| `UPLOAD_PATH` | Diretório de uploads | ./uploads |

### Tipos de Arquivo Suportados

- **Imagens:** JPEG, PNG, GIF, WebP
- **Vídeos:** MP4, AVI, MOV, QuickTime
- **Áudios:** MP3, WAV, OGG, MPEG

## 📚 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify` - Verificar token
- `POST /api/auth/register` - Registrar usuário

### Mídias
- `GET /api/media` - Listar mídias
- `POST /api/media/upload` - Upload de arquivos
- `GET /api/media/:id` - Obter mídia por ID
- `GET /api/media/:id/download` - Download de arquivo
- `GET /api/media/:id/thumbnail` - Thumbnail
- `GET /api/media/:id/preview` - Preview
- `PUT /api/media/:id` - Atualizar mídia
- `DELETE /api/media/:id` - Deletar mídia
- `POST /api/media/:id/share` - Compartilhar mídia

### Usuário
- `GET /api/user/profile` - Obter perfil
- `PUT /api/user/profile` - Atualizar perfil
- `PUT /api/user/password` - Alterar senha
- `DELETE /api/user/account` - Deletar conta

### Estatísticas
- `GET /api/stats/storage` - Estatísticas de armazenamento
- `GET /api/stats/media` - Estatísticas de mídia
- `GET /api/stats/system` - Estatísticas do sistema (admin)

### Busca
- `GET /api/search` - Buscar mídias
- `POST /api/search/advanced` - Busca avançada
- `GET /api/search/suggestions` - Sugestões de busca

## 🗄️ Banco de Dados

O sistema usa SQLite com as seguintes tabelas:

- **users** - Usuários do sistema
- **media** - Arquivos de mídia
- **shares** - Compartilhamentos

### Usuário Padrão

- **Email:** admin@midiaazul.com
- **Senha:** admin123

## 🔒 Segurança

- **JWT Tokens** - Autenticação segura
- **Rate Limiting** - Proteção contra spam
- **Validação de Arquivos** - Tipos e tamanhos permitidos
- **CORS** - Configurado para o frontend
- **Helmet** - Headers de segurança

## 📁 Estrutura de Arquivos

```
backend/
├── controllers/          # Controladores
├── database/            # Banco de dados
│   └── init.js         # Inicialização do banco
├── middleware/          # Middlewares
│   ├── auth.js         # Autenticação
│   └── errorHandler.js # Tratamento de erros
├── routes/             # Rotas da API
│   ├── auth.js         # Autenticação
│   ├── media.js        # Mídias
│   ├── user.js         # Usuário
│   ├── stats.js        # Estatísticas
│   └── search.js       # Busca
├── uploads/            # Arquivos enviados
│   ├── media/          # Mídias originais
│   └── thumbnails/     # Thumbnails
├── config.js           # Configuração
├── server.js           # Servidor principal
└── package.json        # Dependências
```

## 🚀 Deploy

### Local
```bash
npm start
```

### VPS com PM2
```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicação
pm2 start server.js --name "midia-azul-api"

# Salvar configuração
pm2 save
pm2 startup
```

### Docker (Opcional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 📊 Monitoramento

- **Health Check:** `GET /health`
- **Logs:** Console e arquivos de log
- **Métricas:** Estatísticas de uso

## 🔧 Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Executar testes
npm test
```

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs do console
2. Confirme as configurações
3. Teste a conectividade
4. Verifique permissões de arquivo

