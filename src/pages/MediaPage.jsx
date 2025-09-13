import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useMedia } from '../contexts/MediaContext'
import { useNotification } from '../contexts/NotificationContext'
import ModernHeader from '../components/ModernHeader'
import ModernSidebar from '../components/ModernSidebar'
import ModernDashboard from '../components/ModernDashboard'
import MediaManager from '../components/MediaManager'
import MediaPlayer from '../components/MediaPlayer'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { 
  Upload, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  LogOut,
  Settings,
  Bell,
  User,
  File,
  Image,
  Video,
  Music
} from 'lucide-react'

const MediaPage = () => {
  const { user, signOut } = useAuth()
  const { 
    files, 
    loading, 
    searchQuery, 
    filterType, 
    viewMode, 
    loadFiles, 
    searchFiles, 
    filterByType, 
    getFilteredFiles,
    setViewMode,
    setSearchQuery
  } = useMedia()
  const { success, error } = useNotification()
  
  const [selectedFile, setSelectedFile] = useState(null)
  const [showPlayer, setShowPlayer] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    if (user) {
      loadFiles(user.id)
    }
  }, [user])

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.trim()) {
      searchFiles(query, user.id)
    } else {
      loadFiles(user.id)
    }
  }

  const handleFileSelect = (file) => {
    setSelectedFile(file)
    setShowPlayer(true)
  }

  const handleUploadClick = () => {
    // Simular upload
    success('Funcionalidade de upload será implementada em breve!')
  }

  const handleLogout = async () => {
    try {
      await signOut()
      success('Logout realizado com sucesso!')
    } catch (err) {
      error('Erro ao fazer logout')
    }
  }

  const handleFilterChange = (type) => {
    filterByType(type)
  }

  const handleViewModeChange = (mode) => {
    setViewMode(mode)
  }

  const handleSectionChange = (section) => {
    setActiveSection(section)
    
    // Aplicar filtros baseados na seção
    switch (section) {
      case 'images':
        filterByType('image')
        break
      case 'videos':
        filterByType('video')
        break
      case 'audio':
        filterByType('audio')
        break
      case 'documents':
        filterByType('other')
        break
      case 'all-files':
      case 'dashboard':
      default:
        filterByType('all')
        break
    }
  }

  // Calcular estatísticas para o dashboard
  const stats = {
    totalFiles: files.length,
    images: files.filter(f => f.type?.startsWith('image')).length,
    videos: files.filter(f => f.type?.startsWith('video')).length,
    audio: files.filter(f => f.type?.startsWith('audio')).length,
    documents: files.filter(f => !f.type?.startsWith('image') && !f.type?.startsWith('video') && !f.type?.startsWith('audio')).length,
    storageUsed: files.reduce((acc, file) => acc + (file.size || 0), 0),
    storageTotal: 100 * 1024 * 1024 * 1024, // 100GB
    sharedFiles: 0,
    downloads: 0,
    recent: files.length
  }

  const filteredFiles = getFilteredFiles()

  const getFileIcon = (type) => {
    const fileType = type?.split('/')[0]
    switch (fileType) {
      case 'image':
        return <Image className="w-6 h-6" />
      case 'video':
        return <Video className="w-6 h-6" />
      case 'audio':
        return <Music className="w-6 h-6" />
      default:
        return <File className="w-6 h-6" />
    }
  }

  return (
    <div className="app-container">
      {/* Header */}
      <ModernHeader
        user={user}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onFilterChange={handleFilterChange}
        onUploadClick={handleUploadClick}
      />

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <ModernSidebar
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              stats={stats}
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="main-content">
          <AnimatePresence mode="wait">
            {activeSection === 'dashboard' ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ModernDashboard
                  files={files}
                  onUploadClick={handleUploadClick}
                  onViewModeChange={handleViewModeChange}
                  viewMode={viewMode}
                />
              </motion.div>
            ) : (
              <motion.div
                key="media-manager"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Section Header */}
                <div className="premium-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-primary-900 capitalize">
                        {activeSection === 'all-files' ? 'Todos os Arquivos' : 
                         activeSection === 'images' ? 'Imagens' :
                         activeSection === 'videos' ? 'Vídeos' :
                         activeSection === 'audio' ? 'Áudios' :
                         activeSection === 'documents' ? 'Documentos' :
                         activeSection === 'favorites' ? 'Favoritos' :
                         activeSection === 'recent' ? 'Recentes' : 'Arquivos'}
                      </h2>
                      <p className="text-primary-500 mt-1">
                        {filteredFiles.length} arquivo{filteredFiles.length !== 1 ? 's' : ''} encontrado{filteredFiles.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <button
                      onClick={handleUploadClick}
                      className="btn-premium btn-primary"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </button>
                  </div>
                </div>

                {/* Media Manager */}
                <MediaManager
                  files={filteredFiles}
                  loading={loading}
                  viewMode={viewMode}
                  onFileSelect={handleFileSelect}
                />

                {/* Empty State */}
                {!loading && filteredFiles.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="premium-card text-center py-16"
                  >
                    <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      {getFileIcon(activeSection === 'images' ? 'image/jpeg' : 
                                   activeSection === 'videos' ? 'video/mp4' :
                                   activeSection === 'audio' ? 'audio/mp3' : 'application/pdf')}
                    </div>
                    <h3 className="text-xl font-semibold text-primary-900 mb-2">
                      Nenhum arquivo encontrado
                    </h3>
                    <p className="text-primary-500 mb-8 max-w-md mx-auto">
                      {searchQuery 
                        ? 'Tente uma busca diferente ou limpe os filtros' 
                        : `Comece fazendo upload de ${activeSection === 'images' ? 'imagens' :
                                                          activeSection === 'videos' ? 'vídeos' :
                                                          activeSection === 'audio' ? 'áudios' :
                                                          activeSection === 'documents' ? 'documentos' : 'arquivos'}`}
                    </p>
                    <button
                      onClick={handleUploadClick}
                      className="btn-premium btn-primary"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Fazer Upload
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Media Player Modal */}
      <AnimatePresence>
        {showPlayer && selectedFile && (
          <MediaPlayer
            file={selectedFile}
            onClose={() => {
              setShowPlayer(false)
              setSelectedFile(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default MediaPage