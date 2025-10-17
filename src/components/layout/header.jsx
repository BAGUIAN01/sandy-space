"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FASHION_CATEGORIES } from '@/lib/constants'
import { SearchBar, CartButton, WishlistButton } from '@/components/ecommerce/search-bar'
import { CartDrawer } from '@/components/ecommerce/cart-drawer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart, useWishlist } from '@/hooks/use-cart'
import {
  Menu,
  X,
  Search,
  User,
  Heart,
  ShoppingCart,
  ChevronDown,
  Shirt,
  Square,
  Pill,
  Footprints,
  Gem,
  ShoppingBag
} from 'lucide-react'

// Mapping des icônes
const iconMap = {
  Shirt: Shirt,
  Square: Square,
  Pill: Pill,
  Footprints: Footprints,
  Gem: Gem,
  ShoppingBag: ShoppingBag
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const pathname = usePathname()
  const { items: cartItems } = useCart()
  const { items: wishlistItems } = useWishlist()

  // Vérifier si nous sommes sur la page robes
  const isRobesPage = pathname === '/products/robes'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const cartCount = cartItems?.length || 0
  const wishlistCount = wishlistItems?.length || 0

  return (
    <>
      {/* Header principal */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b' 
          : 'bg-white border-b'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24 lg:h-28">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden  transition-all duration-200">
                <Image
                  src="/logo.png"
                  alt="Sandy Space Logo"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Navigation principale */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-10">
              {/* Catégories principales (3 premières) */}
              {FASHION_CATEGORIES.slice(0, 3).map((category) => (
                <div
                  key={category.slug}
                  className="relative group"
                  onMouseEnter={() => setActiveCategory(category.slug)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <Link
                    href={`/products/category/${category.slug}`}
                    className={`flex items-center space-x-1 lg:space-x-2 transition-colors duration-200 font-body-semibold text-sm lg:text-base py-2 px-2 lg:px-3 rounded-lg hover:bg-gray-50 ${
                      category.slug === 'robes' && isRobesPage
                        ? 'text-amber-600 bg-amber-50 border border-amber-200'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {(() => {
                      const IconComponent = iconMap[category.icon]
                      return IconComponent ? <IconComponent className="h-4 w-4 lg:h-5 lg:w-5" /> : null
                    })()}
                    <span className="hidden lg:inline">{category.name}</span>
                    <span className="lg:hidden">{category.name.slice(0, 4)}</span>
                    <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4 transition-transform duration-200 group-hover:rotate-180" />
                  </Link>

                  {/* Mega menu épuré */}
                  {activeCategory === category.slug && (
                    <div className="absolute top-full left-0 w-80 bg-white rounded-lg shadow-lg border p-6 z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                            {(() => {
                              const IconComponent = iconMap[category.icon]
                              return IconComponent ? <IconComponent className="h-5 w-5 mr-2" /> : null
                            })()}
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                          <Link href="/products/robes">
                            <Button 
                              size="sm" 
                              className="w-full transition-all duration-300 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:text-white hover:shadow-lg hover:scale-105 cursor-pointer border border-gray-200 hover:border-transparent"
                            >
                              Voir la collection
                            </Button>
                          </Link>
                        </div>
                        <div className="border-t pt-4">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-gray-600 hover:text-gray-900 cursor-pointer py-1 transition-colors duration-200 hover:bg-gray-50 rounded px-2">
                              Nouveautés
                            </div>
                            <div className="text-gray-600 hover:text-gray-900 cursor-pointer py-1 transition-colors duration-200 hover:bg-gray-50 rounded px-2">
                              Offres spéciales
                            </div>
                            <div className="text-gray-600 hover:text-gray-900 cursor-pointer py-1 transition-colors duration-200 hover:bg-gray-50 rounded px-2">
                              Produits premium
                            </div>
                            <div className="text-gray-600 hover:text-gray-900 cursor-pointer py-1 transition-colors duration-200 hover:bg-gray-50 rounded px-2">
                              Guide des tailles
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Menu "Collections" pour les autres catégories */}
              <div
                className="relative group"
                onMouseEnter={() => setActiveCategory('collections')}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <button className="flex items-center space-x-1 lg:space-x-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 font-body-semibold text-sm lg:text-base py-2 px-2 lg:px-3 rounded-lg hover:bg-gray-50">
                  <span className="hidden lg:inline">Collections</span>
                  <span className="lg:hidden">Plus</span>
                  <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4 transition-transform duration-200 group-hover:rotate-180" />
                </button>

                {/* Mega menu pour toutes les collections */}
                {activeCategory === 'collections' && (
                  <div className="absolute top-full left-0 w-96 bg-white rounded-lg shadow-lg border p-6 z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Toutes nos Collections</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {FASHION_CATEGORIES.slice(3).map((category) => (
                            <Link
                              key={category.slug}
                              href={`/products/category/${category.slug}`}
                              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              {(() => {
                                const IconComponent = iconMap[category.icon]
                                return IconComponent ? <IconComponent className="h-5 w-5 text-gray-600" /> : null
                              })()}
                              <div>
                                <div className="font-medium text-gray-900 text-sm">{category.name}</div>
                                <div className="text-xs text-gray-500">{category.description}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <Button size="sm" className="w-full">
                          Voir toutes les collections
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Actions utilisateur */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
              {/* Recherche */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="group h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 ease-out hover:scale-105 active:scale-95"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:rotate-12" />
              </Button>

              {/* Compte utilisateur */}
              <Button
                variant="ghost"
                size="icon"
                className="group h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 ease-out hover:scale-105 active:scale-95 hidden sm:flex"
              >
                <User className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:scale-110" />
              </Button>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {}}
                className="group h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all duration-300 ease-out hover:scale-105 active:scale-95 relative hidden sm:flex"
              >
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 group-hover:fill-red-500 group-hover:scale-110" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-xs bg-red-500 text-white p-0 transition-all duration-300 group-hover:scale-110 group-hover:animate-pulse">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>

              {/* Panier */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(true)}
                className="group h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-300 ease-out hover:scale-105 active:scale-95 relative"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-xs bg-green-600 text-white p-0 transition-all duration-300 group-hover:scale-110 group-hover:animate-bounce">
                    {cartCount}
                  </Badge>
                )}
              </Button>

              {/* Menu mobile */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="group md:hidden h-9 w-9 sm:h-10 sm:w-10 text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300 ease-out hover:scale-105 active:scale-95"
              >
                {isMenuOpen ? (
                  <X className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:rotate-90" />
                ) : (
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:scale-110" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Barre de recherche épurée */}
        {isSearchOpen && (
          <div className="border-t bg-gray-50/50 py-3">
            <div className="container mx-auto px-4">
              <SearchBar
                onSearch={(query) => console.log('Search:', query)}
                placeholder="Rechercher des produits..."
                className="max-w-xl mx-auto"
              />
            </div>
          </div>
        )}

        {/* Menu mobile épuré */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-2">
                {/* Catégories principales */}
                {FASHION_CATEGORIES.slice(0, 3).map((category) => (
                  <Link
                    key={category.slug}
                    href={`/products/category/${category.slug}`}
                    className="group flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100 active:scale-95 transition-all duration-200 ease-out py-3 px-4 rounded-xl hover:shadow-sm cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {(() => {
                      const IconComponent = iconMap[category.icon]
                      return IconComponent ? <IconComponent className="h-5 w-5 transition-transform duration-200 group-hover:scale-110 group-hover:text-blue-600" /> : null
                    })()}
                    <span className="font-body-semibold transition-colors duration-200 group-hover:text-blue-600">{category.name}</span>
                  </Link>
                ))}
                
                {/* Séparateur */}
                <div className="border-t border-gray-200 my-4"></div>
                
                {/* Titre Collections */}
                <div className="px-4 py-2">
                  <span className="text-sm font-body-semibold text-gray-500 uppercase tracking-wider">Collections</span>
                </div>
                
                {/* Autres catégories */}
                {FASHION_CATEGORIES.slice(3).map((category) => (
                  <Link
                    key={category.slug}
                    href={`/products/category/${category.slug}`}
                    className="group flex items-center space-x-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 active:bg-purple-100 active:scale-95 transition-all duration-200 ease-out py-3 px-4 rounded-xl hover:shadow-sm cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {(() => {
                      const IconComponent = iconMap[category.icon]
                      return IconComponent ? <IconComponent className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 group-hover:text-purple-600" /> : null
                    })()}
                    <span className="font-body-medium text-sm transition-colors duration-200 group-hover:text-purple-600">{category.name}</span>
                  </Link>
                ))}
                
                {/* Actions supplémentaires pour mobile */}
                <div className="border-t border-gray-200 my-4 pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/account"
                      className="group flex items-center space-x-2 text-gray-600 hover:text-green-600 hover:bg-green-50 active:bg-green-100 active:scale-95 transition-all duration-200 ease-out py-3 px-4 rounded-xl hover:shadow-sm cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 group-hover:text-green-600" />
                      <span className="font-body-medium text-sm transition-colors duration-200 group-hover:text-green-600">Mon compte</span>
                    </Link>
                    <Link
                      href="/wishlist"
                      className="group flex items-center space-x-2 text-gray-600 hover:text-red-500 hover:bg-red-50 active:bg-red-100 active:scale-95 transition-all duration-200 ease-out py-3 px-4 rounded-xl hover:shadow-sm cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Heart className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 group-hover:text-red-500 group-hover:fill-red-500" />
                      <span className="font-body-medium text-sm transition-colors duration-200 group-hover:text-red-500">Favoris</span>
                    </Link>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}