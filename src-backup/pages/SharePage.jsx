import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { File, Image, Video, Music, Archive, Download, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useMedia } from '@/hooks/useMedia';

const getIconForType = (type) => {
    switch (type) {
        case 'image': return <Image className="w-16 h-16 sm:w-24 sm:h-24 text-cyan-300" />;
        case 'video': return <Video className="w-16 h-16 sm:w-24 sm:h-24 text-blue-300" />;
        case 'audio': return <Music className="w-16 h-16 sm:w-24 sm:h-24 text-sky-300" />;
        case 'gif': return <Archive className="w-16 h-16 sm:w-24 sm:h-24 text-teal-300" />;
        default: return <File className="w-16 h-16 sm:w-24 sm:h-24 text-slate-400" />;
    }
};

const SharePage = () => {
    const { id } = useParams();
    const [mediaItem, setMediaItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const { mediaItems, loading: mediaLoading, error: mediaError } = useMedia();

    useEffect(() => {
        if (!mediaLoading && !mediaError) {
            const item = mediaItems.find(m => m.id.toString() === id);
            setMediaItem(item);
            setIsLoading(false);
        } else if (mediaError) {
            setIsLoading(false);
        }
    }, [id, mediaItems, mediaLoading, mediaError]);

    const handleDownload = () => {
        toast({
            title: "Simulação de Download",
            description: "Em um aplicativo real, o download começaria agora. Como estamos usando dados locais, esta é apenas uma demonstração.",
        });
    };

    if (isLoading || mediaLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="loading-spinner"></div>
            </div>
        );
    }
    
    if (!mediaItem) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-effect p-8 sm:p-12 rounded-2xl"
                >
                    <AlertTriangle className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Mídia Não Encontrada</h1>
                    <p className="text-blue-200/80 mb-6">O link pode estar quebrado ou a mídia foi removida.</p>
                    <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-500">
                        <Link to="/dashboard">Voltar ao Início</Link>
                    </Button>
                </motion.div>
            </div>
        );
    }


    return (
        <>
            <Helmet>
                <title>Compartilhado: {mediaItem.name} | Mídia Azul</title>
                <meta name="description" content={`Veja ou baixe ${mediaItem.name}.`} />
            </Helmet>
            <div className="flex items-center justify-center min-h-screen p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full max-w-2xl text-center"
                >
                    <div className="glass-effect rounded-2xl p-6 sm:p-10">
                        <div className="mx-auto mb-6 flex items-center justify-center">
                            {getIconForType(mediaItem.type)}
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-bold gradient-text truncate mb-2">{mediaItem.name}</h1>
                        <div className="flex items-center justify-center gap-4 text-blue-300/70 mb-8">
                            <span>{mediaItem.size}</span>
                            <span>&bull;</span>
                            <span>{mediaItem.date}</span>
                            <span>&bull;</span>
                            <span className="category-badge">{mediaItem.category}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button onClick={handleDownload} size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center gap-2">
                                <Download className="h-5 w-5" />
                                <span>Baixar Arquivo</span>
                            </Button>
                            <Button variant="outline" size="lg" className="w-full sm:w-auto flex items-center gap-2" asChild>
                               <Link to="/dashboard">
                                    <LinkIcon className="h-5 w-5" />
                                    <span>Ir para a Galeria</span>
                                </Link>
                            </Button>
                        </div>

                    </div>
                    <p className="text-xs text-blue-400/50 mt-6">
                        Compartilhado via <Link to="/dashboard" className="font-semibold hover:text-cyan-300">Mídia Azul</Link>.
                    </p>
                </motion.div>
            </div>
        </>
    );
};

export default SharePage;