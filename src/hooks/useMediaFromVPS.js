import { useState, useEffect } from 'react';
import { fetchCategoriesFromVPS, fetchFilesByCategory } from '../services/api';

export const useMediaFromVPS = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMediaFromVPS();
  }, []);

  const loadMediaFromVPS = async () => {
    setLoading(true);
    try {
      const categories = await fetchCategoriesFromVPS();
      // Converter para formato esperado
      const items = categories.map(cat => ({
        id: cat.name,
        type: cat.name.toLowerCase(),
        name: cat.name,
        category: cat.name
      }));
      setMediaItems(items);
    } catch (error) {
      console.error('Erro:', error);
    }
    setLoading(false);
  };

  const deleteMedia = () => {}; // Placeholder

  return { mediaItems, loading, deleteMedia };
};