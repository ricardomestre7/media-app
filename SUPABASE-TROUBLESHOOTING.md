# 🔧 Guia de Resolução de Problemas - Supabase

## ✅ Status da Integração

### Arquivos Configurados:
- ✅ `.env` - Credenciais configuradas
- ✅ `src/config/supabase.js` - Cliente configurado
- ✅ `src/contexts/SupabaseAuthContext.jsx` - Context criado
- ✅ `src/pages/SupabaseTest.jsx` - Página de teste
- ✅ Rota `/supabase-test` adicionada

## 🚀 Como Testar

### 1. Acesse a Página de Teste
```
http://localhost:5173/supabase-test
```

### 2. Verifique o Console do Navegador
Abra as ferramentas de desenvolvedor (F12) e vá para a aba Console.
Você deve ver:
```
✅ Supabase client criado com sucesso
URL: https://yuoawkbxugsptuphhwmq.supabase.co
Anon Key configurada: true
```

### 3. Teste o Registro
1. Digite um email válido
2. Digite uma senha (mínimo 6 caracteres)
3. Clique em "Registrar"
4. Verifique os logs no console

### 4. Teste o Login
1. Use as mesmas credenciais
2. Clique em "Entrar"
3. Verifique se o usuário aparece logado

## 🔍 Problemas Comuns e Soluções

### ❌ "Invalid API key"
**Causa:** Chave API incorreta ou expirada
**Solução:**
1. Verifique se `VITE_SUPABASE_ANON_KEY` está correta no `.env`
2. Acesse o painel do Supabase → Settings → API
3. Copie a chave "anon public" novamente

### ❌ "Invalid URL"
**Causa:** URL do projeto incorreta
**Solução:**
1. Verifique se `VITE_SUPABASE_URL` está correta no `.env`
2. Acesse o painel do Supabase → Settings → API
3. Copie a "Project URL" novamente

### ❌ "Email not confirmed"
**Causa:** Email de confirmação não foi clicado
**Solução:**
1. Verifique sua caixa de entrada
2. Clique no link de confirmação
3. Ou desabilite a confirmação por email no Supabase:
   - Authentication → Settings → Email Auth → Disable "Enable email confirmations"

### ❌ "User already registered"
**Causa:** Email já foi usado
**Solução:**
1. Use um email diferente
2. Ou faça login com o email existente
3. Ou delete o usuário no painel do Supabase

### ❌ "Password should be at least 6 characters"
**Causa:** Senha muito curta
**Solução:**
- Use uma senha com pelo menos 6 caracteres

## 🛠️ Verificações Adicionais

### 1. Verificar Variáveis de Ambiente
```bash
# No terminal do projeto
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

### 2. Verificar Configuração do Projeto Supabase
1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em Authentication → Settings
4. Verifique se "Enable email confirmations" está como desejado

### 3. Verificar Políticas RLS (Row Level Security)
1. Acesse Authentication → Policies
2. Se houver tabelas customizadas, verifique as políticas
3. Para testes, você pode desabilitar RLS temporariamente

## 📋 Logs Úteis

Quando algo não funcionar, verifique estes logs no console:

```javascript
// Logs de conexão
✅ Supabase client criado com sucesso

// Logs de registro
🔄 Tentando registrar usuário: email@exemplo.com
📋 Resposta do registro: { data: {...}, error: null }
✅ Usuário registrado: {...}

// Logs de login
🔄 Tentando fazer login: email@exemplo.com
📋 Resposta do login: { data: {...}, error: null }
✅ Usuário logado: {...}
```

## 🆘 Se Nada Funcionar

1. **Reinicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Limpe o cache do navegador:**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

3. **Verifique se o projeto Supabase está ativo:**
   - Acesse o painel do Supabase
   - Verifique se o projeto não foi pausado

4. **Recrie as credenciais:**
   - Gere novas chaves API no Supabase
   - Atualize o arquivo `.env`
   - Reinicie o servidor

## 📞 Próximos Passos

Após resolver os problemas:

1. **Integre com o AuthContext existente:**
   ```jsx
   import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext'
   ```

2. **Configure as tabelas necessárias no Supabase**

3. **Implemente as funcionalidades específicas do seu projeto**

---

**💡 Dica:** Mantenha sempre o console do navegador aberto durante os testes para ver os logs em tempo real.