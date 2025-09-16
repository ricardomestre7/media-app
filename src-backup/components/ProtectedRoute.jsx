import React, { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

// Componente de loading otimizado
const LoadingScreen = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900">
    <div className="text-center space-y-4">
      <div className="relative">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto" />
        <div className="absolute inset-0 w-12 h-12 border-2 border-cyan-400/20 rounded-full mx-auto animate-pulse" />
      </div>
      <div className="space-y-2">
        <p className="text-blue-300 font-medium">Verificando autenticação...</p>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  </div>
));

LoadingScreen.displayName = 'LoadingScreen';

const ProtectedRoute = memo(({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirecionar para login se não autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Renderizar children se autenticado
  return children;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;

