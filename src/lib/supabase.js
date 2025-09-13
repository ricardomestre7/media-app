import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from '../config/supabase'

// Configurações do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || supabaseConfig.url
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || supabaseConfig.anonKey

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Funções auxiliares para autenticação
export const auth = {
  // Login com email e senha
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Registro com email e senha
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // Logout
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Obter usuário atual
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Escutar mudanças de autenticação
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Funções para gerenciar arquivos de mídia
export const mediaFiles = {
  // Obter todos os arquivos do usuário
  async getFiles(userId) {
    const { data, error } = await supabase
      .from('media_files')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Adicionar novo arquivo
  async addFile(fileData) {
    const { data, error } = await supabase
      .from('media_files')
      .insert([fileData])
      .select()
    
    return { data, error }
  },

  // Atualizar arquivo
  async updateFile(id, updates) {
    const { data, error } = await supabase
      .from('media_files')
      .update(updates)
      .eq('id', id)
      .select()
    
    return { data, error }
  },

  // Deletar arquivo
  async deleteFile(id) {
    const { data, error } = await supabase
      .from('media_files')
      .delete()
      .eq('id', id)
    
    return { data, error }
  },

  // Buscar arquivos
  async searchFiles(userId, query) {
    const { data, error } = await supabase
      .from('media_files')
      .select('*')
      .eq('user_id', userId)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    return { data, error }
  }
}

export default supabase
