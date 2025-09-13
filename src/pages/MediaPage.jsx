import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Upload, 
  Grid, 
  List, 
  Filter, 
  Download, 
  Trash2, 
  Play,
  Image,
  Video,
  Music,
  File
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useMedia } from '../hooks/useMedia'
import MediaManager from '../components/MediaManager'
import MediaPlayer from '../components/MediaPlayer'
import MediaStats from '../components/MediaStats'

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
  
  const [selectedFile, setSelectedFile] = useState(null)
  const [showPlayer, setShowPlayer] = useState(false)

  useEffect(() => {
    if (user) {
      loadFiles(user.id)
    }
  }, [user])

  const handleSearch = (e) => {
    const query = e.target.value
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

  const getFileIcon = (type) => {
    const fileType = type.split('/')[0]
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

  const filteredFiles = getFilteredFiles()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Media Center
              </h1>
              <span className="text-sm text-gray-500">
                {filteredFiles.length} arquivos
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Olá, {user?.user_metadata?.name || user?.email}
              </span>
              <button
                onClick={signOut}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics */}
          {!loading && files.length > 0 && (
            <MediaStats files={files} />
          )}

          {/* Search and Controls */}
          <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar arquivos..."
                value={searchQuery}
                onChange={handleSearch}
                className="input-field pl-10"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              {/* Filter */}
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => filterByType(e.target.value)}
                  className="input-field pr-8 appearance-none cursor-pointer"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="image">Imagens</option>
                  <option value="video">Vídeos</option>
                  <option value="audio">Músicas</option>
                </select>
                <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <File className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum arquivo encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Tente uma busca diferente' : 'Comece fazendo upload de seus arquivos'}
            </p>
            {!searchQuery && (
              <button className="btn-primary">
                <Upload className="w-4 h-4 mr-2" />
                Fazer upload
              </button>
            )}
          </motion.div>
        )}
      </main>

      {/* Media Player Modal */}
      {showPlayer && selectedFile && (
        <MediaPlayer
          file={selectedFile}
          onClose={() => {
            setShowPlayer(false)
            setSelectedFile(null)
          }}
        />
      )}
    </div>
  )
}

export default MediaPage
