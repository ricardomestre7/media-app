import { useState, useCallback } from 'react'

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random()
    const newNotification = {
      id,
      type: 'info',
      duration: 4000,
      ...notification
    }
    
    setNotifications(prev => [...prev, newNotification])
    return id
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const success = useCallback((title, message, duration = 4000) => {
    return addNotification({ type: 'success', title, message, duration })
  }, [addNotification])

  const error = useCallback((title, message, duration = 6000) => {
    return addNotification({ type: 'error', title, message, duration })
  }, [addNotification])

  const warning = useCallback((title, message, duration = 5000) => {
    return addNotification({ type: 'warning', title, message, duration })
  }, [addNotification])

  const info = useCallback((title, message, duration = 4000) => {
    return addNotification({ type: 'info', title, message, duration })
  }, [addNotification])

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  }
}

export default useNotifications
