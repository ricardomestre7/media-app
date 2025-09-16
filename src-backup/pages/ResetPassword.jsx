import React, { useState, useCallback, memo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';

const ResetPassword = memo(() => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleAuthError, showSuccess, showWarning } = useErrorHandler();
  const { login } = useAuth();

  useEffect(() => {
    const handlePasswordReset = async () => {
      // Verificar parâmetro 'code' na URL (usado pelo Supabase para reset de senha)
      const code = searchParams.get('code');
      
      console.log('Reset Password - Parâmetros encontrados:', {
        code: code ? 'Presente' : 'Ausente',
        fullUrl: window.location.href
      });
      
      if (!code) {
        console.log('Código de recuperação ausente');
        showWarning('Link de recuperação inválido ou expirado.');
        navigate('/login');
        return;
      }

      try {
        // Verificar e trocar o código por uma sessão
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
          console.error('Erro ao processar código de recuperação:', error);
          showWarning('Link de recuperação inválido ou expirado.');
          navigate('/login');
          return;
        }
        
        console.log('Sessão estabelecida com sucesso:', data);
        showSuccess('Link de recuperação válido! Você pode definir sua nova senha.');
      } catch (error) {
        console.error('Erro ao processar código:', error);
        showWarning('Erro ao processar link de recuperação.');
        navigate('/login');
      }
    };
    
    handlePasswordReset();
  }, [searchParams, navigate, showWarning, showSuccess]);

  const validatePassword = useCallback((password) => {
    if (password.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres.';
    }
    return null;
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validações frontend
    if (!password || !confirmPassword) {
      showWarning('Por favor, preencha todos os campos.');
      return;
    }
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      showWarning(passwordError);
      return;
    }
    
    if (password !== confirmPassword) {
      showWarning('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      showSuccess('Senha alterada com sucesso! Fazendo login...');
      
      // Obter o email do usuário da sessão atual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.email) {
        // Fazer login com a nova senha para estabelecer sessão completa
        setTimeout(async () => {
          try {
            const loginResult = await login(user.email, password);
            if (loginResult.success) {
              navigate('/dashboard');
            } else {
              // Se o login falhar, redirecionar para login manual
              showSuccess('Senha alterada! Faça login com sua nova senha.');
              navigate('/login');
            }
          } catch (error) {
            console.error('Erro ao fazer login após reset:', error);
            showSuccess('Senha alterada! Faça login com sua nova senha.');
            navigate('/login');
          }
        }, 1500);
      } else {
        // Fallback: redirecionar para login
        setTimeout(() => {
          showSuccess('Senha alterada! Faça login com sua nova senha.');
          navigate('/login');
        }, 2000);
      }
      
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  }, [password, confirmPassword, validatePassword, handleAuthError, showSuccess, showWarning, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Nova Senha
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Digite sua nova senha
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Nova Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Digite sua nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                minLength={6}
              />
              <p className="mt-1 text-xs text-gray-500">
                Mínimo de 6 caracteres
              </p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Nova Senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirme sua nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                minLength={6}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Alterando...
                </>
              ) : (
                'Alterar Senha'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

ResetPassword.displayName = 'ResetPassword';

export default ResetPassword;