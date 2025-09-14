import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Archive, Search as SearchIcon, Upload, Trash2, Download, Share2, Edit, 
  Image, Video, Music, File, Star, MoreVertical, X
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMediaSimulated as useMedia } from '@/hooks/useMediaSimulated';
import MediaCard from '@/components/MediaCard';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const UploadModal = ({ isOpen, onClose, onUpload }) => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const handleUploadClick = async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    try {
      await onUpload(files);
      setFiles([]);
      onClose();
    } catch (error) {
      // Error toast is handled by the hook
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open onOpenChange={onClose}>
          <DialogContent className="modal-content sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle className="gradient-text">Fazer Upload de Mídias para o VPS</DialogTitle>
              <DialogDescription>Arraste e solte seus arquivos ou clique para selecionar.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="upload-zone">
                <Upload className="mx-auto h-12 w-12 text-blue-400" />
                <p className="mt-2 text-sm text-blue-300/80">Arraste arquivos ou <label htmlFor="file-upload" className="font-medium text-cyan-400 hover:text-cyan-300 cursor-pointer">clique para procurar</label>.</p>
                <input id="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 glass-effect rounded-lg">
                    <span className="text-sm truncate w-60">{file.name}</span>
                    <span className="text-xs text-blue-300/70">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <button onClick={() => setFiles(files.filter((_, i) => i !== index))}><X className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={isUploading}>Cancelar</Button>
              <Button onClick={handleUploadClick} disabled={isUploading || files.length === 0} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                {isUploading ? 'Enviando...' : `Enviar ${files.length} Arquivo(s)`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

const MediaListItem = ({ item, onSelect, isSelected, onShare, onDownload, onDelete, onRename }) => (
    <motion.div layout initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.3 }} className="list-item">
      <Checkbox checked={isSelected} onCheckedChange={() => onSelect(item.id)} className="checkbox-custom flex-shrink-0" />
      <div className="flex items-center gap-4 flex-1 truncate">
        <div className="flex-shrink-0 w-8 h-8">
            {item.type === 'image' && <Image className="w-full h-full text-cyan-300" />}
            {item.type === 'video' && <Video className="w-full h-full text-blue-300" />}
            {item.type === 'audio' && <Music className="w-full h-full text-sky-300" />}
            {item.type === 'gif' && <Archive className="w-full h-full text-teal-300" />}
            {!['image', 'video', 'audio', 'gif'].includes(item.type) && <File className="w-full h-full text-slate-400" />}
        </div>
        <span className="font-semibold text-white truncate">{item.name}</span>
      </div>
      <span className="category-badge hidden md:inline-flex">{item.category}</span>
      <span className="w-24 text-sm text-blue-200/70 hidden lg:block">{new Date(item.date).toLocaleDateString()}</span>
      <span className="w-20 text-sm text-blue-200/70 hidden sm:block">{`${(item.size / 1024 / 1024).toFixed(2)} MB`}</span>
      {item.isFavorite && <Star className="h-5 w-5 text-yellow-400 flex-shrink-0" />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild><button className="action-button"><MoreVertical className="h-5 w-5" /></button></DropdownMenuTrigger>
        <DropdownMenuContent className="dropdown-menu">
          <DropdownMenuItem className="dropdown-item" onClick={() => onShare(item.id)}><Share2 className="mr-2 h-4 w-4"/>Compartilhar</DropdownMenuItem>
          <DropdownMenuItem className="dropdown-item" onClick={() => onDownload(item)}><Download className="mr-2 h-4 w-4"/>Baixar</DropdownMenuItem>
          <DropdownMenuItem className="dropdown-item" onClick={() => onRename(item)}><Edit className="mr-2 h-4 w-4"/>Renomear</DropdownMenuItem>
          <DropdownMenuSeparator className="bg-blue-700/50" />
          <DropdownMenuItem className="dropdown-item text-red-400" onClick={() => onDelete([item.id])}><Trash2 className="mr-2 h-4 w-4"/>Lixeira</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );

const Dashboard = () => {
  const { mediaItems, storageStats, loading, uploadMedia, deleteMedia } = useMedia();
  const [searchTerm, setSearchTerm] = useState('');
  const [layout, setLayout] = useState('grid');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { toast } = useToast();
  const { filterType } = useParams();
  const navigate = useNavigate();

  const currentFilter = filterType || 'all';

  const filteredMedia = useMemo(() => {
    let items = mediaItems;
    switch (currentFilter) {
      case 'favorites': items = items.filter(item => item.isFavorite && !item.isDeleted); break;
      case 'trash': items = items.filter(item => item.isDeleted); break;
      case 'recent': items = [...items].sort((a, b) => new Date(b.date) - new Date(a.date)).filter(item => !item.isDeleted); break;
      case 'shared': items = []; break; // Placeholder
      default: items = items.filter(item => !item.isDeleted); break;
    }

    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(lowerSearchTerm) ||
        item.type.toLowerCase().includes(lowerSearchTerm) ||
        item.category.toLowerCase().includes(lowerSearchTerm)
      );
    }
    return items;
  }, [mediaItems, currentFilter, searchTerm]);

  const handleSelect = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };
  
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
    // In a real app: window.open(item.url, '_blank');
  };
  
  const handleBulkDelete = () => {
    deleteMedia(selectedItems);
    setSelectedItems([]);
  };

  const handleRename = (item) => {
    toast({
        description: `🚧 Renomear "${item.name}" ainda não foi implementado!`,
    });
  }

  const BulkActions = () => (
    <AnimatePresence>
      {selectedItems.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bulk-actions">
          <span className="selection-count">{selectedItems.length} selecionado(s)</span>
          <div className="flex gap-2 ml-auto">
            <button className="action-button" onClick={() => toast({ description: "🚧 Ação em massa não implementada." })}><Share2 className="h-5 w-5" /></button>
            <button className="action-button" onClick={() => toast({ description: "🚧 Ação em massa não implementada." })}><Download className="h-5 w-5" /></button>
            <button className="action-button" onClick={() => toast({ description: "🚧 Ação em massa não implementada." })}><Star className="h-5 w-5" /></button>
            <button className="action-button" onClick={handleBulkDelete}><Trash2 className="h-5 w-5 text-red-400" /></button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <Helmet><title>Dashboard | Mídia Azul</title></Helmet>
      <div className="flex min-h-screen p-4 gap-6">
        <Sidebar currentFilter={currentFilter} storageStats={storageStats} />
        <main className="flex-1 flex flex-col">
          <Header onSearch={setSearchTerm} onUploadClick={() => setIsUploadModalOpen(true)} onLayoutChange={setLayout} layout={layout} />
          <BulkActions />
          <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center h-full"><div className="loading-spinner"></div></div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div key={layout} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                    {filteredMedia.length === 0 ? (
                      <div className="empty-state">
                        <Archive className="empty-state-icon" />
                        <h3 className="text-xl font-semibold">Nenhuma mídia encontrada</h3>
                        <p>Tente ajustar seu filtro ou fazer um novo upload.</p>
                      </div>
                    ) : layout === 'grid' ? (
                      <div className="grid-view">
                        {filteredMedia.map((item) => (
                          <MediaCard key={item.id} item={item} onShare={handleShare} onDownload={handleDownload} onDelete={deleteMedia} onRename={handleRename} />
                        ))}
                      </div>
                    ) : (
                      <div className="list-view">
                        {filteredMedia.map(item => (
                          <MediaListItem key={item.id} item={item} onSelect={handleSelect} isSelected={selectedItems.includes(item.id)} onShare={handleShare} onDownload={handleDownload} onDelete={deleteMedia} onRename={handleRename} />
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
          </div>
        </main>
        <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onUpload={uploadMedia} />
      </div>
    </>
  );
};

export default Dashboard;