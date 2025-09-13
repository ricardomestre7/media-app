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
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragOver 
            ? 'border-primary-500 bg-primary-50 scale-105' 
            : 'border-gray-300 hover:border-primary-400'
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
          className="cursor-pointer flex flex-col items-center space-y-4"
        >
          <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
            uploading 
              ? 'bg-primary-200' 
              : dragOver 
                ? 'bg-primary-200 scale-110' 
                : 'bg-primary-100 hover:bg-primary-200'
          }`}>
            {uploading ? (
              <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Upload className={`w-10 h-10 transition-colors duration-300 ${
                dragOver ? 'text-primary-700' : 'text-primary-600'
              }`} />
            )}
          </div>
          <div>
            <h3 className={`text-xl font-semibold transition-colors duration-300 ${
              dragOver ? 'text-primary-700' : 'text-gray-900'
            }`}>
              {uploading ? 'Enviando arquivos...' : dragOver ? 'Solte os arquivos aqui' : 'Fazer upload de arquivos'}
            </h3>
            <p className={`text-base transition-colors duration-300 ${
              dragOver ? 'text-primary-600' : 'text-gray-600'
            }`}>
              {dragOver ? 'Arraste e solte os arquivos' : 'Arraste e solte ou clique para selecionar'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Suporta imagens, vídeos e áudios
            </p>
          </div>
        </label>
      </motion.div>

      {/* Files Grid/List */}
      {viewMode === 'grid' ? (
        <div className="media-grid">
          {files.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="media-item"
            >
              {/* Thumbnail */}
              <div className="media-thumbnail">
                {file.thumbnail_url ? (
                  <img
                    src={file.thumbnail_url}
                    alt={file.name}
                  />
                ) : (
                  <div className="text-gray-400">
                    {getFileIcon(file.type)}
                  </div>
                )}
                
                {/* Overlay */}
                <div className="media-overlay">
                  <div className="media-controls">
                    <button
                      onClick={() => onFileSelect(file)}
                      className="media-control-btn"
                      title="Reproduzir"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(file)}
                      className="media-control-btn"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(file)}
                      className="media-control-btn danger"
                      title="Deletar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* File Info */}
              <div className="media-info">
                <h3 className="media-name">
                  {file.name}
                </h3>
                <div className="media-meta">
                  <span>{formatFileSize(file.size)}</span>
                  <span>{formatDate(file.created_at)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tamanho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => (
                  <motion.tr
                    key={file.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            {getFileIcon(file.type)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {file.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {file.type.split('/')[0]}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatFileSize(file.size)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(file.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onFileSelect(file)}
                          className="text-primary-600 hover:text-primary-900 transition-colors"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(file)}
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(file)}
                          className="text-red-600 hover:text-red-900 transition-colors"
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
