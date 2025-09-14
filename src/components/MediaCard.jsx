import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Image as ImageIcon, FileBox as FileGifBox, Music, PlayCircle, X, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const typeIcons = {
  video: <Video className="h-4 w-4" />,
  image: <ImageIcon className="h-4 w-4" />,
  gif: <FileGifBox className="h-4 w-4" />,
  audio: <Music className="h-4 w-4" />,
};

const MediaCard = ({ item, index }) => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    // Implementar download via API
    const downloadUrl = `/api/media/${item.id}/download`;
    window.open(downloadUrl, '_blank');
  };

  const renderMediaViewer = () => {
    const streamUrl = `/api/media/${item.id}/stream`;
    const previewUrl = `/api/media/${item.id}/preview`;
    
    switch (item.type) {
      case 'video':
        return (
          <video 
            controls 
            className="max-w-full max-h-[70vh] object-contain"
            src={streamUrl}
          >
            Seu navegador não suporta o elemento de vídeo.
          </video>
        );
      case 'audio':
        return (
          <div className="flex flex-col items-center space-y-4">
            <Music className="h-24 w-24 text-blue-400" />
            <audio 
              controls 
              className="w-full max-w-md"
              src={streamUrl}
            >
              Seu navegador não suporta o elemento de áudio.
            </audio>
          </div>
        );
      case 'image':
      case 'gif':
        return (
          <img 
            src={previewUrl}
            alt={item.title}
            className="max-w-full max-h-[70vh] object-contain"
          />
        );
      default:
        return <div>Tipo de mídia não suportado</div>;
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer media-card-hover"
        onClick={handleCardClick}
      >
        <div className="aspect-w-1 aspect-h-1 w-full">
          {item.type === 'image' || item.type === 'gif' ? (
            <img
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
              alt={item.title}
              src={`/api/media/${item.id}/thumbnail`}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1652086939922-9582b3367e61";
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              {typeIcons[item.type] && React.cloneElement(typeIcons[item.type], { className: "h-12 w-12 text-white/60" })}
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {(item.type === 'video' || item.type === 'audio') && (
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle className="h-16 w-16 text-white/70 opacity-0 transform scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100" />
          </div>
        )}

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleDownload}
            className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
          >
            <Download className="h-4 w-4 text-white" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate pr-2">{item.name || item.title}</h3>
              <p className="text-xs text-white/70 truncate">{item.size}</p>
            </div>
            <div className="flex-shrink-0 p-1.5 bg-white/20 backdrop-blur-sm rounded-full">
              {typeIcons[item.type]}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal do Visualizador */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="relative max-w-7xl max-h-screen p-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            
            <div className="flex flex-col items-center space-y-4">
              {renderMediaViewer()}
              
              <div className="text-center text-white">
                <h2 className="text-xl font-semibold mb-2">{item.name || item.title}</h2>
                <div className="flex items-center justify-center space-x-4 text-sm text-white/70">
                  <span>{item.size}</span>
                  <span>•</span>
                  <span>{item.date}</span>
                  <span>•</span>
                  <span className="capitalize">{item.type}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MediaCard;