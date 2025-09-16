import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, File, Image, Video, Music } from 'lucide-react';
import { useMedia } from '@/hooks/useMedia';
import { useToast } from '@/components/ui/use-toast';

const MediaUpload = ({ onUploadComplete }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { uploadMedia } = useMedia();
  const { toast } = useToast();

  const acceptedTypes = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.svg'],
    'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv', '.wmv', '.3gp'],
    'audio/*': ['.mp3', '.wav', '.ogg', '.aac', '.flac', '.m4a', '.wma']
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return <Image className="h-6 w-6" />;
    if (file.type.startsWith('video/')) return <Video className="h-6 w-6" />;
    if (file.type.startsWith('audio/')) return <Music className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      const isValidType = Object.keys(acceptedTypes).some(type => {
        if (type === 'image/*') return file.type.startsWith('image/');
        if (type === 'video/*') return file.type.startsWith('video/');
        if (type === 'audio/*') return file.type.startsWith('audio/');
        return false;
      });
      
      if (!isValidType) {
        toast({
          title: "Arquivo não suportado",
          description: `${file.name} não é um tipo de arquivo suportado.`,
          variant: "destructive",
        });
        return false;
      }
      
      // Verificar tamanho (2GB max)
      if (file.size > 2147483648) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede o limite de 2GB.`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    try {
      await uploadMedia(selectedFiles);
      setSelectedFiles([]);
      if (onUploadComplete) {
        onUploadComplete();
      }
      toast({
        title: "Upload concluído!",
        description: `${selectedFiles.length} arquivo(s) enviado(s) com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: error.message || "Ocorreu um erro durante o upload.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Área de Drop */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          Arraste arquivos aqui ou clique para selecionar
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Suporte para imagens, vídeos e áudios (máx. 2GB por arquivo)
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
          <span>JPG, PNG, GIF, WebP</span>
          <span>•</span>
          <span>MP4, AVI, MOV, MKV</span>
          <span>•</span>
          <span>MP3, WAV, OGG, AAC</span>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Lista de arquivos selecionados */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-white font-semibold">Arquivos selecionados:</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-blue-400">
                    {getFileIcon(file)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {file.name}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Botão de Upload */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setSelectedFiles([])}
              disabled={uploading}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              Limpar
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading || selectedFiles.length === 0}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Enviar {selectedFiles.length} arquivo(s)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;