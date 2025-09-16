import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, auth } from '../config/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar sessão do Supabase
  useEffect(() => {
    console.log('AuthContext: Verificando sessão do Supabase...');
    
    // Obter sessão atual
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao obter sessão:', error);
        } else if (session?.user) {
          console.log('AuthContext: Usuário logado encontrado:', session.user);
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            avatar: session.user.user_metadata?.avatar_url || `https://i.pravatar.cc/150?u=${session.user.email}`,
            createdAt: session.user.created_at
          });
          setIsAuthenticated(true);
        } else {
          console.log('AuthContext: Nenhuma sessão ativa encontrada');
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getSession();
    
    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthContext: Estado de auth mudou:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            avatar: session.user.user_metadata?.avatar_url || `https://i.pravatar.cc/150?u=${session.user.email}`,
            createdAt: session.user.created_at
          });
          setIsAuthenticated(true);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
        }
        
        setLoading(false);
      }
    );
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email, password) => {
    // Validações de entrada
    if (!email || !password) {
      return { success: false, error: 'Email e senha são obrigatórios' };
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: 'Email inválido' };
    }
    
    try {
      setLoading(true);
      console.log('AuthContext: Tentando login com Supabase para:', email);
      
      const { data, error } = await auth.signIn(email, password);
      
      if (error) {
        console.error('Erro no login:', error);
        // Mapear erros específicos do Supabase para mensagens mais amigáveis
        const errorMessage = error.message.includes('Invalid login credentials') 
          ? 'Email ou senha incorretos'
          : error.message.includes('Email not confirmed')
          ? 'Email não confirmado. Verifique sua caixa de entrada'
          : error.message;
        return { success: false, error: errorMessage };
      }
      
      if (data?.user) {
        console.log('Login bem-sucedido:', data.user.email);
        return { success: true };
      }
      
      return { success: false, error: 'Erro desconhecido no login' };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro de conexão. Tente novamente.' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log('AuthContext: Fazendo logout...');
      const { error } = await auth.signOut();
      
      if (error) {
        console.error('Erro no logout:', error);
        throw new Error('Erro ao fazer logout');
      } else {
        console.log('Logout bem-sucedido');
      }
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  }, []);
  
  const signUp = useCallback(async (email, password, metadata = {}) => {
    // Validações de entrada
    if (!email || !password) {
      return { success: false, error: 'Email e senha são obrigatórios' };
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: 'Email inválido' };
    }
    
    if (password.length < 6) {
      return { success: false, error: 'Senha deve ter pelo menos 6 caracteres' };
    }
    
    try {
      setLoading(true);
      console.log('AuthContext: Tentando registro com Supabase para:', email);
      
      const { data, error } = await auth.signUp(email, password, metadata);
      
      if (error) {
        console.error('Erro no registro:', error);
        const errorMessage = error.message.includes('User already registered')
          ? 'Este email já está cadastrado'
          : error.message.includes('Password should be at least')
          ? 'Senha muito fraca. Use pelo menos 6 caracteres'
          : error.message;
        return { success: false, error: errorMessage };
      }
      
      if (data?.user) {
        console.log('Registro bem-sucedido:', data.user.email);
        return { success: true, needsConfirmation: !data.session };
      }
      
      return { success: false, error: 'Erro desconhecido no registro' };
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, error: 'Erro de conexão. Tente novamente.' };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    try {
      setLoading(true);
      console.log('AuthContext: Atualizando perfil do usuário...');
      
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      });
      
      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        throw new Error(error.message);
      }
      
      if (data?.user) {
        console.log('Perfil atualizado com sucesso:', data.user);
        // Atualizar o estado local do usuário
        setUser(prevUser => ({
          ...prevUser,
          ...data.user,
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
          user_metadata: data.user.user_metadata
        }));
        return { success: true };
      }
      
      return { success: false, error: 'Erro desconhecido ao atualizar perfil' };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email) => {
    try {
      setLoading(true);
      console.log('AuthContext: Enviando email de reset de senha...');
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        console.error('Erro ao enviar email de reset:', error);
        return { success: false, error: error.message };
      }
      
      console.log('Email de reset enviado com sucesso');
      return { success: true };
    } catch (error) {
      console.error('Erro ao enviar email de reset:', error);
      return { success: false, error: 'Erro de conexão. Tente novamente.' };
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePassword = useCallback(async (newPassword) => {
    try {
      setLoading(true);
      console.log('AuthContext: Atualizando senha do usuário...');
      
      // Verificar se o usuário está autenticado
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Erro ao verificar sessão:', sessionError);
        return { success: false, error: 'Erro de autenticação. Faça login novamente.' };
      }
      
      if (!session) {
        console.error('Usuário não está autenticado');
        return { success: false, error: 'Você precisa estar logado para alterar a senha.' };
      }
      
      console.log('Sessão válida, atualizando senha...');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('Erro ao atualizar senha:', error);
        // Mapear erros específicos do Supabase
        let errorMessage = error.message;
        if (error.message.includes('New password should be different')) {
          errorMessage = 'A nova senha deve ser diferente da atual.';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
        } else if (error.message.includes('Auth session missing')) {
          errorMessage = 'Sessão expirada. Faça login novamente.';
        }
        return { success: false, error: errorMessage };
      }
      
      console.log('Senha atualizada com sucesso');
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      return { success: false, error: 'Erro de conexão. Tente novamente.' };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    signUp,
    updateProfile,
    resetPassword,
    updatePassword,
  }), [user, isAuthenticated, loading, login, logout, signUp, updateProfile, resetPassword, updatePassword]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

