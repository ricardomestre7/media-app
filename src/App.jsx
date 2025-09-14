import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Dashboard from '@/pages/Dashboard';
import SharePage from '@/pages/SharePage';
import MediaCategoryPage from '@/pages/MediaCategoryPage';
import Login from '@/pages/Login';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/contexts/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      <Helmet>
        <title>MediaHub - Sua Biblioteca Digital</title>
        <meta
          name="description"
          content="Organize, armazene e compartilhe seus conteúdos multimídia em uma plataforma intuitiva e segura."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <Routes>
        {/* Página de login */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
        />

        {/* Página de compartilhamento */}
        <Route 
          path="/share/:id" 
          element={<SharePage />} 
        />

        {/* Página inicial - Dashboard com hero integrado */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Filtros e categorias */}
        <Route
          path="/filter/:filterType"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/videos"
          element={
            <ProtectedRoute>
              <MediaCategoryPage category="video" title="Vídeos" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/images"
          element={
            <ProtectedRoute>
              <MediaCategoryPage category="image" title="Imagens" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/audios"
          element={
            <ProtectedRoute>
              <MediaCategoryPage category="audio" title="Áudios" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/gifs"
          element={
            <ProtectedRoute>
              <MediaCategoryPage category="gif" title="GIFs" />
            </ProtectedRoute>
          }
        />

        {/* Fallback para rotas não encontradas */}
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>

      {/* Sistema de notificações */}
      <Toaster />
    </>
  );
}

export default App;