
const initialMediaData = [
  { id: 1, type: 'image', name: 'Aurora sobre as montanhas', size: '4.5 MB', date: '2025-09-12', category: 'Natureza', isFavorite: true, url: 'aurora-borealis' },
  { id: 2, type: 'video', name: 'Nebulosa em timelapse', size: '128 MB', date: '2025-09-11', category: 'Espaço', isFavorite: false, url: 'nebula' },
  { id: 3, type: 'audio', name: 'Som do espaço profundo', size: '12.1 MB', date: '2025-09-10', category: 'Sci-Fi', isFavorite: false, url: 'cosmic-sound' },
  { id: 4, type: 'gif', name: 'Buraco negro em rotação', size: '2.3 MB', date: '2025-09-09', category: 'Espaço', isFavorite: true, url: 'black-hole' },
  { id: 5, type: 'image', name: 'Galáxia de Andrômeda', size: '15.8 MB', date: '2025-09-08', category: 'Astronomia', isFavorite: false, url: 'andromeda-galaxy' },
  { id: 6, type: 'video', name: 'Lançamento do Foguete', size: '256 MB', date: '2025-09-07', category: 'Tecnologia', isFavorite: false, url: 'rocket-launch' },
  { id: 7, type: 'image', name: 'Supernova Remanescente', size: '9.2 MB', date: '2025-09-06', category: 'Espaço', isFavorite: true, url: 'supernova-remnant' },
  { id: 8, type: 'audio', name: 'Trilha sonora épica', size: '8.7 MB', date: '2025-09-05', category: 'Música', isFavorite: false, url: 'epic-soundtrack' },
  { id: 9, type: 'gif', name: 'Pulsar piscando', size: '1.1 MB', date: '2025-09-04', category: 'Astronomia', isFavorite: false, url: 'pulsar' },
  { id: 10, type: 'image', name: 'Planeta deserto', size: '6.3 MB', date: '2025-09-03', category: 'Paisagem', isFavorite: false, url: 'desert-planet' },
  { id: 11, type: 'video', name: 'Viagem através do hiperespaço', size: '180 MB', date: '2025-09-02', category: 'Sci-Fi', isFavorite: true, url: 'hyperspace' },
  { id: 12, type: 'image', name: 'Estação espacial orbital', size: '7.9 MB', date: '2025-09-01', category: 'Tecnologia', isFavorite: false, url: 'space-station' },
];

export const getMedia = () => {
  if (typeof window !== 'undefined') {
    const storedMedia = localStorage.getItem('mediaData');
    if (!storedMedia) {
      localStorage.setItem('mediaData', JSON.stringify(initialMediaData));
      return initialMediaData;
    }
    return JSON.parse(storedMedia);
  }
  return [];
};

export const saveMedia = (media) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mediaData', JSON.stringify(media));
  }
};

export const addMedia = (newItem) => {
  if (typeof window !== 'undefined') {
    const currentMedia = getMedia();
    const updatedMedia = [...currentMedia, { ...newItem, id: currentMedia.length > 0 ? Math.max(...currentMedia.map(item => item.id)) + 1 : 1 }];
    saveMedia(updatedMedia);
    return updatedMedia;
  }
  return [];
};
