import { useState, useEffect } from 'react'
import { offlineCache } from '../lib/cache'

export const useOffline = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [offlineData, setOfflineData] = useState(null)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Salvar dados para uso offline
  const saveOfflineData = async (key, data) => {
    try {
      await offlineCache.saveForOffline(key, data)
      setOfflineData(prev => ({ ...prev, [key]: data }))
      return { success: true }
    } catch (error) {
      console.error('Erro ao salvar dados offline:', error)
      return { success: false, error }
    }
  }

  // Obter dados salvos offline
  const getOfflineData = async (key) => {
    try {
      const data = await offlineCache.getOfflineData(key)
      return { success: true, data }
    } catch (error) {
      console.error('Erro ao obter dados offline:', error)
      return { success: false, error }
    }
  }

  // Limpar dados offline
  const clearOfflineData = async () => {
    try {
      await offlineCache.clear()
      setOfflineData(null)
      return { success: true }
    } catch (error) {
      console.error('Erro ao limpar dados offline:', error)
      return { success: false, error }
    }
  }

  return {
    isOffline,
    offlineData,
    saveOfflineData,
    getOfflineData,
    clearOfflineData
  }
}

export default useOffline
