'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FASHION_CATEGORIES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { ChevronDown, Search, Menu, X } from 'lucide-react'

export function StickyNavigation() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Afficher la navigation sticky après 200px de scroll
      setIsVisible(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo compact */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-lg font-bold text-gray-900">Sandy Space</span>
          </Link>

          {/* Navigation rapide */}
          <nav className="hidden md:flex items-center gap-6">
            <div className="relative group">
              <Button variant="ghost" className="flex items-center gap-1">
                Catégories
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              {/* Dropdown rapide */}
              <div className="absolute top-full left-0 w-96 bg-white shadow-xl border-t opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {FASHION_CATEGORIES.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/products/category/${category.slug}`}
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span className="text-sm font-medium">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link href="/collections" className="text-gray-700 hover:text-pink-600 transition-colors text-sm font-medium">
              Collections
            </Link>
            <Link href="/brands" className="text-gray-700 hover:text-pink-600 transition-colors text-sm font-medium">
              Marques
            </Link>
            <Link href="/sale" className="text-red-600 hover:text-red-700 transition-colors text-sm font-medium">
              Soldes
            </Link>
          </nav>

          {/* Actions rapides */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>

            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" size="sm">
                Rechercher
              </Button>
              <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                Nouveautés
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant de navigation mobile optimisée
export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Bouton menu mobile */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Overlay mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="space-y-4">
                {/* Catégories */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Catégories</h3>
                  <div className="space-y-2">
                    {FASHION_CATEGORIES.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/products/category/${category.slug}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="text-xl">{category.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{category.name}</div>
                          <div className="text-xs text-gray-500">{category.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Liens principaux */}
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <Link 
                      href="/collections" 
                      className="block py-2 text-gray-700 hover:text-pink-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Collections
                    </Link>
                    <Link 
                      href="/brands" 
                      className="block py-2 text-gray-700 hover:text-pink-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Marques
                    </Link>
                    <Link 
                      href="/sale" 
                      className="block py-2 text-red-600 hover:text-red-700 transition-colors font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Soldes
                    </Link>
                    <Link 
                      href="/about" 
                      className="block py-2 text-gray-700 hover:text-pink-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      À propos
                    </Link>
                    <Link 
                      href="/contact" 
                      className="block py-2 text-gray-700 hover:text-pink-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Contact
                    </Link>
                  </div>
                </div>

                {/* Actions utilisateur */}
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Mon compte
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Ma wishlist
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Mes commandes
                    </Button>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
