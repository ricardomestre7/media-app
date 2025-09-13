import React, { createContext, useContext, useEffect, useState } from 'react'
import { mediaFiles } from '../lib/supabase'
import { googleDrive } from '../lib/googleDrive'
import { fileCache, thumbnailCache } from '../lib/cache'
import toast from 'react-hot-toast'

export const MediaContext = createContext({})

export const useMedia = () => {
  const context = useContext(MediaContext)
  if (!context) {
    throw new Error('useMedia deve ser usado dentro de um MediaProvider')
  }
  return context
}

export const MediaProvider = ({ children }) => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // 'grid' ou 'list'

  // Carregar arquivos
  const loadFiles = async (userId) => {
    try {
      setLoading(true)
      
      // Verificar cache primeiro
      const cachedFiles = fileCache.getList(userId)
      if (cachedFiles) {
        setFiles(cachedFiles)
        setLoading(false)
      }

      const { data, error } = await mediaFiles.getFiles(userId)
      
      if (error) {
        toast.error('Erro ao carregar arquivos')
        return { success: false, error }
      }

      setFiles(data || [])
      fileCache.setList(userId, data || [])
      
      return { success: true, data: data || [] }
    } catch (error) {
      toast.error('Erro ao carregar arquivos')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  // Upload de arquivo
  const uploadFile = async (file, userId) => {
    try {
      setUploading(true)
      
      // Upload para Google Drive
      const driveResult = await googleDrive.uploadFile(file)
      
      if (!driveResult.success) {
        toast.error('Erro no upload para Google Drive')
        return { success: false, error: driveResult.error }
      }

      // Salvar informações no Supabase
      const fileData = {
        user_id: userId,
        name: file.name,
        size: file.size,
        type: file.type,
        google_drive_id: driveResult.data.id,
        google_drive_url: driveResult.data.webViewLink,
        thumbnail_url: driveResult.data.thumbnailLink,
        created_at: new Date().toISOString()
      }

      const { data, error } = await mediaFiles.addFile(fileData)
      
      if (error) {
        toast.error('Erro ao salvar informações do arquivo')
        return { success: false, error }
      }

      // Atualizar lista local
      setFiles(prev => [data[0], ...prev])
      
      // Atualizar cache
      fileCache.setList(userId, [data[0], ...files])
      
      toast.success('Arquivo enviado com sucesso!')
      return { success: true, data: data[0] }
    } catch (error) {
      toast.error('Erro no upload do arquivo')
      return { success: false, error }
    } finally {
      setUploading(false)
    }
  }

  // Deletar arquivo
  const deleteFile = async (fileId, googleDriveId, userId) => {
    try {
      setLoading(true)
      
      // Deletar do Google Drive
      const driveResult = await googleDrive.deleteFile(googleDriveId)
      
      if (!driveResult.success) {
        toast.error('Erro ao deletar arquivo do Google Drive')
        return { success: false, error: driveResult.error }
      }

      // Deletar do Supabase
      const { error } = await mediaFiles.deleteFile(fileId)
      
      if (error) {
        toast.error('Erro ao deletar arquivo')
        return { success: false, error }
      }

      // Atualizar lista local
      setFiles(prev => prev.filter(file => file.id !== fileId))
      
      // Atualizar cache
      const updatedFiles = files.filter(file => file.id !== fileId)
      fileCache.setList(userId, updatedFiles)
      
      toast.success('Arquivo deletado com sucesso!')
      return { success: true }
    } catch (error) {
      toast.error('Erro ao deletar arquivo')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  // Buscar arquivos
  const searchFiles = async (query, userId) => {
    try {
      setLoading(true)
      setSearchQuery(query)
      
      if (!query.trim()) {
        await loadFiles(userId)
        return { success: true }
      }

      const { data, error } = await mediaFiles.searchFiles(userId, query)
      
      if (error) {
        toast.error('Erro na busca')
        return { success: false, error }
      }

      setFiles(data || [])
      return { success: true, data: data || [] }
    } catch (error) {
      toast.error('Erro na busca')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  // Filtrar por tipo
  const filterByType = (type) => {
    setFilterType(type)
  }

  // Obter arquivos filtrados
  const getFilteredFiles = () => {
    let filtered = files

    // Filtrar por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(file => {
        const fileType = file.type.split('/')[0]
        return fileType === filterType
      })
    }

    return filtered
  }

  // Obter thumbnail com cache
  const getThumbnail = async (file) => {
    if (!file.thumbnail_url) return null

    try {
      // Verificar cache primeiro
      const cachedThumbnail = await thumbnailCache.getThumbnail(file.id)
      if (cachedThumbnail) {
        return cachedThumbnail
      }

      // Salvar no cache
      const thumbnailUrl = await thumbnailCache.setThumbnail(file.id, file.thumbnail_url)
      return thumbnailUrl
    } catch (error) {
      console.error('Erro ao obter thumbnail:', error)
      return file.thumbnail_url
    }
  }

  // Obter link de download
  const getDownloadLink = async (googleDriveId) => {
    try {
      const result = await googleDrive.getDownloadLink(googleDriveId)
      return result
    } catch (error) {
      console.error('Erro ao obter link de download:', error)
      return { success: false, error }
    }
  }

  // Limpar cache
  const clearCache = () => {
    fileCache.clear()
    thumbnailCache.clear()
    toast.success('Cache limpo com sucesso!')
  }

  const value = {
    files,
    loading,
    uploading,
    searchQuery,
    filterType,
    viewMode,
    loadFiles,
    uploadFile,
    deleteFile,
    searchFiles,
    filterByType,
    getFilteredFiles,
    getThumbnail,
    getDownloadLink,
    clearCache,
    setViewMode,
    setSearchQuery
  }

  return (
    <MediaContext.Provider value={value}>
      {children}
    </MediaContext.Provider>
  )
}

export default MediaContext
