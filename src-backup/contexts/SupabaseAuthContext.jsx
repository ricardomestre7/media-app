import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, auth } from '../config/supabase';

const SupabaseAuthContext = createContext();

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth deve ser usado dentro de um SupabaseAuthProvider');
  }
  return context;
};

export const SupabaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log('SupabaseAuth: Inicializando...');
    
    // Verificar se há sessão ativa
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao obter sessão:', error);
        } else if (session) {
          console.log('Sessão encontrada:', session.user.email);
          setSession(session);
          setUser(session.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Erro na inicialização:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      
      const { data, error } = await auth.signIn(email, password);
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log('Login realizado com sucesso:', data.user.email);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, metadata = {}) => {
    try {
      setLoading(true);
      
      const { data, error } = await auth.signUp(email, password, metadata);
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log('Registro realizado:', data.user?.email);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      const { error } = await auth.signOut();
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log('Logout realizado com sucesso');
      return { success: true };
    } catch (error) {
      console.error('Erro no logout:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    session,
    isAuthenticated,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    supabase // Expor cliente para uso direto quando necessário
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export default SupabaseAuthProvider;