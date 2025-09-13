// Configurações do Google Drive API
const GOOGLE_DRIVE_API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY
const GOOGLE_DRIVE_CLIENT_ID = import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID
const GOOGLE_DRIVE_CLIENT_SECRET = import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_SECRET
const GOOGLE_DRIVE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_DRIVE_REDIRECT_URI || 'http://localhost:5173/auth/callback'

// Simulação para desenvolvimento - em produção, use um backend
const isDevelopment = import.meta.env.DEV

export const googleDrive = {
  // Obter URL de autorização
  getAuthUrl() {
    if (isDevelopment) {
      return 'https://accounts.google.com/oauth/authorize?client_id=' + GOOGLE_DRIVE_CLIENT_ID + '&redirect_uri=' + GOOGLE_DRIVE_REDIRECT_URI + '&scope=https://www.googleapis.com/auth/drive.file&response_type=code&access_type=offline'
    }
    return '#'
  },

  // Trocar código por token
  async getToken(code) {
    if (isDevelopment) {
      // Simulação para desenvolvimento
      return {
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
        scope: 'https://www.googleapis.com/auth/drive.file',
        token_type: 'Bearer',
        expiry_date: Date.now() + 3600000
      }
    }
    return null
  },

  // Definir credenciais
  setCredentials(tokens) {
    // Simulação para desenvolvimento
    console.log('Credenciais definidas:', tokens)
  },

  // Upload de arquivo
  async uploadFile(file, folderId = null) {
    if (isDevelopment) {
      // Simulação para desenvolvimento
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              id: 'mock_file_id_' + Date.now(),
              name: file.name,
              size: file.size.toString(),
              mimeType: file.type,
              webViewLink: 'https://drive.google.com/file/d/mock_file_id/view',
              thumbnailLink: 'https://via.placeholder.com/150x150?text=' + encodeURIComponent(file.name),
              createdTime: new Date().toISOString()
            }
          })
        }, 1000)
      })
    }
    
    return {
      success: false,
      error: 'Google Drive API não configurada'
    }
  },

  // Obter link de download direto
  async getDownloadLink(fileId) {
    if (isDevelopment) {
      return {
        success: true,
        downloadUrl: 'https://drive.google.com/uc?export=download&id=' + fileId
      }
    }
    
    return {
      success: false,
      error: 'Google Drive API não configurada'
    }
  },

  // Obter thumbnail
  async getThumbnail(fileId) {
    if (isDevelopment) {
      return {
        success: true,
        thumbnailUrl: 'https://via.placeholder.com/150x150?text=Thumbnail'
      }
    }
    
    return {
      success: false,
      error: 'Google Drive API não configurada'
    }
  },

  // Listar arquivos
  async listFiles(pageToken = null) {
    if (isDevelopment) {
      return {
        success: true,
        files: [],
        nextPageToken: null
      }
    }
    
    return {
      success: false,
      error: 'Google Drive API não configurada'
    }
  },

  // Deletar arquivo
  async deleteFile(fileId) {
    if (isDevelopment) {
      return {
        success: true
      }
    }
    
    return {
      success: false,
      error: 'Google Drive API não configurada'
    }
  },

  // Obter informações do arquivo
  async getFileInfo(fileId) {
    if (isDevelopment) {
      return {
        success: true,
        file: {
          id: fileId,
          name: 'Arquivo de exemplo',
          size: '1024',
          mimeType: 'image/jpeg',
          webViewLink: 'https://drive.google.com/file/d/' + fileId + '/view',
          thumbnailLink: 'https://via.placeholder.com/150x150?text=File',
          createdTime: new Date().toISOString(),
          modifiedTime: new Date().toISOString()
        }
      }
    }
    
    return {
      success: false,
      error: 'Google Drive API não configurada'
    }
  }
}

export default googleDrive
