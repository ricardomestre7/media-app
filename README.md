# Media Center - Gerenciador de Mídias Digitais

Um aplicativo moderno para gerenciar suas mídias digitais (imagens, vídeos, GIFs, música) com integração ao Google Drive, cache inteligente e interface responsiva.

## 🚀 Funcionalidades

- ✅ Sistema de autenticação completo (login/registro)
- ✅ Upload de arquivos para Google Drive com drag & drop
- ✅ Visualização em grid e lista responsiva
- ✅ Player de mídia integrado com controles avançados
- ✅ Download otimizado
- ✅ Busca e filtros avançados
- ✅ Cache inteligente para acesso instantâneo
- ✅ Interface responsiva e moderna com animações
- ✅ PWA (Progressive Web App)
- ✅ Suporte offline básico
- ✅ Estatísticas de uso e armazenamento
- ✅ Sistema de notificações personalizado
- ✅ Loading skeletons para melhor UX
- ✅ Thumbnails automáticos
- ✅ Suporte a múltiplos tipos de mídia

## 🛠️ Tecnologias

- **Frontend**: React 18 + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Storage**: Google Drive API
- **Styling**: Tailwind CSS
- **State Management**: React Query + Context API
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📋 Pré-requisitos

- Node.js 18+ 
- Conta no Supabase
- Conta no Google Cloud Console
- Google Drive API habilitada

## ⚙️ Configuração

### 1. Clone e instale dependências

```bash
cd media-app
npm install
```

### 2. Configure o Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Vá para Settings > API
3. Copie a URL e a chave anon
4. Crie a tabela `media_files`:

```sql
CREATE TABLE media_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  size BIGINT NOT NULL,
  type TEXT NOT NULL,
  google_drive_id TEXT NOT NULL,
  google_drive_url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own files" ON media_files
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own files" ON media_files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own files" ON media_files
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own files" ON media_files
  FOR DELETE USING (auth.uid() = user_id);
```

### 3. Configure o Google Drive API

1. Vá para [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione existente
3. Habilite a Google Drive API
4. Crie credenciais (OAuth 2.0 Client ID)
5. Configure URIs de redirecionamento: `http://localhost:5173/auth/callback`

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Google Drive API Configuration
VITE_GOOGLE_DRIVE_API_KEY=your-api-key
VITE_GOOGLE_DRIVE_CLIENT_ID=your-client-id
VITE_GOOGLE_DRIVE_CLIENT_SECRET=your-client-secret
VITE_GOOGLE_DRIVE_REDIRECT_URI=http://localhost:5173/auth/callback

# App Configuration
VITE_APP_NAME=Media Center
VITE_APP_VERSION=1.0.0
```

### 5. Execute o projeto

```bash
npm run dev
```

Acesse `http://localhost:5173`

## 📱 PWA

O app é um Progressive Web App (PWA) que pode ser instalado no dispositivo:

- **Desktop**: Chrome/Edge mostrará botão de instalação
- **Mobile**: Adicionar à tela inicial
- **Offline**: Funciona offline com cache inteligente

## 🎨 Interface

- **Design moderno** com Tailwind CSS
- **Animações suaves** com Framer Motion
- **Responsivo** para todos os dispositivos
- **Tema claro** otimizado para produtividade

## 🔧 Estrutura do Projeto

```
src/
├── components/                    # Componentes reutilizáveis
│   ├── MediaManager.jsx          # Gerenciador principal de mídias
│   ├── MediaPlayer.jsx           # Player de mídia
│   ├── MediaStats.jsx            # Estatísticas de uso
│   ├── LoadingSkeleton.jsx       # Skeleton de carregamento
│   ├── NotificationToast.jsx     # Toast de notificação
│   ├── NotificationContainer.jsx # Container de notificações
│   └── PrivateRoute.jsx          # Rota protegida
├── contexts/                     # Contextos React
│   ├── AuthContext.jsx           # Contexto de autenticação
│   ├── MediaContext.jsx          # Contexto de mídias
│   └── NotificationContext.jsx   # Contexto de notificações
├── hooks/                        # Hooks personalizados
│   ├── useAuth.js                # Hook de autenticação
│   ├── useMedia.js               # Hook de mídias
│   ├── useOffline.js             # Hook offline
│   └── useNotifications.js       # Hook de notificações
├── lib/                          # Bibliotecas e configurações
│   ├── supabase.js               # Cliente Supabase
│   ├── googleDrive.js            # API Google Drive
│   └── cache.js                  # Sistema de cache
├── pages/                        # Páginas da aplicação
│   ├── LoginPage.jsx             # Página de login
│   ├── RegisterPage.jsx          # Página de registro
│   └── MediaPage.jsx             # Página principal
└── config/
    └── env.js                    # Configurações de ambiente
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Netlify

1. Build: `npm run build`
2. Publish directory: `dist`
3. Configure variáveis de ambiente

## 🔒 Segurança

- Autenticação via Supabase
- Row Level Security (RLS) no banco
- Tokens JWT seguros
- Validação de tipos de arquivo
- Sanitização de inputs

## 📊 Performance

- Cache inteligente com IndexedDB
- Lazy loading de imagens
- Compressão de thumbnails
- Otimização de bundle
- Service Worker para cache

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique as [Issues](../../issues) existentes
2. Crie uma nova issue com detalhes
3. Entre em contato via email

---

**Desenvolvido com ❤️ para organizar suas mídias digitais**