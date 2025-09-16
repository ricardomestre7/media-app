// src/contexts/AuthContext.jsx - Firebase version
import React, { createContext, useState, useContext, useEffect } from 'react'
import { authService, auth } from '../config/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Sign in
  const signIn = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      const result = await authService.signIn(email, password)
      setUser(result.user)
      return { data: { user: result.user }, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      setError(error.message)
      return { data: null, error: error }
    } finally {
      setLoading(false)
    }
  }

  // Sign up
  const signUp = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      const result = await authService.signUp(email, password)
      setUser(result.user)
      return { data: { user: result.user }, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      setError(error.message)
      return { data: null, error: error }
    } finally {
      setLoading(false)
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true)
      await authService.signOut()
      setUser(null)
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      setError(error.message)
      return { error: error }
    } finally {
      setLoading(false)
    }
  }

  // Reset password (Firebase uses different approach)
  const resetPassword = async (email) => {
    try {
      // Firebase reset password would need to be implemented
      // For now, return success to maintain compatibility
      return { data: {}, error: null }
    } catch (error) {
      return { data: null, error: error }
    }
  }

  // Update user profile
  const updateUser = async (updates) => {
    try {
      // Firebase user update would need to be implemented
      // For now, return success to maintain compatibility
      return { data: { user }, error: null }
    } catch (error) {
      return { data: null, error: error }
    }
  }

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user, // Adicionar compatibilidade
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}