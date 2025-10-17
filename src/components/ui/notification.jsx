"use client"

import { useEffect, useState } from 'react'
import { useNotificationStore } from '@/stores/cart-store'
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X,
  ShoppingCart,
  Heart,
  Star
} from 'lucide-react'

export function NotificationToast() {
  const notifications = useNotificationStore((state) => state.notifications)
  const removeNotification = useNotificationStore((state) => state.removeNotification)

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />
      case 'cart':
        return <ShoppingCart className="h-5 w-5 text-blue-600" />
      case 'wishlist':
        return <Heart className="h-5 w-5 text-red-600" />
      case 'rating':
        return <Star className="h-5 w-5 text-yellow-600" />
      default:
        return <Info className="h-5 w-5 text-gray-600" />
    }
  }

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      case 'cart':
        return 'bg-blue-50 border-blue-200'
      case 'wishlist':
        return 'bg-pink-50 border-pink-200'
      case 'rating':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getBgColor(notification.type)} border rounded-lg p-4 shadow-lg transform transition-all duration-300 ease-in-out animate-in slide-in-from-right-5`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {getIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              {notification.title && (
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  {notification.title}
                </h4>
              )}
              
              {notification.message && (
                <p className="text-sm text-gray-600">
                  {notification.message}
                </p>
              )}
              
              {notification.action && (
                <div className="mt-2">
                  <button
                    onClick={notification.action.onClick}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    {notification.action.label}
                  </button>
                </div>
              )}
            </div>
            
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Barre de progression */}
          {notification.duration && (
            <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gray-400 rounded-full animate-pulse"
                style={{
                  animationDuration: `${notification.duration}ms`,
                  animationFillMode: 'forwards'
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Composant pour afficher les notifications dans le layout
export function NotificationProvider({ children }) {
  return (
    <>
      {children}
      <NotificationToast />
    </>
  )
}
