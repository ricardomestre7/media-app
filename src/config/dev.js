// Configurações de desenvolvimento
export const devConfig = {
  // Modo de desenvolvimento - simula autenticação
  isDevelopment: true,
  
  // Usuário de teste para desenvolvimento
  testUser: {
    id: 'test-user-123',
    email: 'teste@exemplo.com',
    name: 'Usuário Teste',
    user_metadata: {
      name: 'Usuário Teste'
    }
  },
  
  // Configurações do Supabase para desenvolvimento
  supabase: {
    url: 'https://demo.supabase.co',
    anonKey: 'demo-key'
  },
  
  // Configurações do Google Drive para desenvolvimento
  googleDrive: {
    apiKey: 'demo-api-key',
    clientId: 'demo-client-id',
    clientSecret: 'demo-client-secret',
    redirectUri: 'http://localhost:5173/auth/callback'
  }
}

export default devConfig
