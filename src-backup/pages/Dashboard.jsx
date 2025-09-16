import React, { useState, useCallback, memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Search,
  Image,
  Film,
  Volume2,
  BookOpen,
  Play,
  ArrowRight,
  Grid3X3,
  List,
  RefreshCw,
  X,
  User,
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react';

// Componente memorizado para cards de categoria
const CategoryCard = memo(({ category, isSelected, onClick }) => {
  const IconComponent = category.icon;
  return (
    <div
      onClick={() => onClick(category.type)}
      className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300 group ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className={`bg-gradient-to-br ${category.gradient} p-6 text-white min-h-[200px] flex flex-col justify-between`}>
        <div>
          <IconComponent className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-bold mb-2">{category.title}</h3>
          <p className="text-sm opacity-90 mb-4">{category.description}</p>
        </div>
        <div>
          <div className="text-3xl font-bold mb-1">
            {category.count.toLocaleString()}
          </div>
          <div className="text-sm opacity-80">arquivos</div>
        </div>
      </div>
    </div>
  );
});

// Componente de menu do usuário
const UserMenu = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    await logout();
    setIsOpen(false);
  }, [logout]);

  const handleProfile = useCallback(() => {
    navigate('/profile');
    setIsOpen(false);
  }, [navigate]);

  const userName = useMemo(() => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário';
  }, [user]);

  const userEmail = useMemo(() => {
    return user?.email || '';
  }, [user]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="text-left hidden md:block">
          <div className="text-sm font-medium text-gray-900">{userName}</div>
          <div className="text-xs text-gray-500">{userEmail}</div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Overlay para fechar menu */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Menu dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{userName}</div>
                  <div className="text-sm text-gray-500">{userEmail}</div>
                </div>
              </div>
            </div>
            
            <div className="p-2">
              <button
                onClick={handleProfile}
                className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">Meu Perfil</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

// Hero simplificado
const HeroSection = memo(() => (
  <section className="relative h-80 overflow-hidden">
    <div className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=60"
        alt="Background"
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-blue-700/50"></div>
    </div>

    <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-6">
      <div className="max-w-4xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-lg">
          Sua Biblioteca Digital
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-100 max-w-2xl mx-auto drop-shadow-md">
          Organize, compartilhe e acesse todos os seus conteúdos multimídia 
          em um só lugar. Coleta automática de conteúdos.
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2 shadow-lg">
          <span>Explorar Conteúdo</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  </section>
));

const Dashboard = () => {
  // Estados simplificados
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  // Dados estáticos
  const stats = {
    images: 2400,
    videos: 892,
    gifs: 156,
    audios: 341,
    ebooks: 127
  };

  const categoryCards = [
    {
      title: 'Imagens',
      type: 'image',
      count: stats.images,
      icon: Image,
      gradient: 'from-blue-500 to-blue-700',
      description: 'Fotos, ilustrações e gráficos'
    },
    {
      title: 'Vídeos',
      type: 'video',
      count: stats.videos,
      icon: Film,
      gradient: 'from-purple-500 to-purple-700',
      description: 'Filmes, clipes e tutoriais'
    },
    {
      title: 'GIFs',
      type: 'gif',
      count: stats.gifs,
      icon: Play,
      gradient: 'from-green-500 to-green-700',
      description: 'Animações e momentos'
    },
    {
      title: 'Áudios',
      type: 'audio',
      count: stats.audios,
      icon: Volume2,
      gradient: 'from-orange-500 to-orange-700',
      description: 'Músicas, podcasts e gravações'
    },
    {
      title: 'Ebooks',
      type: 'ebook',
      count: stats.ebooks,
      icon: BookOpen,
      gradient: 'from-red-500 to-red-700',
      description: 'Livros digitais e documentos'
    }
  ];

  // Callbacks otimizados
  const handleCategoryClick = useCallback((type) => {
    setSelectedCategory(type);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    // Simular atualização automática
    setTimeout(() => {
      setLoading(false);
      console.log('Conteúdos atualizados automaticamente');
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Otimizado com Menu do Usuário */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MH</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MediaHub</h1>
                <p className="text-xs text-gray-500">Coleta automática</p>
              </div>
            </div>

            {/* Busca Central */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Pesquisar na sua mídia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Controles + Menu do Usuário */}
            <div className="flex items-center space-x-4">
              {/* Modo de visualização */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Atualizar */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Atualizar conteúdos"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>

              {/* Menu do Usuário */}
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Filtros Rápidos */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <button
              onClick={() => handleCategoryClick('all')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {categoryCards.map((category) => (
              <button
                key={category.type}
                onClick={() => handleCategoryClick(category.type)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category.type
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards de Categoria */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore por Categoria</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Seus conteúdos são coletados automaticamente e organizados por categoria. 
              Encontre rapidamente o que precisa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categoryCards.map((category) => (
              <CategoryCard
                key={category.type}
                category={category}
                isSelected={selectedCategory === category.type}
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-12 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Sua Biblioteca em Números</h2>
            <p className="text-blue-200">Crescimento automático do seu acervo digital</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-3xl font-bold text-blue-300 mb-2">
                  {value.toLocaleString()}
                </div>
                <div className="text-sm text-blue-200 capitalize">
                  {key === 'ebooks' ? 'E-books' : key}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;