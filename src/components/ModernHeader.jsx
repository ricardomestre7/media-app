import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Menu,
  Upload,
  Grid3X3,
  List,
  Filter
} from 'lucide-react'

const ModernHeader = ({ 
  user, 
  onLogout, 
  searchQuery, 
  onSearchChange, 
  viewMode, 
  onViewModeChange,
  onFilterChange,
  onUploadClick 
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="modern-header"
    >
      <div className="header-content">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-icon">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h1 className="logo-text">Media Center</h1>
            <p className="text-sm text-primary-500 font-medium">0 arquivos</p>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="hidden md:flex items-center gap-4 flex-1 max-w-2xl mx-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-400" />
            <input
              type="text"
              placeholder="Buscar arquivos..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="input-premium pl-10 pr-4 w-full"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onFilterChange('all')}
              className="btn-premium btn-ghost text-sm px-3 py-2"
            >
              <Filter className="w-4 h-4 mr-2" />
              Todos os tipos
            </button>
            
            <div className="flex items-center bg-primary-50 rounded-xl p-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-primary-500 hover:text-primary-600'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-primary-500 hover:text-primary-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {/* Upload Button */}
          <button
            onClick={onUploadClick}
            className="btn-premium btn-primary hidden sm:flex"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-primary-500 hover:text-primary-700 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-rose rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 text-primary-500 hover:text-primary-700 transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-xl hover:bg-primary-50 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.user_metadata?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-primary-900">
                  {user?.user_metadata?.name || 'Usuário'}
                </p>
                <p className="text-xs text-primary-500">
                  {user?.email || 'usuario@exemplo.com'}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-64 premium-card z-50"
              >
                <div className="p-4 border-b border-primary-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                      {user?.user_metadata?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-primary-900">
                        {user?.user_metadata?.name || 'Usuário'}
                      </p>
                      <p className="text-sm text-primary-500">
                        {user?.email || 'usuario@exemplo.com'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-primary-700 hover:bg-primary-50 rounded-lg transition-colors">
                    <User className="w-4 h-4" />
                    Perfil
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-primary-700 hover:bg-primary-50 rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                    Configurações
                  </button>
                  <hr className="my-2 border-primary-100" />
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-primary-500 hover:text-primary-700 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-primary-100 p-4"
        >
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-400" />
              <input
                type="text"
                placeholder="Buscar arquivos..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="input-premium pl-10 pr-4 w-full"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <button
                onClick={() => onFilterChange('all')}
                className="btn-premium btn-ghost text-sm px-3 py-2"
              >
                <Filter className="w-4 h-4 mr-2" />
                Todos os tipos
              </button>
              
              <div className="flex items-center bg-primary-50 rounded-xl p-1">
                <button
                  onClick={() => onViewModeChange('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white text-primary-600 shadow-sm' 
                      : 'text-primary-500 hover:text-primary-600'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onViewModeChange('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white text-primary-600 shadow-sm' 
                      : 'text-primary-500 hover:text-primary-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <button
              onClick={onUploadClick}
              className="btn-premium btn-primary w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Fazer Upload
            </button>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}

export default ModernHeader
