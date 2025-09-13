import React from 'react'
import { AnimatePresence } from 'framer-motion'
import NotificationToast from './NotificationToast'

const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            {...notification}
            onClose={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default NotificationContainer
