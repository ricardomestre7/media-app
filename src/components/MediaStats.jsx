import React from 'react'
import { motion } from 'framer-motion'
import { 
  Image, 
  Video, 
  Music, 
  File, 
  HardDrive,
  Calendar
} from 'lucide-react'

const MediaStats = ({ files }) => {
  const stats = files.reduce((acc, file) => {
    const fileType = file.type.split('/')[0]
    
    acc.totalFiles++
    acc.totalSize += file.size
    
    switch (fileType) {
      case 'image':
        acc.images++
        break
      case 'video':
        acc.videos++
        break
      case 'audio':
        acc.audios++
        break
      default:
        acc.others++
    }
    
    return acc
  }, {
    totalFiles: 0,
    totalSize: 0,
    images: 0,
    videos: 0,
    audios: 0,
    others: 0
  })

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStoragePercentage = () => {
    // Simulação de limite de armazenamento (1GB)
    const maxStorage = 1024 * 1024 * 1024 // 1GB em bytes
    return Math.min((stats.totalSize / maxStorage) * 100, 100)
  }

  const statItems = [
    {
      label: 'Total de Arquivos',
      value: stats.totalFiles,
      icon: File,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Imagens',
      value: stats.images,
      icon: Image,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Vídeos',
      value: stats.videos,
      icon: Video,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Áudios',
      value: stats.audios,
      icon: Music,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {item.label}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {item.value}
              </p>
            </div>
            <div className={`p-3 rounded-full ${item.bgColor}`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
          </div>
        </motion.div>
      ))}

      {/* Storage Usage */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Armazenamento
            </p>
            <p className="text-lg font-bold text-gray-900">
              {formatFileSize(stats.totalSize)}
            </p>
          </div>
          <div className="p-3 rounded-full bg-gray-100">
            <HardDrive className="w-6 h-6 text-gray-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Usado</span>
            <span>{getStoragePercentage().toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getStoragePercentage()}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default MediaStats
