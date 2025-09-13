// Simulação de autenticação para desenvolvimento
import { devConfig } from '../config/dev'

class AuthDev {
  constructor() {
    this.user = null
    this.isAuthenticated = false
    this.loading = false
    this.listeners = []
  }

  // Simular login
  async signIn(email, password) {
    this.loading = true
    
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Verificar credenciais de teste
      if (email === 'teste@exemplo.com' && password === '123456') {
        this.user = devConfig.testUser
        this.isAuthenticated = true
        this.notifyListeners()
        return { success: true, data: { user: this.user } }
      } else {
        return { 
          success: false, 
          error: { message: 'Email ou senha incorretos' } 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      }
    } finally {
      this.loading = false
    }
  }

  // Simular registro
  async signUp(email, password, userData = {}) {
    this.loading = true
    
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simular criação de usuário
      const newUser = {
        id: 'user-' + Date.now(),
        email: email,
        name: userData.name || 'Novo Usuário',
        user_metadata: {
          name: userData.name || 'Novo Usuário'
        }
      }
      
      this.user = newUser
      this.isAuthenticated = true
      this.notifyListeners()
      
      return { success: true, data: { user: this.user } }
    } catch (error) {
      return { 
        success: false, 
        error: { message: 'Erro ao criar conta' } 
      }
    } finally {
      this.loading = false
    }
  }

  // Simular logout
  async signOut() {
    this.loading = true
    
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500))
      
      this.user = null
      this.isAuthenticated = false
      this.notifyListeners()
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: { message: 'Erro ao fazer logout' } 
      }
    } finally {
      this.loading = false
    }
  }

  // Obter usuário atual
  async getCurrentUser() {
    return this.user
  }

  // Escutar mudanças de autenticação
  onAuthStateChange(callback) {
    this.listeners.push(callback)
    
    // Retornar função de unsubscribe
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  // Notificar listeners
  notifyListeners() {
    this.listeners.forEach(callback => {
      callback('SIGNED_IN', { user: this.user })
    })
  }

  // Verificar sessão existente
  async getSession() {
    return {
      data: {
        session: this.user ? { user: this.user } : null
      }
    }
  }
}

export const authDev = new AuthDev()
export default authDev
