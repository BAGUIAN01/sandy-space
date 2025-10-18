'use client'

import { useEffect, useState } from 'react'
import { useNotificationStore } from '@/stores/cart-store'
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react'

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertCircle
}

const colorMap = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
}

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotificationStore()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  )
}

function Notification({ notification, onRemove }) {
  const [isVisible, setIsVisible] = useState(false)
  const IconComponent = iconMap[notification.type] || Info

  useEffect(() => {
    // Animation d'entrée
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Auto-suppression
    if (notification.duration) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onRemove(notification.id), 300)
      }, notification.duration)
      return () => clearTimeout(timer)
    }
  }, [notification.duration, notification.id, onRemove])

  const handleRemove = () => {
    setIsVisible(false)
    setTimeout(() => onRemove(notification.id), 300)
  }

  return (
    <div
      className={`
        max-w-sm w-full p-4 rounded-lg border shadow-lg transition-all duration-300 transform
        ${colorMap[notification.type]}
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="flex items-start space-x-3">
        <IconComponent className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          {notification.title && (
            <h4 className="text-sm font-semibold mb-1">
              {notification.title}
            </h4>
          )}
          {notification.message && (
            <p className="text-sm opacity-90">
              {notification.message}
            </p>
          )}
        </div>
        <button
          onClick={handleRemove}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
