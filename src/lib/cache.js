// Sistema de cache inteligente para mídias
class MediaCache {
  constructor() {
    this.cache = new Map()
    this.maxSize = 50 // Máximo de itens no cache
    this.maxAge = 24 * 60 * 60 * 1000 // 24 horas em ms
  }

  // Gerar chave única para o cache
  generateKey(type, id) {
    return `${type}_${id}`
  }

  // Verificar se item está no cache e não expirou
  isValid(item) {
    if (!item) return false
    const now = Date.now()
    return (now - item.timestamp) < this.maxAge
  }

  // Obter item do cache
  get(type, id) {
    const key = this.generateKey(type, id)
    const item = this.cache.get(key)
    
    if (this.isValid(item)) {
      return item.data
    }
    
    // Remover item expirado
    if (item) {
      this.cache.delete(key)
    }
    
    return null
  }

  // Adicionar item ao cache
  set(type, id, data) {
    const key = this.generateKey(type, id)
    
    // Verificar se cache está cheio
    if (this.cache.size >= this.maxSize) {
      this.cleanup()
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  // Limpar cache (remover itens expirados)
  cleanup() {
    const now = Date.now()
    const expiredKeys = []
    
    for (const [key, item] of this.cache.entries()) {
      if ((now - item.timestamp) >= this.maxAge) {
        expiredKeys.push(key)
      }
    }
    
    expiredKeys.forEach(key => this.cache.delete(key))
  }

  // Limpar cache completamente
  clear() {
    this.cache.clear()
  }

  // Obter estatísticas do cache
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      maxAge: this.maxAge
    }
  }
}

// Instância global do cache
export const mediaCache = new MediaCache()

// Funções auxiliares para cache de thumbnails
export const thumbnailCache = {
  // Cache de thumbnails usando IndexedDB
  async getThumbnail(fileId) {
    try {
      const cache = await caches.open('thumbnails-v1')
      const response = await cache.match(`/thumbnails/${fileId}`)
      
      if (response) {
        const blob = await response.blob()
        return URL.createObjectURL(blob)
      }
      
      return null
    } catch (error) {
      console.error('Erro ao obter thumbnail do cache:', error)
      return null
    }
  },

  // Salvar thumbnail no cache
  async setThumbnail(fileId, thumbnailUrl) {
    try {
      const response = await fetch(thumbnailUrl)
      const blob = await response.blob()
      
      const cache = await caches.open('thumbnails-v1')
      await cache.put(`/thumbnails/${fileId}`, new Response(blob))
      
      return URL.createObjectURL(blob)
    } catch (error) {
      console.error('Erro ao salvar thumbnail no cache:', error)
      return thumbnailUrl
    }
  },

  // Limpar cache de thumbnails
  async clear() {
    try {
      await caches.delete('thumbnails-v1')
    } catch (error) {
      console.error('Erro ao limpar cache de thumbnails:', error)
    }
  }
}

// Cache para dados de arquivos
export const fileCache = {
  // Obter dados do arquivo
  get(fileId) {
    return mediaCache.get('file', fileId)
  },

  // Salvar dados do arquivo
  set(fileId, fileData) {
    mediaCache.set('file', fileId, fileData)
  },

  // Obter lista de arquivos
  getList(userId) {
    return mediaCache.get('list', userId)
  },

  // Salvar lista de arquivos
  setList(userId, files) {
    mediaCache.set('list', userId, files)
  },

  // Limpar cache
  clear() {
    mediaCache.clear()
  }
}

// Cache para configurações offline
export const offlineCache = {
  // Verificar se está offline
  isOffline() {
    return !navigator.onLine
  },

  // Salvar dados para uso offline
  async saveForOffline(key, data) {
    try {
      const cache = await caches.open('offline-v1')
      await cache.put(`/offline/${key}`, new Response(JSON.stringify(data)))
    } catch (error) {
      console.error('Erro ao salvar dados offline:', error)
    }
  },

  // Obter dados salvos offline
  async getOfflineData(key) {
    try {
      const cache = await caches.open('offline-v1')
      const response = await cache.match(`/offline/${key}`)
      
      if (response) {
        return await response.json()
      }
      
      return null
    } catch (error) {
      console.error('Erro ao obter dados offline:', error)
      return null
    }
  },

  // Limpar cache offline
  async clear() {
    try {
      await caches.delete('offline-v1')
    } catch (error) {
      console.error('Erro ao limpar cache offline:', error)
    }
  }
}

export default mediaCache
