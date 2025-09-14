# 🚀 Teste Local - Midia App

## Configuração para Teste Local

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```

### 3. Acessar a Aplicação
- **Local**: http://localhost:3000
- **Rede Local**: http://[SEU_IP]:3000

### 4. Encontrar seu IP Local
- **Windows**: `ipconfig`
- **Mac/Linux**: `ifconfig` ou `ip addr`

### 5. Testar em Dispositivos Móveis
1. Certifique-se de que o dispositivo está na mesma rede
2. Acesse `http://[SEU_IP]:3000` no navegador do dispositivo
3. Exemplo: `http://192.168.1.100:3000`

## 🎨 Mudanças Implementadas

### Layout Horizontal dos Cards
- ✅ Cards convertidos de vertical para horizontal
- ✅ Thumbnail à esquerda (128px de largura)
- ✅ Informações à direita (título, tipo, tamanho, data)
- ✅ Botão de download no hover
- ✅ Ícone de play para vídeos/áudio

### Configuração de Host
- ✅ Host configurado para `0.0.0.0` (acesso de rede)
- ✅ Porta fixa: 3000
- ✅ CORS habilitado

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 📱 Teste em Dispositivos

1. **Smartphone/Tablet**: Acesse o IP da sua máquina na mesma rede
2. **Outros Computadores**: Mesmo processo, use o IP da máquina principal
3. **Teste de Responsividade**: O layout se adapta automaticamente

## 🎯 Funcionalidades Testáveis

- ✅ Visualização de mídias em layout horizontal
- ✅ Upload de arquivos
- ✅ Filtros por tipo de mídia
- ✅ Visualização em modal
- ✅ Download de arquivos
- ✅ Interface responsiva

## 🚨 Solução de Problemas

### Não consegue acessar de outros dispositivos?
1. Verifique se o firewall está bloqueando a porta 3000
2. Confirme se os dispositivos estão na mesma rede
3. Teste primeiro no navegador do próprio computador

### Erro de CORS?
- O CORS já está configurado no Vite
- Se persistir, verifique as configurações do backend

### Cards não aparecem?
- Verifique se há mídias cadastradas
- Confirme se o backend está rodando
- Verifique o console do navegador para erros
