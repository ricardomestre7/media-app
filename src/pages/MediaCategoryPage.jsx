import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Archive, Search as SearchIcon, Upload, Trash2, Download, Share2, Edit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import MediaCard from '@/components/MediaCard';
import { Button } from '@/components/ui/button';
import { useMediaSimulated as useMedia } from '@/hooks/useMediaSimulated';
import { useNavigate } from 'react-router-dom';

const MediaCategoryPage = ({ category, title }) => {
  const { mediaItems, loading, deleteMedia } = useMedia();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleShare = (itemId) => {
    const shareUrl = `${window.location.origin}/share/${itemId}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copiado!",
      description: "O link de compartilhamento está na sua área de transferência.",
    });
  };

  const handleDownload = (item) => {
     toast({
      title: `Baixando ${item.name}`,
      description: "Seu download (simulado) começará em breve.",
    });
  };

  const handleRename = (item) => {
    toast({
        description: `🚧 Renomear "${item.name}" ainda não foi implementado!`,
    });
  }

  const filteredMedia = useMemo(() => {
    let items = mediaItems.filter(item => item.type === category && !item.isDeleted);

    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(lowerSearchTerm) ||
        item.category.toLowerCase().includes(lowerSearchTerm)
      );
    }
    return items;
  }, [category, searchTerm, mediaItems]);

  return (
    <>
      <Helmet>
        <title>{title} | Mídia Azul</title>
        <meta name="description" content={`Explore a coleção de ${title.toLowerCase()} na Mídia Azul.`} />
      </Helmet>
      <div className="flex flex-col min-h-screen p-4 sm:p-6 gap-6">
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="flex items-center justify-between p-4 glass-effect rounded-xl"
        >
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/60" />
              <Input
                placeholder={`Pesquisar ${title.toLowerCase()}...`}
                className="search-input pl-10"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center gap-2 ml-4">
            Voltar ao Dashboard
          </Button>
        </motion.header>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-extrabold gradient-text"
        >
          {title}
        </motion.h1>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full"><div className="loading-spinner"></div></div>
          ) : (
            <AnimatePresence mode="wait">
              {filteredMedia.length === 0 ? (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="empty-state"
                >
                  <Archive className="empty-state-icon" />
                  <h3 className="text-xl font-semibold">Nenhum(a) {title.toLowerCase()} encontrado(a)</h3>
                  <p>Tente ajustar sua busca ou volte para fazer um novo upload.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="media-grid-category"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid-view"
                >
                  {filteredMedia.map((item) => (
                    <MediaCard key={item.id} item={item} onShare={handleShare} onDownload={handleDownload} onDelete={deleteMedia} onRename={handleRename} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </>
  );
};

export default MediaCategoryPage;