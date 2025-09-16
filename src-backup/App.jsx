import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from './components/ui/toaster';

// Lazy loading
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const SharePage = lazy(() => import('./pages/SharePage'));
const MediaCategoryPage = lazy(() => import('./pages/MediaCategoryPage'));

// Loading
const PageLoader = ({ message = "Carregando..." }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
    <div className="text-white text-center">
      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p>{message}</p>
    </div>
  </div>
);

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/" /> : (
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          )
        } 
      />
      
      <Route 
        path="/share/:id" 
        element={
          <Suspense fallback={<PageLoader />}>
            <SharePage />
          </Suspense>
        } 
      />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/videos" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <MediaCategoryPage category="video" title="Vídeos" />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/images" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <MediaCategoryPage category="image" title="Imagens" />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/audios" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <MediaCategoryPage category="audio" title="Áudios" />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/gifs" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <MediaCategoryPage category="gif" title="GIFs" />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Helmet>
        <title>MediaHub - Sua Biblioteca Digital</title>
        <meta name="description" content="Plataforma para gerenciamento de mídia digital" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}

export default App;