// Sistema de autenticação simples para desenvolvimento
class SimpleAuth {
  constructor() {
    this.user = null
    this.isAuthenticated = false
    this.loading = false
    this.listeners = []
  }

  // Login simples
  async signIn(email, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'teste@exemplo.com' && password === '123456') {
          this.user = {
            id: 'test-user-123',
            email: 'teste@exemplo.com',
            name: 'Usuário Teste',
            user_metadata: {
              name: 'Usuário Teste'
            }
          }
          this.isAuthenticated = true
          this.notifyListeners()
          resolve({ success: true, data: { user: this.user } })
        } else {
          resolve({ 
            success: false, 
            error: { message: 'Email ou senha incorretos' } 
          })
        }
      }, 1000)
    })
  }

  // Registro simples
  async signUp(email, password, userData = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
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
        
        resolve({ success: true, data: { user: this.user } })
      }, 1500)
    })
  }

  // Logout simples
  async signOut() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.user = null
        this.isAuthenticated = false
        this.notifyListeners()
        resolve({ success: true })
      }, 500)
    })
  }

  // Obter usuário atual
  getCurrentUser() {
    return this.user
  }

  // Verificar sessão
  async getSession() {
    return {
      data: {
        session: this.user ? { user: this.user } : null
      }
    }
  }

  // Escutar mudanças
  onAuthStateChange(callback) {
    this.listeners.push(callback)
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
}

export const simpleAuth = new SimpleAuth()
export default simpleAuth
