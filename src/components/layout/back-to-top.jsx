'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUp } from 'lucide-react'

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Afficher le bouton après 300px de scroll
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (!isVisible) return null

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className="fixed bottom-6 right-6 z-40 bg-pink-600 hover:bg-pink-700 shadow-lg rounded-full w-12 h-12"
      aria-label="Retour en haut de page"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  )
}

// Composant de notification toast
export function Toast({ message, type = 'info', isVisible, onClose }) {
  if (!isVisible) return null

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white'
  }

  return (
    <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${typeStyles[type]} transition-all duration-300`}>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

// Composant de loading global
export function GlobalLoader({ isLoading }) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Chargement...</p>
      </div>
    </div>
  )
}

// Composant de notification de stock
export function StockNotification({ product, onClose }) {
  if (!product || product.stock > 5) return null

  return (
    <div className="fixed bottom-20 right-4 z-40 bg-orange-500 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-sm">Stock limité !</h4>
          <p className="text-sm mt-1">
            Il ne reste que {product.stock} exemplaire(s) de "{product.name}"
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
