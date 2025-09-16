import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AuthProvider, ProtectedRoute, useAuthStatus } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/ErrorBoundary';

// Lazy loading para code splitting
const Dashboard = lazy(() => 
  import('@/pages/Dashboard').then(module => ({
    default: module.default
  }))
);

const Login = lazy(() => 
  import('@/pages/Login').then(module => ({
    default: module.default
  }))
);

const Profile = lazy(() => 
  import('@/pages/Profile').then(module => ({
    default: module.default
  }))
);

const SharePage = lazy(() => 
  import('@/pages/SharePage').then(module => ({
    default: module.default
  }))
);

const MediaCategoryPage = lazy(() => 
  import('@/pages/MediaCategoryPage').then(module => ({
    default: module.default
  }))
);

// Loading component otimizado
const PageLoader = ({ message = "Carregando..." }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
    <div className="text-white text-center">
      <div className="w-12 h-12 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
      <h2 className="text-xl font-semibold mb-2">MediaHub</h2>
      <p className="text-blue-200">{message}</p>
    </div>
  </div>
);

// Componente para erro de autenticação
const AuthError = () => (
  <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center p-4">
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white text-center max-w-md">
      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">⚠️</span>
      </div>
      <h1 className="text-2xl font-bold mb-4">Erro de Autenticação</h1>
      <p className="text-red-200 mb-6">
        Houve um problema com sua sessão. Tente fazer login novamente.
      </p>
      <button
        onClick={() => window.location.href = '/login'}
        className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
      >
        Ir para Login
      </button>
    </div>
  </div>
);

// Componente de rota protegida especializado
const AppProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, isLoading, error } = useAuthStatus();

  if (isLoading) {
    return <PageLoader message="Verificando autenticação..." />;
  }

  if (error && requireAuth) {
    return <AuthError />;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Componente principal das rotas
const AppRoutes = () => (
  <Routes>
    {/* Rota de login - não autenticada */}
    <Route 
      path="/login" 
      element={
        <AppProtectedRoute requireAuth={false}>
          <Suspense fallback={<PageLoader message="Carregando login..." />}>
            <Login />
          </Suspense>
        </AppProtectedRoute>
      } 
    />
    
    {/* Rota de compartilhamento - pública */}
    <Route 
      path="/share/:id" 
      element={
        <Suspense fallback={<PageLoader message="Carregando arquivo..." />}>
          <SharePage />
        </Suspense>
      } 
    />
    
    {/* Rotas autenticadas */}
    <Route 
      path="/" 
      element={
        <AppProtectedRoute>
          <Suspense fallback={<PageLoader message="Carregando dashboard..." />}>
            <Dashboard />
          </Suspense>
        </AppProtectedRoute>
      } 
    />
    
    <Route 
      path="/profile" 
      element={
        <AppProtectedRoute>
          <Suspense fallback={<PageLoader message="Carregando perfil..." />}>
            <Profile />
          </Suspense>
        </AppProtectedRoute>
      } 
    />
    
    {/* Rotas de categorias */}
    <Route 
      path="/videos" 
      element={
        <AppProtectedRoute>
          <Suspense fallback={<PageLoader message="Carregando vídeos..." />}>
            <MediaCategoryPage category="video" title="Vídeos" />
          </Suspense>
        </AppProtectedRoute>
      } 
    />
    
    <Route 
      path="/images" 
      element={
        <AppProtectedRoute>
          <Suspense fallback={<PageLoader message="Carregando imagens..." />}>
            <MediaCategoryPage category="image" title="Imagens" />
          </Suspense>
        </AppProtectedRoute>
      } 
    />
    
    <Route 
      path="/audios" 
      element={
        <AppProtectedRoute>
          <Suspense fallback={<PageLoader message="Carregando áudios..." />}>
            <MediaCategoryPage category="audio" title="Áudios" />
          </Suspense>
        </AppProtectedRoute>
      } 
    />
    
    <Route 
      path="/gifs" 
      element={
        <AppProtectedRoute>
          <Suspense fallback={<PageLoader message="Carregando GIFs..." />}>
            <MediaCategoryPage category="gif" title="GIFs" />
          </Suspense>
        </AppProtectedRoute>
      } 
    />
    
    <Route 
      path="/filter/:filterType" 
      element={
        <AppProtectedRoute>
          <Suspense fallback={<PageLoader message="Aplicando filtro..." />}>
            <Dashboard />
          </Suspense>
        </AppProtectedRoute>
      } 
    />
    
    {/* Fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

// Componente principal
function App() {
  // Performance monitoring
  useEffect(() => {
    // Métricas de performance para produção
    if (process.env.NODE_ENV === 'production') {
      // Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            console.log('Navigation timing:', {
              domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
              loadComplete: entry.loadEventEnd - entry.loadEventStart,
              total: entry.loadEventEnd - entry.fetchStart
            });
          }
        }
      });
      
      observer.observe({ entryTypes: ['navigation'] });
      
      // Cleanup
      return () => observer.disconnect();
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <>
          <Helmet>
            <title>MediaHub - Sua Biblioteca Digital</title>
            <meta
              name="description"
              content="Plataforma profissional para gerenciamento de mídia digital. Organize, compartilhe e acesse seus arquivos com segurança."
            />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="theme-color" content="#1e40af" />
            
            {/* Preconnect para otimização */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            <link rel="preconnect" href="https://images.unsplash.com" />
            
            {/* Font otimizada */}
            <link
              href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
              rel="stylesheet"
            />
            
            {/* PWA meta tags */}
            <link rel="manifest" href="/manifest.json" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="application-name" content="MediaHub" />
            <meta name="apple-mobile-web-app-title" content="MediaHub" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          </Helmet>
          
          <Suspense fallback={<PageLoader message="Iniciando MediaHub..." />}>
            <AppRoutes />
          </Suspense>
          
          {/* Notificações globais */}
          <Toaster />
        </>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;