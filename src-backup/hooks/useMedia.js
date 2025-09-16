import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

export const useMedia = (filters = {}) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const { toast } = useToast();

  // Carregar mídias
  const loadMedia = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [mediaData, statsData] = await Promise.all([
        apiService.getMedia(filters),
        apiService.getStorageStats()
      ]);
      
      setMedia(mediaData);
      setStats(statsData);
    } catch (err) {
      console.error('Erro ao carregar mídias:', err);
      setError(err.message);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as mídias. Verifique sua conexão.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  // Upload de mídias
  const uploadMedia = useCallback(async (files) => {
    try {
      setLoading(true);
      const result = await apiService.uploadMedia(files);
      
      // Recarregar lista de mídias
      await loadMedia();
      
      toast({
        title: "Upload concluído!",
        description: `${files.length} arquivo(s) enviado(s) com sucesso.`,
      });
      
      return result;
    } catch (err) {
      console.error('Erro no upload:', err);
      toast({
        title: "Erro no upload",
        description: err.message || "Não foi possível fazer upload dos arquivos.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadMedia, toast]);

  // Deletar mídia
  const deleteMedia = useCallback(async (id) => {
    try {
      await apiService.deleteMedia(id);
      
      // Remover da lista local
      setMedia(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Mídia removida",
        description: "A mídia foi movida para a lixeira.",
      });
    } catch (err) {
      console.error('Erro ao deletar mídia:', err);
      toast({
        title: "Erro",
        description: "Não foi possível remover a mídia.",
        variant: "destructive",
      });
      throw err;
    }
  }, [toast]);

  // Atualizar mídia
  const updateMedia = useCallback(async (id, data) => {
    try {
      const updatedMedia = await apiService.updateMedia(id, data);
      
      // Atualizar na lista local
      setMedia(prev => prev.map(item => 
        item.id === id ? { ...item, ...updatedMedia } : item
      ));
      
      toast({
        title: "Mídia atualizada",
        description: "As alterações foram salvas.",
      });
      
      return updatedMedia;
    } catch (err) {
      console.error('Erro ao atualizar mídia:', err);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a mídia.",
        variant: "destructive",
      });
      throw err;
    }
  }, [toast]);

  // Compartilhar mídia
  const shareMedia = useCallback(async (id, options = {}) => {
    try {
      const result = await apiService.shareMedia(id, options);
      
      toast({
        title: "Link copiado!",
        description: "O link de compartilhamento está na sua área de transferência.",
      });
      
      return result;
    } catch (err) {
      console.error('Erro ao compartilhar mídia:', err);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o link de compartilhamento.",
        variant: "destructive",
      });
      throw err;
    }
  }, [toast]);

  // Buscar mídias
  const searchMedia = useCallback(async (query, searchFilters = {}) => {
    try {
      setLoading(true);
      const results = await apiService.searchMedia(query, searchFilters);
      setMedia(results);
    } catch (err) {
      console.error('Erro na busca:', err);
      toast({
        title: "Erro na busca",
        description: "Não foi possível realizar a busca.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Carregar mídias na inicialização
  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  return {
    media,
    loading,
    error,
    stats,
    loadMedia,
    uploadMedia,
    deleteMedia,
    updateMedia,
    shareMedia,
    searchMedia,
  };
};

