import React, { useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { resetPassword } from '../config/supabase';

const ForgotPassword = memo(() => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { handleAuthError, showSuccess, showWarning } = useErrorHandler();

  const validateEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    const trimmedEmail = email.trim().toLowerCase();
    
    // Validação frontend
    if (!trimmedEmail) {
      showWarning('Por favor, insira seu email.');
      return;
    }
    
    if (!validateEmail(trimmedEmail)) {
      showWarning('Por favor, insira um email válido.');
      return;
    }

    setIsLoading(true);
    
    try {
      await resetPassword(trimmedEmail);
      setIsEmailSent(true);
      showSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (error) {
      console.error('Erro ao enviar email de recuperação:', error);
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  }, [email, validateEmail, handleAuthError, showSuccess, showWarning]);

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-green-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Email Enviado!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enviamos um link de recuperação para <strong>{email}</strong>.
              Verifique sua caixa de entrada e siga as instruções.
            </p>
            <div className="mt-6">
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Voltar para o login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Recuperar Senha
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Digite seu email para receber um link de recuperação
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
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
                  Enviando...
                </>
              ) : (
                'Enviar Link de Recuperação'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              Voltar para o login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
});

ForgotPassword.displayName = 'ForgotPassword';

export default ForgotPassword;