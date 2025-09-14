#!/bin/bash

# Script de Deploy Automático - Mídia Azul
# Uso: ./deploy.sh [VPS_IP] [DOMAIN]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Mídia Azul - Deploy Automático${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Verificar parâmetros
if [ $# -lt 2 ]; then
    print_error "Uso: $0 <VPS_IP> <DOMAIN>"
    print_error "Exemplo: $0 192.168.1.100 midiaazul.com"
    exit 1
fi

VPS_IP=$1
DOMAIN=$2
USER="midiaazul"
APP_DIR="/home/$USER/midia-app"

print_header

# 1. Build do Frontend
print_message "Construindo frontend..."
npm run build

# 2. Comprimir arquivos
print_message "Comprimindo arquivos..."
tar -czf midia-azul.tar.gz dist/ backend/ package.json package-lock.json

# 3. Enviar para VPS
print_message "Enviando arquivos para VPS ($VPS_IP)..."
scp midia-azul.tar.gz $USER@$VPS_IP:/home/$USER/

# 4. Executar comandos no VPS
print_message "Configurando aplicação no VPS..."

ssh $USER@$VPS_IP << EOF
    set -e
    
    echo "Parando aplicação..."
    pm2 stop midia-azul-api 2>/dev/null || true
    
    echo "Fazendo backup..."
    cp -r $APP_DIR $APP_DIR.backup.\$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
    
    echo "Extraindo novos arquivos..."
    cd /home/$USER
    tar -xzf midia-azul.tar.gz
    
    echo "Instalando dependências do backend..."
    cd $APP_DIR/backend
    npm install --production
    
    echo "Configurando variáveis de ambiente..."
    cat > .env << EOL
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://$DOMAIN
JWT_SECRET=midia_azul_jwt_secret_$(date +%s)_$(openssl rand -hex 16)
DB_PATH=$APP_DIR/backend/database/midia_azul.db
MAX_FILE_SIZE=104857600
UPLOAD_PATH=$APP_DIR/backend/uploads
CORS_ORIGIN=https://$DOMAIN
EOL
    
    echo "Criando diretórios necessários..."
    mkdir -p $APP_DIR/backend/database
    mkdir -p $APP_DIR/backend/uploads/media
    mkdir -p $APP_DIR/backend/uploads/thumbnails
    
    echo "Configurando permissões..."
    chmod -R 755 $APP_DIR/backend/uploads/
    
    echo "Iniciando aplicação..."
    pm2 start server.js --name "midia-azul-api"
    pm2 save
    
    echo "Configurando Nginx..."
    sudo tee /etc/nginx/sites-available/midia-azul > /dev/null << EOL
server {
    listen 80;
    server_name $DOMAIN;
    
    # Frontend
    location / {
        root $APP_DIR/dist;
        try_files \$uri \$uri/ /index.html;
    }
    
    # API Backend
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Uploads
    location /uploads/ {
        alias $APP_DIR/backend/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOL
    
    echo "Ativando site no Nginx..."
    sudo ln -sf /etc/nginx/sites-available/midia-azul /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl reload nginx
    
    echo "Configurando SSL com Certbot..."
    sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN || true
    
    echo "Configurando firewall..."
    sudo ufw allow 22
    sudo ufw allow 80
    sudo ufw allow 443
    sudo ufw --force enable
    
    echo "Limpando arquivos temporários..."
    rm -f /home/$USER/midia-azul.tar.gz
    
    echo "Verificando status da aplicação..."
    pm2 status
    pm2 logs midia-azul-api --lines 10
EOF

# 5. Limpeza local
print_message "Limpando arquivos locais..."
rm -f midia-azul.tar.gz

# 6. Verificação final
print_message "Verificando deploy..."
sleep 5

if curl -s -f "https://$DOMAIN" > /dev/null; then
    print_message "✅ Deploy concluído com sucesso!"
    print_message "🌐 Acesse: https://$DOMAIN"
    print_message "📧 Login: admin@midiaazul.com"
    print_message "🔑 Senha: admin123"
else
    print_warning "⚠️ Deploy concluído, mas site pode não estar acessível ainda."
    print_warning "Aguarde alguns minutos para o SSL ser configurado."
fi

print_message "📋 Próximos passos:"
print_message "1. Acesse https://$DOMAIN"
print_message "2. Faça login com as credenciais padrão"
print_message "3. Altere a senha padrão"
print_message "4. Configure backup automático"
print_message "5. Monitore o uso de recursos"

print_header
print_message "Deploy finalizado! 🚀"


