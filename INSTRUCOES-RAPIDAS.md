# 🚀 Instruções Rápidas - Teste Local

## ⚡ Início Rápido

### 1. Backend (Terminal 1)
```bash
cd backend
npm install
npm start
```
**OU** execute: `backend/start-backend.bat`

### 2. Frontend (Terminal 2)
```bash
npm install
npm run dev
```
**OU** execute: `teste-local.bat`

## 🌐 Acessos

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 📱 Teste em Dispositivos Móveis

1. Descubra seu IP: `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
2. Acesse: `http://[SEU_IP]:3000`
3. Exemplo: `http://192.168.1.100:3000`

## ✅ O que foi implementado

- ✅ **Layout Horizontal**: Cards agora são horizontais (thumbnail + info)
- ✅ **Host Local**: Configurado para acesso de rede
- ✅ **CORS**: Backend aceita conexões da porta 3000
- ✅ **Scripts**: Arquivos .bat para facilitar o teste
- ✅ **Responsivo**: Funciona em desktop e mobile

## 🎯 Layout dos Cards

```
┌─────────────────────────────────────────┐
│ [THUMBNAIL] │ Título da Mídia          │
│ 128x128px   │ Tipo • Tamanho • Data    │
│             │ [Download] [Tipo Icon]   │
└─────────────────────────────────────────┘
```

## 🔧 Solução de Problemas

- **Erro de CORS**: Verifique se o backend está rodando na porta 3001
- **Não carrega**: Verifique o console do navegador
- **Mobile não acessa**: Confirme que estão na mesma rede Wi-Fi
