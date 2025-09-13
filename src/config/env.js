// Configurações de ambiente
export const config = {
  // Supabase
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
  },
  
  // Google Drive
  googleDrive: {
    apiKey: import.meta.env.VITE_GOOGLE_DRIVE_API_KEY || 'your-api-key',
    clientId: import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID || 'your-client-id',
    clientSecret: import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_SECRET || 'your-client-secret',
    redirectUri: import.meta.env.VITE_GOOGLE_DRIVE_REDIRECT_URI || 'http://localhost:5173/auth/callback'
  },
  
  // App
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Media Center',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0'
  }
}

export default config
