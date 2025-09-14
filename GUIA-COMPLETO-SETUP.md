# 🚀 Guia Completo - Mídia Azul Portal VPS

## 📋 O que foi criado

✅ **Frontend React** - Portal de acesso às mídias  
✅ **Backend Node.js** - API completa para VPS  
✅ **Sistema de Autenticação** - Login seguro com JWT  
✅ **Upload de Mídias** - Suporte a imagens, vídeos e áudios  
✅ **Banco SQLite** - Armazenamento local  
✅ **Thumbnails Automáticos** - Para imagens  
✅ **Sistema de Busca** - Busca avançada  
✅ **Estatísticas** - Uso do seu 1TB  

## 🎯 Como usar AGORA

### 1. **Frontend (já rodando)**
```bash
# O frontend já está rodando em:
http://localhost:5173
```

### 2. **Backend (já rodando)**
```bash
# O backend já está rodando em:
http://localhost:3001
```

### 3. **Testar o sistema**
1. Acesse: `http://localhost:5173`
2. Use as credenciais:
   - **Email:** admin@midiaazul.com
   - **Senha:** admin123
3. Faça upload de arquivos
4. Explore as funcionalidades!

## 🔧 Configuração para VPS

### **Passo 1: Preparar o VPS**

1. **Instalar Node.js 18+**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

2. **Instalar PM2 (gerenciador de processos)**
```bash
npm install -g pm2
```

3. **Criar usuário para a aplicação**
```bash
sudo adduser midiaazul
sudo usermod -aG sudo midiaazul
su - midiaazul
```

### **Passo 2: Enviar arquivos para VPS**

1. **Comprimir o projeto**
```bash
# No seu computador
tar -czf midia-azul.tar.gz midia-app/
```

2. **Enviar para VPS**
```bash
# Via SCP
scp midia-azul.tar.gz midiaazul@SEU_VPS_IP:/home/midiaazul/

# Via SFTP
sftp midiaazul@SEU_VPS_IP
put midia-azul.tar.gz
```

3. **Extrair no VPS**
```bash
# No VPS
cd /home/midiaazul
tar -xzf midia-azul.tar.gz
cd midia-app
```

### **Passo 3: Configurar Backend no VPS**

1. **Instalar dependências**
```bash
cd backend
npm install --production
```

2. **Configurar variáveis de ambiente**
```bash
# Criar arquivo .env
nano .env
```

Conteúdo do `.env`:
```env
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://seu-dominio.com
JWT_SECRET=SUA_CHAVE_JWT_MUITO_SEGURA_AQUI_123456789
DB_PATH=/home/midiaazul/midia-app/backend/database/midia_azul.db
MAX_FILE_SIZE=104857600
UPLOAD_PATH=/home/midiaazul/midia-app/backend/uploads
CORS_ORIGIN=https://seu-dominio.com
```

3. **Iniciar com PM2**
```bash
pm2 start server.js --name "midia-azul-api"
pm2 save
pm2 startup
```

### **Passo 4: Configurar Frontend no VPS**

1. **Instalar dependências**
```bash
cd ../
npm install
```

2. **Configurar variáveis de ambiente**
```bash
# Criar arquivo .env
nano .env
```

Conteúdo do `.env`:
```env
VITE_API_URL=https://seu-dominio.com:3001
```

3. **Build para produção**
```bash
npm run build
```

4. **Servir com Nginx**
```bash
# Instalar Nginx
sudo apt update
sudo apt install nginx

# Configurar site
sudo nano /etc/nginx/sites-available/midia-azul
```

Conteúdo da configuração Nginx:
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    
    # Frontend
    location / {
        root /home/midiaazul/midia-app/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # API Backend
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Uploads
    location /uploads/ {
        alias /home/midiaazul/midia-app/backend/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

5. **Ativar site**
```bash
sudo ln -s /etc/nginx/sites-available/midia-azul /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### **Passo 5: Configurar SSL (HTTPS)**

1. **Instalar Certbot**
```bash
sudo apt install certbot python3-certbot-nginx
```

2. **Obter certificado SSL**
```bash
sudo certbot --nginx -d seu-dominio.com
```

3. **Renovação automática**
```bash
sudo crontab -e
# Adicionar linha:
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 Configurações Avançadas

### **Firewall**
```bash
# UFW
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### **Backup Automático**
```bash
# Criar script de backup
nano /home/midiaazul/backup.sh
```

Conteúdo do script:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/midiaazul/backups"
APP_DIR="/home/midiaazul/midia-app"

mkdir -p $BACKUP_DIR

# Backup do banco
cp $APP_DIR/backend/database/midia_azul.db $BACKUP_DIR/midia_azul_$DATE.db

# Backup dos uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz $APP_DIR/backend/uploads/

# Manter apenas últimos 7 backups
find $BACKUP_DIR -name "*.db" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

```bash
# Tornar executável
chmod +x /home/midiaazul/backup.sh

# Agendar backup diário
crontab -e
# Adicionar linha:
0 2 * * * /home/midiaazul/backup.sh
```

### **Monitoramento**
```bash
# Ver logs do PM2
pm2 logs midia-azul-api

# Monitorar recursos
pm2 monit

# Reiniciar aplicação
pm2 restart midia-azul-api
```

## 📊 Estrutura Final no VPS

```
/home/midiaazul/midia-app/
├── frontend/                 # React build
│   └── dist/
├── backend/                  # Node.js API
│   ├── database/
│   │   └── midia_azul.db    # Banco SQLite
│   ├── uploads/             # Arquivos enviados
│   │   ├── media/           # Mídias originais
│   │   └── thumbnails/      # Thumbnails
│   └── server.js
└── backups/                 # Backups automáticos
```

## 🎯 URLs de Acesso

- **Frontend:** https://seu-dominio.com
- **API:** https://seu-dominio.com/api/
- **Health Check:** https://seu-dominio.com/api/health

## 🔐 Credenciais Padrão

- **Email:** admin@midiaazul.com
- **Senha:** admin123

**⚠️ IMPORTANTE:** Altere essas credenciais após o primeiro login!

## 🚨 Troubleshooting

### **Problema: Frontend não carrega**
```bash
# Verificar se build foi feito
ls -la dist/

# Verificar Nginx
sudo nginx -t
sudo systemctl status nginx
```

### **Problema: API não responde**
```bash
# Verificar PM2
pm2 status
pm2 logs midia-azul-api

# Verificar porta
netstat -tlnp | grep 3001
```

### **Problema: Upload não funciona**
```bash
# Verificar permissões
sudo chown -R midiaazul:midiaazul /home/midiaazul/midia-app/backend/uploads/
chmod -R 755 /home/midiaazul/midia-app/backend/uploads/
```

### **Problema: Banco de dados**
```bash
# Verificar se banco existe
ls -la /home/midiaazul/midia-app/backend/database/

# Recriar banco (CUIDADO: apaga dados)
rm /home/midiaazul/midia-app/backend/database/midia_azul.db
pm2 restart midia-azul-api
```

## 📈 Próximos Passos

1. **Configurar domínio** no seu provedor DNS
2. **Alterar credenciais** padrão
3. **Configurar backup** automático
4. **Monitorar** uso de recursos
5. **Personalizar** interface se desejar

## 🎉 Pronto!

Seu portal Mídia Azul está funcionando com:
- ✅ **1TB de armazenamento** no VPS
- ✅ **Interface moderna** e responsiva
- ✅ **Upload seguro** de mídias
- ✅ **Sistema de busca** avançado
- ✅ **Compartilhamento** de links
- ✅ **Estatísticas** em tempo real

**Acesse:** https://seu-dominio.com e comece a usar! 🚀

