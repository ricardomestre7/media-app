import React from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Image, 
  Video, 
  Music, 
  FileText, 
  HardDrive,
  TrendingUp,
  Users,
  Clock,
  Star,
  Download,
  Share2
} from 'lucide-react'

const ModernDashboard = ({ 
  files = [], 
  onUploadClick, 
  onViewModeChange,
  viewMode = 'grid'
}) => {
  // Calcular estatísticas
  const totalFiles = files.length
  const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0)
  
  const fileTypeCounts = files.reduce((acc, file) => {
    const type = file.type?.split('/')[0] || 'other'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const stats = [
    {
      id: 'total-files',
      label: 'Total de Arquivos',
      value: totalFiles,
      icon: Upload,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+12%',
      changeType: 'positive'
    },
    {
      id: 'images',
      label: 'Imagens',
      value: fileTypeCounts.image || 0,
      icon: Image,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      change: '+8%',
      changeType: 'positive'
    },
    {
      id: 'videos',
      label: 'Vídeos',
      value: fileTypeCounts.video || 0,
      icon: Video,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      change: '+15%',
      changeType: 'positive'
    },
    {
      id: 'audio',
      label: 'Áudios',
      value: fileTypeCounts.audio || 0,
      icon: Music,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '+5%',
      changeType: 'positive'
    },
    {
      id: 'documents',
      label: 'Documentos',
      value: fileTypeCounts.other || 0,
      icon: FileText,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      change: '+3%',
      changeType: 'positive'
    },
    {
      id: 'storage',
      label: 'Armazenamento',
      value: formatFileSize(totalSize),
      icon: HardDrive,
      color: 'from-slate-500 to-slate-600',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-600',
      change: '2.1 GB',
      changeType: 'neutral'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      action: 'Upload',
      file: 'foto_familia.jpg',
      type: 'image',
      time: '2 minutos atrás',
      user: 'Você'
    },
    {
      id: 2,
      action: 'Compartilhado',
      file: 'apresentacao.pdf',
      type: 'document',
      time: '1 hora atrás',
      user: 'Você'
    },
    {
      id: 3,
      action: 'Favoritado',
      file: 'video_tutorial.mp4',
      type: 'video',
      time: '3 horas atrás',
      user: 'Você'
    },
    {
      id: 4,
      action: 'Download',
      file: 'musica_favorita.mp3',
      type: 'audio',
      time: '1 dia atrás',
      user: 'Você'
    }
  ]

  const quickActions = [
    {
      id: 'upload',
      label: 'Fazer Upload',
      description: 'Adicionar novos arquivos',
      icon: Upload,
      color: 'bg-gradient-primary',
      onClick: onUploadClick
    },
    {
      id: 'share',
      label: 'Compartilhar',
      description: 'Compartilhar arquivos',
      icon: Share2,
      color: 'bg-gradient-secondary',
      onClick: () => console.log('Share clicked')
    },
    {
      id: 'organize',
      label: 'Organizar',
      description: 'Organizar por pastas',
      icon: FileText,
      color: 'bg-gradient-success',
      onClick: () => console.log('Organize clicked')
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="premium-card"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">
              Bem-vindo ao Media Center
            </h1>
            <p className="text-primary-600 text-lg">
              Gerencie seus arquivos de mídia de forma inteligente e eficiente
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onUploadClick}
              className="btn-premium btn-primary"
            >
              <Upload className="w-4 h-4 mr-2" />
              Fazer Upload
            </button>
            <button
              onClick={() => onViewModeChange(viewMode === 'grid' ? 'list' : 'grid')}
              className="btn-premium btn-secondary"
            >
              {viewMode === 'grid' ? 'Lista' : 'Grid'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="stat-card hover-lift"
          >
            <div className={`stat-icon ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="flex items-center justify-between mt-3">
              <span className={`text-xs font-medium ${
                stat.changeType === 'positive' ? 'text-emerald-600' : 
                stat.changeType === 'negative' ? 'text-red-600' : 
                'text-primary-500'
              }`}>
                {stat.change}
              </span>
              <TrendingUp className="w-3 h-3 text-emerald-500" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="premium-card"
      >
        <div className="card-header">
          <h3 className="card-title">Ações Rápidas</h3>
          <p className="card-subtitle">Acesso rápido às principais funcionalidades</p>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.onClick}
                className={`p-6 rounded-2xl ${action.color} text-white text-left transition-all hover:shadow-lg`}
              >
                <action.icon className="w-8 h-8 mb-3" />
                <h4 className="font-semibold text-lg mb-1">{action.label}</h4>
                <p className="text-sm opacity-90">{action.description}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="premium-card"
      >
        <div className="card-header">
          <h3 className="card-title">Atividade Recente</h3>
          <p className="card-subtitle">Suas últimas ações no Media Center</p>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-primary-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'image' ? 'bg-emerald-100' :
                  activity.type === 'video' ? 'bg-red-100' :
                  activity.type === 'audio' ? 'bg-purple-100' :
                  'bg-amber-100'
                }`}>
                  {activity.type === 'image' && <Image className="w-5 h-5 text-emerald-600" />}
                  {activity.type === 'video' && <Video className="w-5 h-5 text-red-600" />}
                  {activity.type === 'audio' && <Music className="w-5 h-5 text-purple-600" />}
                  {activity.type === 'document' && <FileText className="w-5 h-5 text-amber-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-primary-900 truncate">
                    {activity.action}: {activity.file}
                  </p>
                  <p className="text-sm text-primary-500">{activity.time}</p>
                </div>
                <div className="text-xs text-primary-400">
                  {activity.user}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Storage Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="premium-card"
      >
        <div className="card-header">
          <h3 className="card-title">Visão Geral do Armazenamento</h3>
          <p className="card-subtitle">Uso atual do seu espaço de armazenamento</p>
        </div>
        <div className="card-content">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary-900">
                  {formatFileSize(totalSize)}
                </p>
                <p className="text-primary-500">de 100 GB usado</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-primary-500">Espaço disponível</p>
                <p className="text-lg font-semibold text-emerald-600">
                  {formatFileSize(100 * 1024 * 1024 * 1024 - totalSize)}
                </p>
              </div>
            </div>
            
            <div className="w-full h-3 bg-primary-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-primary rounded-full transition-all duration-1000"
                style={{ 
                  width: `${Math.min((totalSize / (100 * 1024 * 1024 * 1024)) * 100, 100)}%` 
                }}
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { type: 'Imagens', count: fileTypeCounts.image || 0, color: 'bg-emerald-500' },
                { type: 'Vídeos', count: fileTypeCounts.video || 0, color: 'bg-red-500' },
                { type: 'Áudios', count: fileTypeCounts.audio || 0, color: 'bg-purple-500' },
                { type: 'Documentos', count: fileTypeCounts.other || 0, color: 'bg-amber-500' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className={`w-3 h-3 ${item.color} rounded-full mx-auto mb-2`}></div>
                  <p className="text-sm font-medium text-primary-900">{item.count}</p>
                  <p className="text-xs text-primary-500">{item.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ModernDashboard
