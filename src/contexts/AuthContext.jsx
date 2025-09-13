import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, auth } from '../lib/supabase'
import toast from 'react-hot-toast'

export const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Verificar sessão inicial
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Login
  const signIn = async (email, password) => {
    setLoading(true)
    
    try {
      const { data, error } = await auth.signIn(email, password)
      
      if (error) {
        toast.error(error.message)
        return { success: false, error }
      }

      toast.success('Login realizado com sucesso!')
      return { success: true, data }
    } catch (error) {
      console.error('Erro no login:', error)
      toast.error('Erro ao fazer login')
      return { success: false, error: { message: 'Erro interno' } }
    } finally {
      setLoading(false)
    }
  }

  // Registro
  const signUp = async (email, password, userData = {}) => {
    setLoading(true)
    
    try {
      const { data, error } = await auth.signUp(email, password, userData)
      
      if (error) {
        toast.error(error.message)
        return { success: false, error }
      }

      toast.success('Conta criada com sucesso! Verifique seu email.')
      return { success: true, data }
    } catch (error) {
      console.error('Erro no registro:', error)
      toast.error('Erro ao criar conta')
      return { success: false, error: { message: 'Erro interno' } }
    } finally {
      setLoading(false)
    }
  }

  // Logout
  const signOut = async () => {
    setLoading(true)
    
    try {
      const { error } = await auth.signOut()
      
      if (error) {
        toast.error(error.message)
        return { success: false, error }
      }

      toast.success('Logout realizado com sucesso!')
      return { success: true }
    } catch (error) {
      console.error('Erro no logout:', error)
      toast.error('Erro ao fazer logout')
      return { success: false, error: { message: 'Erro interno' } }
    } finally {
      setLoading(false)
    }
  }

  // Obter usuário atual
  const getCurrentUser = async () => {
    try {
      const user = await auth.getCurrentUser()
      return user
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error)
      return null
    }
  }

  // Atualizar perfil
  const updateProfile = async (updates) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.updateUser(updates)
      
      if (error) {
        toast.error(error.message)
        return { success: false, error }
      }

      toast.success('Perfil atualizado com sucesso!')
      return { success: true, data }
    } catch (error) {
      toast.error('Erro ao atualizar perfil')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    getCurrentUser,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
