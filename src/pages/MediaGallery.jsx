
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MediaCard from '@/components/MediaCard';
import { useMedia } from '@/hooks/useMedia';
import { useToast } from '@/components/ui/use-toast';

const MediaGallery = () => {
  const { filter } = useParams();
  const { toast } = useToast();
  
  // Configurar filtros baseado na URL
  const filters = filter ? { type: filter.slice(0, -1) } : {};
  const { media: mediaItems, loading, error } = useMedia(filters);
  
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    if (mediaItems?.media) {
      setFilteredItems(mediaItems.media);
    }
  }, [mediaItems]);

  const getGridTitle = () => {
    if (!filter) return "Todas as Mídias";
    const title = filter.charAt(0).toUpperCase() + filter.slice(1);
    return title === "Gifs" ? "GIFs" : title;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="overflow-y-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-transparent"
    >
      <h1 className="text-3xl font-bold text-white mb-6">{getGridTitle()}</h1>
      <AnimatePresence>
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.slice(0, 4).map((item, index) => (
            <MediaCard key={item.id} item={item} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>
       {loading && (
        <div className="flex flex-col items-center justify-center text-center p-10 bg-gray-800/50 rounded-lg mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg text-gray-400">Carregando mídias...</p>
        </div>
      )}
      
      {!loading && filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center p-10 bg-gray-800/50 rounded-lg mt-8">
          <p className="text-lg text-gray-400">Nenhuma mídia encontrada para esta categoria.</p>
          <p className="text-sm text-gray-500 mt-2">Faça upload de arquivos para começar a usar o sistema.</p>
        </div>
      )}
      
      {error && (
        <div className="flex flex-col items-center justify-center text-center p-10 bg-red-900/20 rounded-lg mt-8">
          <p className="text-lg text-red-400">Erro ao carregar mídias</p>
          <p className="text-sm text-red-300 mt-2">{error}</p>
        </div>
      )}
    </motion.div>
  );
};

export default MediaGallery;
