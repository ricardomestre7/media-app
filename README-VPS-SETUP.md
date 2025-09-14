# Mídia Azul - Portal de Acesso ao VPS

Este é um portal de acesso às suas mídias hospedadas no VPS com 1TB de armazenamento.

## 🚀 Funcionalidades Implementadas

- ✅ **Sistema de Autenticação** - Login seguro com JWT
- ✅ **Interface Moderna** - Design responsivo com tema azul
- ✅ **Integração com VPS** - Conecta diretamente ao seu servidor
- ✅ **Upload de Mídias** - Envio de imagens, vídeos e áudios
- ✅ **Visualização de Mídias** - Grid e lista com thumbnails
- ✅ **Sistema de Filtros** - Por tipo, favoritos, recentes, etc.
- ✅ **Busca Inteligente** - Pesquisa por nome, tipo e categoria
- ✅ **Compartilhamento** - Links seguros para compartilhar
- ✅ **Download Direto** - Baixar arquivos do VPS
- ✅ **Estatísticas de Armazenamento** - Uso real do seu 1TB

## 🔧 Configuração do VPS

### 1. Backend API (Node.js/Express)

Crie um servidor backend no seu VPS com as seguintes rotas:

```javascript
// Exemplo de estrutura da API
const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Autenticação
app.post('/api/auth/login', (req, res) => {
  // Implementar validação de credenciais
  // Retornar JWT token
});

// Mídias
app.get('/api/media', authenticateToken, (req, res) => {
  // Listar mídias do usuário
});

app.post('/api/media/upload', authenticateToken, upload.array('file'), (req, res) => {
  // Upload de arquivos para o VPS
});

app.get('/api/media/:id/download', authenticateToken, (req, res) => {
  // Download de arquivo
});

app.get('/api/media/:id/thumbnail', authenticateToken, (req, res) => {
  // Gerar thumbnail
});

// Estatísticas
app.get('/api/stats/storage', authenticateToken, (req, res) => {
  // Retornar uso de armazenamento
});
```

### 2. Configuração do Frontend

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_API_URL=https://seu-vps.com:3001
```

3. **Executar o projeto:**
```bash
npm run dev
```

### 3. Estrutura de Dados Esperada

A API deve retornar dados no seguinte formato:

```json
{
  "media": [
    {
      "id": "unique-id",
      "name": "arquivo.jpg",
      "type": "image",
      "size": "2.5 MB",
      "category": "Fotos",
      "isFavorite": false,
      "isShared": false,
      "isDeleted": false,
      "createdAt": "2024-01-15T10:30:00Z",
      "userId": "user-id",
      "thumbnail": true
    }
  ],
  "stats": {
    "used": 536870912000, // bytes
    "total": 1099511627776, // 1TB em bytes
    "files": 150
  }
}
```

## 🎨 Personalização

### Cores e Tema
O tema azul pode ser personalizado editando `src/index.css`:

```css
:root {
  --primary-blue: #1e40af;
  --secondary-blue: #3b82f6;
  --accent-cyan: #06b6d4;
}
```

### Logo e Branding
Edite `src/pages/Login.jsx` e `src/pages/Dashboard.jsx` para alterar:
- Nome da aplicação
- Logo/ícone
- Cores do gradiente

## 🔒 Segurança

- **JWT Tokens** - Autenticação segura
- **CORS** - Configurado para seu domínio
- **Validação de Arquivos** - Tipos e tamanhos permitidos
- **Rate Limiting** - Proteção contra spam
- **HTTPS** - Recomendado para produção

## 📱 Responsividade

O portal é totalmente responsivo e funciona em:
- 💻 Desktop
- 📱 Mobile
- 📱 Tablet

## 🚀 Deploy

### Frontend (Vercel/Netlify)
```bash
npm run build
# Upload da pasta dist/
```

### Backend (VPS)
```bash
# Instalar dependências
npm install

# Configurar PM2
pm2 start server.js --name "midia-api"

# Configurar Nginx (opcional)
# Proxy para porta 3001
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console
2. Confirme se a API está rodando
3. Verifique as configurações de CORS
4. Teste a conectividade com o VPS

## 🔄 Próximas Funcionalidades

- [ ] Compressão automática de imagens
- [ ] Player de vídeo integrado
- [ ] Player de áudio integrado
- [ ] Edição de metadados
- [ ] Organização em pastas
- [ ] Backup automático
- [ ] Notificações em tempo real

