import React from 'react'
import { motion } from 'framer-motion'

const LoadingSkeleton = ({ count = 6, viewMode = 'grid' }) => {
  const skeletonItems = Array.from({ length: count }, (_, i) => i)

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tamanho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {skeletonItems.map((item) => (
                <motion.tr
                  key={item}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: item * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 bg-gray-200 rounded-lg loading-skeleton"></div>
                      </div>
                      <div className="ml-4">
                        <div className="h-4 bg-gray-200 rounded loading-skeleton w-32"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded loading-skeleton w-16"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded loading-skeleton w-20"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded loading-skeleton w-24"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <div className="h-4 w-4 bg-gray-200 rounded loading-skeleton"></div>
                      <div className="h-4 w-4 bg-gray-200 rounded loading-skeleton"></div>
                      <div className="h-4 w-4 bg-gray-200 rounded loading-skeleton"></div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="media-grid">
      {skeletonItems.map((item) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: item * 0.1 }}
          className="media-item"
        >
          {/* Thumbnail Skeleton */}
          <div className="media-thumbnail">
            <div className="w-full h-full bg-gray-200 loading-skeleton"></div>
          </div>

          {/* Info Skeleton */}
          <div className="media-info">
            <div className="h-5 bg-gray-200 rounded loading-skeleton mb-2"></div>
            <div className="media-meta">
              <div className="h-3 bg-gray-200 rounded loading-skeleton w-16"></div>
              <div className="h-3 bg-gray-200 rounded loading-skeleton w-20"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default LoadingSkeleton
