import React from 'react'
import { motion } from 'framer-motion'
import { 
  Home, 
  Folder, 
  Image, 
  Video, 
  Music, 
  FileText, 
  Star, 
  Clock, 
  Trash2,
  HardDrive,
  Share2,
  Download,
  Settings
} from 'lucide-react'

const ModernSidebar = ({ 
  activeSection, 
  onSectionChange, 
  stats = {} 
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      count: null
    },
    {
      id: 'all-files',
      label: 'Todos os Arquivos',
      icon: Folder,
      count: stats.totalFiles || 0
    },
    {
      id: 'images',
      label: 'Imagens',
      icon: Image,
      count: stats.images || 0
    },
    {
      id: 'videos',
      label: 'Vídeos',
      icon: Video,
      count: stats.videos || 0
    },
    {
      id: 'audio',
      label: 'Áudios',
      icon: Music,
      count: stats.audio || 0
    },
    {
      id: 'documents',
      label: 'Documentos',
      icon: FileText,
      count: stats.documents || 0
    },
    {
      id: 'favorites',
      label: 'Favoritos',
      icon: Star,
      count: stats.favorites || 0
    },
    {
      id: 'recent',
      label: 'Recentes',
      icon: Clock,
      count: stats.recent || 0
    }
  ]

  const quickActions = [
    {
      id: 'storage',
      label: 'Armazenamento',
      icon: HardDrive,
      value: stats.storageUsed || '0 GB',
      total: stats.storageTotal || '100 GB'
    },
    {
      id: 'shared',
      label: 'Compartilhados',
      icon: Share2,
      value: stats.sharedFiles || 0
    },
    {
      id: 'downloads',
      label: 'Downloads',
      icon: Download,
      value: stats.downloads || 0
    }
  ]

  return (
    <motion.aside 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="modern-sidebar"
    >
      <div className="sidebar-content">
        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSectionChange(item.id)}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count !== null && (
                <span className="px-2 py-1 bg-primary-100 text-primary-600 text-xs font-medium rounded-full">
                  {item.count}
                </span>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-primary-700 mb-4 px-4">
            Ações Rápidas
          </h3>
          <div className="space-y-2">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-primary-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <action.icon className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary-900">{action.label}</p>
                    {action.total ? (
                      <p className="text-xs text-primary-500">
                        {action.value} de {action.total}
                      </p>
                    ) : (
                      <p className="text-xs text-primary-500">{action.value}</p>
                    )}
                  </div>
                </div>
                {action.id === 'storage' && (
                  <div className="w-16 h-2 bg-primary-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min((parseFloat(action.value) / parseFloat(action.total)) * 100, 100)}%` 
                      }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Storage Usage */}
        <div className="mt-8 p-4 premium-card">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-primary-900">Armazenamento</h4>
            <span className="text-sm text-primary-500">
              {stats.storageUsed || '0 GB'} de {stats.storageTotal || '100 GB'}
            </span>
          </div>
          
          <div className="w-full h-2 bg-primary-100 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-gradient-primary rounded-full transition-all duration-1000"
              style={{ 
                width: `${Math.min((parseFloat(stats.storageUsed || 0) / parseFloat(stats.storageTotal || 100)) * 100, 100)}%` 
              }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-primary-500">
            <span>Usado</span>
            <span>Disponível</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-primary-700 mb-4 px-4">
            Atividade Recente
          </h3>
          <div className="space-y-3">
            {[
              { action: 'Upload', file: 'foto.jpg', time: '2 min' },
              { action: 'Compartilhado', file: 'video.mp4', time: '1 hora' },
              { action: 'Favoritado', file: 'documento.pdf', time: '3 horas' }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <div className="w-2 h-2 bg-accent-blue rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-primary-900 truncate">
                    {activity.action}: {activity.file}
                  </p>
                  <p className="text-xs text-primary-500">{activity.time} atrás</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="mt-8 pt-6 border-t border-primary-100">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Configurações</span>
          </button>
        </div>
      </div>
    </motion.aside>
  )
}

export default ModernSidebar
