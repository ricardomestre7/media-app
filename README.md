# 🎬 Mídia Azul - Portal de Mídia

Uma plataforma moderna para gerenciamento e compartilhamento de mídias com interface elegante e funcionalidades avançadas.

## ✨ Funcionalidades

- 🔐 **Autenticação Segura** - Login com JWT
- 📁 **Upload de Mídias** - Imagens, vídeos e áudios
- 🖼️ **Visualização** - Grid e lista com thumbnails
- 🔍 **Busca Inteligente** - Filtros por categoria e nome
- 📊 **Estatísticas** - Uso de armazenamento em tempo real
- 🔗 **Compartilhamento** - Links seguros para compartilhar
- 📱 **Responsivo** - Design adaptável para mobile
- 🎨 **Interface Moderna** - Tema azul com efeitos glass

## 🚀 Tecnologias

### Frontend
- **React 18** - Framework principal
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **Radix UI** - Componentes acessíveis
- **React Router** - Navegação

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework web
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **Multer** - Upload de arquivos
- **Sharp** - Processamento de imagens

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/midia-azul.git
cd midia-azul
```

### 2. Instale as dependências
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 3. Configure as variáveis de ambiente
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=Mídia Azul

# Backend (backend/.env)
PORT=3001
JWT_SECRET=sua_chave_secreta_aqui
FRONTEND_URL=http://localhost:5173
```

### 4. Execute o projeto
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm start
```

## 🌐 Acesso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### Credenciais Padrão
- **Email**: admin@midiaazul.com
- **Senha**: admin123

## 🚀 Deploy

### Vercel (Frontend)
```bash
# Instale o Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### VPS (Backend)
```bash
# Use o script de deploy
./deploy.sh SEU_VPS_IP SEU_DOMINIO.com
```

## 📁 Estrutura do Projeto

```
midia-app/
├── src/                     # Frontend React
│   ├── components/          # Componentes UI
│   ├── pages/              # Páginas
│   ├── contexts/           # Context de autenticação
│   ├── hooks/              # Hooks personalizados
│   ├── services/           # Serviços de API
│   └── config/             # Configurações
├── backend/                # Backend Node.js
│   ├── routes/             # Rotas da API
│   ├── middleware/         # Middlewares
│   ├── database/           # Banco SQLite
│   └── uploads/            # Arquivos enviados
├── vercel.json             # Configuração Vercel
└── deploy.sh               # Script de deploy
```

## 🔧 Scripts Disponíveis

### Frontend
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm start` - Servidor de produção

### Backend
- `npm start` - Servidor de produção
- `npm run dev` - Servidor de desenvolvimento

## 📊 Tipos de Arquivo Suportados

### Imagens
- JPEG, PNG, GIF, WebP, BMP, TIFF, SVG

### Vídeos
- MP4, AVI, MOV, MKV, WebM, FLV, WMV, 3GP

### Áudios
- MP3, WAV, OGG, AAC, FLAC, M4A, WMA

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para suporte@midiaazul.com ou abra uma issue no GitHub.

---

**Desenvolvido com ❤️ pela equipe Mídia Azul**
