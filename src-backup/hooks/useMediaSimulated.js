import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Dados simulados para demonstração
const mockMediaData = [
  {
    id: '1',
    name: 'video-demo.mp4',
    type: 'video',
    category: 'video',
    size: 15728640, // 15MB
    date: new Date('2024-01-15').toISOString(),
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnail: 'https://via.placeholder.com/300x200/1e40af/ffffff?text=Video',
    isFavorite: false,
    isDeleted: false,
  },
  {
    id: '2',
    name: 'imagem-demo.jpg',
    type: 'image',
    category: 'image',
    size: 2097152, // 2MB
    date: new Date('2024-01-14').toISOString(),
    url: 'https://picsum.photos/800/600',
    thumbnail: 'https://picsum.photos/300/200',
    isFavorite: true,
    isDeleted: false,
  },
  {
    id: '3',
    name: 'audio-demo.mp3',
    type: 'audio',
    category: 'audio',
    size: 5242880, // 5MB
    date: new Date('2024-01-13').toISOString(),
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    thumbnail: 'https://via.placeholder.com/300x200/0ea5e9/ffffff?text=Audio',
    isFavorite: false,
    isDeleted: false,
  },
  {
    id: '4',
    name: 'gif-demo.gif',
    type: 'gif',
    category: 'gif',
    size: 3145728, // 3MB
    date: new Date('2024-01-12').toISOString(),
    url: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
    thumbnail: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
    isFavorite: false,
    isDeleted: false,
  },
  {
    id: '5',
    name: 'documento.pdf',
    type: 'document',
    category: 'document',
    size: 1048576, // 1MB
    date: new Date('2024-01-11').toISOString(),
    url: '#',
    thumbnail: 'https://via.placeholder.com/300x200/64748b/ffffff?text=PDF',
    isFavorite: false,
    isDeleted: false,
  },
];

const mockStats = {
  totalFiles: mockMediaData.length,
  totalSize: mockMediaData.reduce((sum, item) => sum + item.size, 0),
  usedSpace: mockMediaData.reduce((sum, item) => sum + item.size, 0),
  availableSpace: 100 * 1024 * 1024 * 1024, // 100GB
  byType: {
    video: mockMediaData.filter(item => item.type === 'video').length,
    image: mockMediaData.filter(item => item.type === 'image').length,
    audio: mockMediaData.filter(item => item.type === 'audio').length,
    gif: mockMediaData.filter(item => item.type === 'gif').length,
    document: mockMediaData.filter(item => item.type === 'document').length,
  }
};

export const useMediaSimulated = (filters = {}) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const { toast } = useToast();

  // Carregar mídias simuladas
  const loadMedia = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMedia(mockMediaData);
      setStats(mockStats);
    } catch (err) {
      console.error('Erro ao carregar mídias:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload simulado
  const uploadMedia = useCallback(async (files) => {
    try {
      setLoading(true);
      
      // Simular delay de upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Adicionar novos arquivos simulados
      const newMedia = Array.from(files).map((file, index) => ({
        id: `new_${Date.now()}_${index}`,
        name: file.name,
        type: file.type.split('/')[0],
        category: file.type.split('/')[0],
        size: file.size,
        date: new Date().toISOString(),
        url: URL.createObjectURL(file),
        thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : `https://via.placeholder.com/300x200/1e40af/ffffff?text=${file.type.split('/')[0]}`,
        isFavorite: false,
        isDeleted: false,
      }));
      
      setMedia(prev => [...newMedia, ...prev]);
      
      toast({
        title: "Upload concluído! 🎉",
        description: `${files.length} arquivo(s) enviado(s) com sucesso.`,
      });
      
      return newMedia;
    } catch (err) {
      console.error('Erro no upload:', err);
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer upload dos arquivos.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Deletar mídia simulada
  const deleteMedia = useCallback(async (ids) => {
    try {
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (Array.isArray(ids)) {
        setMedia(prev => prev.filter(item => !ids.includes(item.id)));
      } else {
        setMedia(prev => prev.filter(item => item.id !== ids));
      }
      
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

  // Atualizar mídia simulada
  const updateMedia = useCallback(async (id, data) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setMedia(prev => prev.map(item => 
        item.id === id ? { ...item, ...data } : item
      ));
      
      toast({
        title: "Mídia atualizada",
        description: "As alterações foram salvas.",
      });
      
      return data;
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

  // Compartilhar mídia simulada
  const shareMedia = useCallback(async (id, options = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const shareUrl = `${window.location.origin}/share/${id}`;
      navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: "Link copiado!",
        description: "O link de compartilhamento está na sua área de transferência.",
      });
      
      return { shareUrl };
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

  // Buscar mídias simuladas
  const searchMedia = useCallback(async (query, searchFilters = {}) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const filtered = mockMediaData.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      
      setMedia(filtered);
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
    mediaItems: media,
    storageStats: stats,
    loading,
    error,
    loadMedia,
    uploadMedia,
    deleteMedia,
    updateMedia,
    shareMedia,
    searchMedia,
  };
};
