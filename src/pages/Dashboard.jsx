import React, { useState, useRef } from 'react';
import {
  Search,
  Upload,
  Image,
  Film,
  Volume2,
  BookOpen,
  Play,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    console.log('Arquivos selecionados:', files);
    alert(`${files.length} arquivo(s) selecionado(s).`);
  };

  const categories = [
    {
      id: 'images',
      name: 'Imagens',
      icon: Image,
      count: '2.4k',
      description: 'Fotografias, ilustrações e designs',
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 'videos',
      name: 'Vídeos',
      icon: Film,
      count: '892',
      description: 'Conteúdos audiovisuais e apresentações',
      gradient: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      id: 'gifs',
      name: 'GIFs',
      icon: Play,
      count: '156',
      description: 'Animações e momentos em loop',
      gradient: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      id: 'audios',
      name: 'Áudios',
      icon: Volume2,
      count: '341',
      description: 'Podcasts, músicas e gravações',
      gradient: 'from-orange-500 to-orange-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      id: 'ebooks',
      name: 'Ebooks',
      icon: BookOpen,
      count: '127',
      description: 'Livros digitais e documentos',
      gradient: 'from-red-500 to-red-600',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    }
  ];

  const CategoryCard = ({ category }) => (
    <div className="group cursor-pointer">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 transform hover:-translate-y-1">
        <div className={`h-32 bg-gradient-to-br ${category.gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute bottom-4 left-4">
            <div className={`w-12 h-12 ${category.iconBg} rounded-xl flex items-center justify-center`}>
              <category.icon size={24} className={category.iconColor} />
            </div>
          </div>
          <div className="absolute top-4 right-4 text-white/90 font-semibold">
            {category.count}
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {category.name}
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            {category.description}
          </p>
          <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 gap-1 transition-all">
            Explorar
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header / Mini Menu */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Image className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MediaHub</h1>
                <p className="text-sm text-gray-500">Sua biblioteca de conteúdo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar na sua mídia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
              >
                <Upload size={18} />
                Upload
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.epub"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        {/* Navegação do slider */}
        <button className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10">
          <ChevronLeft size={20} />
        </button>
        <button className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10">
          <ChevronRight size={20} />
        </button>

        {/* Background com gradiente */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/80"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=600&fit=crop&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Conteúdo centralizado */}
        <div className="relative h-full flex items-center justify-center text-center text-white px-8">
          <div className="max-w-4xl">
            <h2 className="text-5xl font-bold mb-6 text-white leading-tight">
              Sua Biblioteca Digital
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-2xl mx-auto">
              Organize, compartilhe e acesse todos os seus conteúdos multimídia em um só lugar. 
              Simplifique seu fluxo de trabalho com nossa plataforma intuitiva.
            </p>
            <button className="bg-white text-blue-900 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-xl text-lg inline-flex items-center gap-2">
              Explorar Conteúdo
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Indicadores do slider */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          <div className="w-3 h-3 bg-white rounded-full"></div>
          <div className="w-3 h-3 bg-white/50 rounded-full"></div>
          <div className="w-3 h-3 bg-white/50 rounded-full"></div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Explore por Categoria
          </h3>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Encontre rapidamente o tipo de conteúdo que você precisa. 
            Cada categoria é otimizada para uma melhor experiência de navegação.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">3.9k</div>
              <div className="text-gray-600">Total de Arquivos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">2.1GB</div>
              <div className="text-gray-600">Espaço Utilizado</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">156</div>
              <div className="text-gray-600">Compartilhamentos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">89%</div>
              <div className="text-gray-600">Organizado</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;