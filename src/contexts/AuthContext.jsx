import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar se há token salvo no localStorage
  useEffect(() => {
    console.log('AuthContext: Verificando token no localStorage...');
    
    // Limpar dados antigos do Supabase se existirem
    const supabaseKeys = Object.keys(localStorage).filter(key => 
      key.includes('supabase') || key.includes('sb-')
    );
    
    if (supabaseKeys.length > 0) {
      console.log('AuthContext: Removendo dados antigos do Supabase:', supabaseKeys);
      supabaseKeys.forEach(key => localStorage.removeItem(key));
    }
    
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    console.log('AuthContext: Token encontrado:', !!token);
    console.log('AuthContext: UserData encontrado:', !!userData);
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('AuthContext: Usuário carregado:', parsedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    console.log('AuthContext: Loading finalizado');
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Simulação de delay para parecer real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Login simulado - aceita qualquer email/senha
      console.log('Login simulado para:', email);
      
      // Dados do usuário simulados
      const userData = {
        id: '1',
        email: email,
        name: email.split('@')[0],
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        createdAt: new Date().toISOString()
      };
      
      // Token simulado
      const token = 'simulated_token_' + Date.now();
      
      // Salvar no localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      console.log('Login simulado bem-sucedido:', userData);
      
      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

