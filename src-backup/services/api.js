// Configuração da API para conectar com o VPS
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Obter token de autenticação
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Fazer requisição autenticada
  async makeRequest(endpoint, options = {}) {
    const token = this.getAuthToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expirado ou inválido
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          window.location.href = '/login';
          throw new Error('Sessão expirada. Faça login novamente.');
        }
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  }

  // Autenticação
  async login(email, password) {
    return this.makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.makeRequest('/api/auth/logout', {
      method: 'POST',
    });
  }

  // Mídias
  async getMedia(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.makeRequest(`/api/media?${queryParams}`);
  }

  async getMediaById(id) {
    return this.makeRequest(`/api/media/${id}`);
  }

  async uploadMedia(files) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file', file);
    });

    const token = this.getAuthToken();
    const response = await fetch(`${this.baseURL}/api/media/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
        throw new Error('Sessão expirada. Faça login novamente.');
      }
      throw new Error(`Erro no upload: ${response.status}`);
    }

    return await response.json();
  }

  async deleteMedia(id) {
    return this.makeRequest(`/api/media/${id}`, {
      method: 'DELETE',
    });
  }

  async updateMedia(id, data) {
    return this.makeRequest(`/api/media/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async shareMedia(id, options = {}) {
    return this.makeRequest(`/api/media/${id}/share`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }

  // Usuário
  async getUserProfile() {
    return this.makeRequest('/api/user/profile');
  }

  async updateUserProfile(data) {
    return this.makeRequest('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Estatísticas
  async getStorageStats() {
    return this.makeRequest('/api/stats/storage');
  }

  async getMediaStats() {
    return this.makeRequest('/api/stats/media');
  }

  // Busca
  async searchMedia(query, filters = {}) {
    const params = new URLSearchParams({ q: query, ...filters });
    return this.makeRequest(`/api/search?${params}`);
  }

  // Obter URL de mídia para exibição
  getMediaUrl(mediaId, type = 'preview') {
    const token = this.getAuthToken();
    const tokenParam = token ? `?token=${token}` : '';
    return `${this.baseURL}/api/media/${mediaId}/${type}${tokenParam}`;
  }

  getStreamUrl(mediaId) {
    return this.getMediaUrl(mediaId, 'stream');
  }

  getThumbnailUrl(mediaId) {
    return this.getMediaUrl(mediaId, 'thumbnail');
  }

  // Obter URL de download
  getDownloadUrl(mediaId) {
    return this.getMediaUrl(mediaId, 'download');
  }
}

// Instância singleton
export const apiService = new ApiService();
export default apiService;

