import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Download, 
  Trash2, 
  Play, 
  Image, 
  Video, 
  Music, 
  File,
  MoreVertical,
  Eye
} from 'lucide-react'
import { useMedia } from '../hooks/useMedia'
import { useAuth } from '../hooks/useAuth'
import LoadingSkeleton from './LoadingSkeleton'

const MediaManager = ({ files, loading, viewMode, onFileSelect }) => {
  const { uploadFile, deleteFile, getDownloadLink } = useMedia()
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [dragOver, setDragOver] = useState(false)

  const handleFileUpload = async (filesToUpload) => {
    setUploading(true)

    for (const file of filesToUpload) {
      await uploadFile(file, user.id)
    }

    setUploading(false)
  }

  const handleFileInputChange = async (e) => {
    const files = Array.from(e.target.files)
    await handleFileUpload(files)
    e.target.value = '' // Reset input
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    await handleFileUpload(files)
  }

  const handleDownload = async (file) => {
    try {
      const result = await getDownloadLink(file.google_drive_id)
      if (result.success) {
        window.open(result.downloadUrl, '_blank')
      }
    } catch (error) {
      console.error('Erro no download:', error)
    }
  }

  const handleDelete = async (file) => {
    if (window.confirm('Tem certeza que deseja deletar este arquivo?')) {
      await deleteFile(file.id, file.google_drive_id, user.id)
    }
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return <LoadingSkeleton count={8} viewMode={viewMode} />
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`premium-card p-8 text-center transition-all duration-300 ${
          dragOver 
            ? 'border-primary-500 bg-primary-50 scale-105' 
            : 'hover:scale-102'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          id="file-upload"
          accept="image/*,video/*,audio/*"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center space-y-6"
        >
          <div className={`w-24 h-24 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
            uploading 
              ? 'bg-primary-200' 
              : dragOver 
                ? 'bg-gradient-primary scale-110' 
                : 'bg-gradient-primary hover:scale-105'
          }`}>
            {uploading ? (
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Upload className="w-12 h-12 text-white" />
            )}
          </div>
          <div>
            <h3 className={`text-2xl font-bold transition-colors duration-300 ${
              dragOver ? 'text-primary-700' : 'text-primary-900'
            }`}>
              {uploading ? 'Enviando arquivos...' : dragOver ? 'Solte os arquivos aqui' : 'Fazer upload de arquivos'}
            </h3>
            <p className={`text-lg transition-colors duration-300 ${
              dragOver ? 'text-primary-600' : 'text-primary-600'
            }`}>
              {dragOver ? 'Arraste e solte os arquivos' : 'Arraste e solte ou clique para selecionar'}
            </p>
            <p className="text-sm text-primary-500 mt-2">
              Suporta imagens, vídeos e áudios • Máximo 100MB por arquivo
            </p>
          </div>
        </label>
      </motion.div>

      {/* Files Grid/List */}
      {viewMode === 'grid' ? (
        <div className="media-grid-premium">
          {files.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="media-item-premium hover-lift"
            >
              {/* Thumbnail */}
              <div className="media-thumbnail-premium">
                {file.thumbnail_url ? (
                  <img
                    src={file.thumbnail_url}
                    alt={file.name}
                  />
                ) : (
                  <div className="text-primary-400 flex items-center justify-center">
                    {getFileIcon(file.type)}
                  </div>
                )}
                
                {/* Overlay */}
                <div className="media-overlay-premium">
                  <div className="media-controls-premium">
                    <button
                      onClick={() => onFileSelect(file)}
                      className="media-control-btn-premium"
                      title="Reproduzir"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(file)}
                      className="media-control-btn-premium"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(file)}
                      className="media-control-btn-premium"
                      title="Deletar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* File Info */}
              <div className="media-info-premium">
                <h3 className="media-name-premium">
                  {file.name}
                </h3>
                <div className="media-meta-premium">
                  <span>{formatFileSize(file.size)}</span>
                  <span>{formatDate(file.created_at)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="premium-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-primary-100">
              <thead className="bg-primary-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                    Tamanho
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-primary-700 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-primary-100">
                {files.map((file, index) => (
                  <motion.tr
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-primary-50 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                            {getFileIcon(file.type)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-primary-900">
                            {file.name}
                          </div>
                          <div className="text-xs text-primary-500">
                            {file.type.split('/')[0]}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {file.type.split('/')[0]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-primary-900">
                        {formatFileSize(file.size)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-primary-600">
                        {formatDate(file.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onFileSelect(file)}
                          className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-100 rounded-lg transition-all"
                          title="Reproduzir"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(file)}
                          className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-100 rounded-lg transition-all"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(file)}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-lg transition-all"
                          title="Deletar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default MediaManager
