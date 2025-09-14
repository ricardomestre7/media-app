import React, { useState, useEffect } from 'react';
import { supabase, auth } from '../config/supabase';

const SupabaseTest = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Verificando...');

  // Verificar conexão com Supabase
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Teste mais simples - apenas verificar se o cliente existe
        if (supabase && supabase.auth) {
          setConnectionStatus('✅ Cliente Supabase inicializado');
          console.log('✅ Supabase client criado com sucesso');
          console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
          console.log('Anon Key configurada:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
        } else {
          setConnectionStatus('❌ Erro na inicialização do cliente');
          console.error('❌ Erro: Cliente Supabase não foi criado');
        }
      } catch (error) {
        setConnectionStatus(`❌ Erro de conexão: ${error.message}`);
        console.error('❌ Erro na conexão:', error);
      }
    };

    checkConnection();

    // Verificar usuário atual
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getCurrentUser();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event, session?.user?.email);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.log('🔄 Tentando registrar usuário:', email);
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      });
      
      console.log('📋 Resposta do registro:', { data, error });
      
      if (error) {
        setMessage(`❌ Erro no registro: ${error.message}`);
        console.error('❌ Erro detalhado:', error);
      } else {
        setMessage('✅ Registro realizado! Verifique seu email para confirmar a conta.');
        console.log('✅ Usuário registrado:', data.user);
      }
    } catch (error) {
      setMessage(`❌ Erro: ${error.message}`);
      console.error('❌ Erro catch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.log('🔄 Tentando fazer login:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      console.log('📋 Resposta do login:', { data, error });
      
      if (error) {
        setMessage(`❌ Erro no login: ${error.message}`);
        console.error('❌ Erro detalhado:', error);
      } else {
        setMessage('✅ Login realizado com sucesso!');
        console.log('✅ Usuário logado:', data.user);
      }
    } catch (error) {
      setMessage(`❌ Erro: ${error.message}`);
      console.error('❌ Erro catch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      console.log('🔄 Fazendo logout...');
      const { error } = await supabase.auth.signOut();
      
      console.log('📋 Resposta do logout:', { error });
      
      if (error) {
        setMessage(`❌ Erro no logout: ${error.message}`);
        console.error('❌ Erro detalhado:', error);
      } else {
        setMessage('✅ Logout realizado com sucesso!');
        console.log('✅ Logout realizado');
      }
    } catch (error) {
      setMessage(`❌ Erro: ${error.message}`);
      console.error('❌ Erro catch:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Teste Supabase
          </h1>
          <p className="text-sm text-gray-600">
            Status: {connectionStatus}
          </p>
        </div>

        {user ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h3 className="text-lg font-medium text-green-800 mb-2">
                Usuário Logado
              </h3>
              <p className="text-sm text-green-700">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-sm text-green-700">
                <strong>ID:</strong> {user.id}
              </p>
              <p className="text-sm text-green-700">
                <strong>Criado em:</strong> {new Date(user.created_at).toLocaleString()}
              </p>
            </div>
            
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {loading ? 'Saindo...' : 'Sair'}
            </button>
          </div>
        ) : (
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleSignIn}
                disabled={loading || !email || !password}
                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
              
              <button
                type="button"
                onClick={handleSignUp}
                disabled={loading || !email || !password}
                className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Registrando...' : 'Registrar'}
              </button>
            </div>
          </form>
        )}

        {message && (
          <div className={`mt-4 p-3 rounded-md text-sm ${
            message.includes('✅') 
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-black mb-2">Informações de Configuração:</h4>
          <div className="text-xs text-black space-y-1">
            <p><strong>URL:</strong> {import.meta.env.VITE_SUPABASE_URL}</p>
            <p><strong>Anon Key:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ Não configurada'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;