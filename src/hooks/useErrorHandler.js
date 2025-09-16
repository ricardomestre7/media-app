import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook personalizado para tratamento centralizado de erros
 * Fornece funções para lidar com diferentes tipos de erros de forma consistente
 */
export const useErrorHandler = () => {
  const { toast } = useToast();

  // Mapear códigos de erro para mensagens amigáveis
  const errorMessages = {
    // Erros de autenticação
    'Invalid login credentials': 'Email ou senha incorretos',
    'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada',
    'User already registered': 'Este email já está cadastrado',
    'Password should be at least': 'Senha muito fraca. Use pelo menos 6 caracteres',
    'Signup disabled': 'Cadastro temporariamente desabilitado',
    'Email rate limit exceeded': 'Muitas tentativas. Tente novamente em alguns minutos',
    
    // Erros de rede
    'Network Error': 'Erro de conexão. Verifique sua internet',
    'timeout': 'Operação expirou. Tente novamente',
    'Failed to fetch': 'Erro de conexão. Tente novamente',
    
    // Erros de servidor
    '500': 'Erro interno do servidor. Tente novamente mais tarde',
    '503': 'Serviço temporariamente indisponível',
    '429': 'Muitas requisições. Aguarde um momento',
    
    // Erros de validação
    'Invalid email': 'Email inválido',
    'Required field': 'Campo obrigatório',
    'File too large': 'Arquivo muito grande',
    'Invalid file type': 'Tipo de arquivo não suportado'
  };

  // Função para obter mensagem de erro amigável
  const getErrorMessage = useCallback((error) => {
    if (!error) return 'Erro desconhecido';
    
    const errorString = typeof error === 'string' ? error : error.message || error.error || String(error);
    
    // Procurar por mensagens conhecidas
    for (const [key, message] of Object.entries(errorMessages)) {
      if (errorString.toLowerCase().includes(key.toLowerCase())) {
        return message;
      }
    }
    
    // Retornar mensagem original se não encontrar correspondência
    return errorString;
  }, []);

  // Função para lidar com erros de autenticação
  const handleAuthError = useCallback((error, customTitle = 'Erro de Autenticação') => {
    const message = getErrorMessage(error);
    
    toast({
      title: customTitle,
      description: message,
      variant: 'destructive',
    });
    
    // Log para debug em desenvolvimento
    if (import.meta.env.DEV) {
      console.error('Auth Error:', error);
    }
    
    return message;
  }, [toast, getErrorMessage]);

  // Função para lidar com erros de API
  const handleApiError = useCallback((error, customTitle = 'Erro na Operação') => {
    const message = getErrorMessage(error);
    
    toast({
      title: customTitle,
      description: message,
      variant: 'destructive',
    });
    
    // Log para debug em desenvolvimento
    if (import.meta.env.DEV) {
      console.error('API Error:', error);
    }
    
    return message;
  }, [toast, getErrorMessage]);

  // Função para lidar com erros de upload
  const handleUploadError = useCallback((error, filename = '') => {
    const message = getErrorMessage(error);
    const title = filename ? `Erro ao enviar ${filename}` : 'Erro no Upload';
    
    toast({
      title,
      description: message,
      variant: 'destructive',
    });
    
    return message;
  }, [toast, getErrorMessage]);

  // Função para lidar com erros de validação
  const handleValidationError = useCallback((errors, title = 'Erro de Validação') => {
    const errorList = Array.isArray(errors) ? errors : [errors];
    const message = errorList.map(getErrorMessage).join(', ');
    
    toast({
      title,
      description: message,
      variant: 'destructive',
    });
    
    return message;
  }, [toast, getErrorMessage]);

  // Função para mostrar mensagens de sucesso
  const showSuccess = useCallback((title, description) => {
    toast({
      title,
      description,
      variant: 'default',
    });
  }, [toast]);

  // Função para mostrar avisos
  const showWarning = useCallback((title, description) => {
    toast({
      title,
      description,
      variant: 'default',
    });
  }, [toast]);

  return {
    handleAuthError,
    handleApiError,
    handleUploadError,
    handleValidationError,
    showSuccess,
    showWarning,
    getErrorMessage
  };
};

export default useErrorHandler;