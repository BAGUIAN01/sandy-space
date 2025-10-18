'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { User, LogOut, Settings, Heart, ShoppingBag, ChevronDown } from 'lucide-react'

export default function ProfileMenu() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef(null)
  const router = useRouter()

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="animate-pulse">
        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton de profil */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="group h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 text-gray-600 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300 ease-out hover:scale-105 active:scale-95 relative cursor-pointer"
      >
        <User className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:scale-110" />
        <ChevronDown className={`h-3 w-3 absolute -bottom-1 -right-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
          {session ? (
            // Menu utilisateur connecté
            <>
              {/* En-tête utilisateur */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {session.user.name || session.user.username}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Options du menu */}
              <div className="py-1">
                <button
                  onClick={() => {
                    router.push('/profile')
                    setIsOpen(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-600 transition-colors duration-200 flex items-center space-x-3 cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  <span>Mon Profil</span>
                </button>

                <button
                  onClick={() => {
                    router.push('/wishlist')
                    setIsOpen(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors duration-200 flex items-center space-x-3 cursor-pointer"
                >
                  <Heart className="h-4 w-4" />
                  <span>Mes Favoris</span>
                </button>

                <button
                  onClick={() => {
                    router.push('/orders')
                    setIsOpen(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors duration-200 flex items-center space-x-3 cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Mes Commandes</span>
                </button>

                {session.user.role === 'ADMIN' && (
                  <button
                    onClick={() => {
                      router.push('/admin')
                      setIsOpen(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors duration-200 flex items-center space-x-3 cursor-pointer"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Administration</span>
                  </button>
                )}

                <div className="border-t border-gray-100 my-1"></div>

                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors duration-200 flex items-center space-x-3 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{isLoading ? 'Déconnexion...' : 'Se déconnecter'}</span>
                </button>
              </div>
            </>
          ) : (
            // Menu visiteur
            <div className="py-1">
              <button
                onClick={() => {
                  router.push('/login')
                  setIsOpen(false)
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-600 transition-colors duration-200 flex items-center space-x-3 cursor-pointer"
              >
                <User className="h-4 w-4" />
                <span>Se connecter</span>
              </button>

              <button
                onClick={() => {
                  router.push('/register')
                  setIsOpen(false)
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors duration-200 flex items-center space-x-3 cursor-pointer"
              >
                <User className="h-4 w-4" />
                <span>S'inscrire</span>
              </button>

              <div className="border-t border-gray-100 my-1"></div>

              <button
                onClick={() => {
                  router.push('/wishlist')
                  setIsOpen(false)
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors duration-200 flex items-center space-x-3 cursor-pointer"
              >
                <Heart className="h-4 w-4" />
                <span>Mes Favoris</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
