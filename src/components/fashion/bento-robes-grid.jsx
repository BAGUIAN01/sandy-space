"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRobesProducts } from '@/hooks/use-api'
import { 
  Heart, 
  ShoppingCart, 
  Eye, 
  Star, 
  ArrowRight,
  Sparkles,
  Crown,
  Zap,
  Loader2
} from 'lucide-react'

export function BentoRobesGrid() {
  const { products: featuredRobes, isLoading: loading, isError: error } = useRobesProducts({ limit: 6 })
  const [wishlist, setWishlist] = useState([])
  const [hoveredCard, setHoveredCard] = useState(null)

  const toggleWishlist = async (robeId) => {
    try {
      // TODO: Implémenter l'ajout/suppression de la wishlist via API
      setWishlist(prev => 
        prev.includes(robeId) 
          ? prev.filter(id => id !== robeId)
          : [...prev, robeId]
      )
    } catch (error) {
      console.error('Error updating wishlist:', error)
    }
  }

  // Formatage du prix user-friendly
  const formatPrice = (price, originalPrice = null) => {
    const priceInFCFA = Math.round(price * 655)
    const formattedPrice = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(priceInFCFA).replace('XOF', 'FCFA')
    
    return { formattedPrice, priceInFCFA }
  }

  const addToCart = async (robe) => {
    try {
      // TODO: Implémenter l'ajout au panier via API
      console.log('Added to cart:', robe)
      // Ici on pourrait ajouter une notification de succès
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const getGridClasses = (size) => {
    switch (size) {
      case 'large':
        return 'col-span-1 sm:col-span-2 row-span-2 h-[400px] sm:h-[500px] lg:h-auto'
      case 'medium':
        return 'col-span-1 row-span-2 h-[400px] sm:h-[500px] lg:h-auto'
      case 'small':
        return 'col-span-1 row-span-1 h-[200px] sm:h-[250px] lg:h-auto'
      default:
        return 'col-span-1 row-span-1 h-[200px] sm:h-[250px] lg:h-auto'
    }
  }

  // Affichage du loading
  if (loading) {
    return (
      <section className="py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 mb-6">
              <Crown className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-700 tracking-wide">Collection Premium</span>
            </div>
            
            <h2 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Robes d'Exception
            </h2>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mb-8"></div>
            
            <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
              Découvrez notre sélection exclusive de robes qui incarnent l'élégance et le raffinement. 
              Chaque pièce est soigneusement choisie pour vous offrir un style unique et intemporel.
            </p>
          </div>

          {/* Skeleton Loading */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-rows-4 gap-4 sm:gap-6 h-auto lg:h-[800px] mb-16">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-2xl lg:rounded-3xl animate-pulse flex items-center justify-center"
                style={{
                  gridColumn: index % 3 === 0 ? 'span 2' : 'span 1',
                  gridRow: index % 2 === 0 ? 'span 2' : 'span 1',
                  minHeight: '200px'
                }}
              >
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Affichage d'erreur
  if (error) {
    return (
      <section className="py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Oops ! Une erreur s'est produite
            </h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto max-w-7xl">
        {/* En-tête de section - Design élégant */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 mb-6">
            <Crown className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-700 tracking-wide">Collection Premium</span>
          </div>
          
          <h2 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
            Robes d'Exception
          </h2>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mb-8"></div>
          
          <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
            Découvrez notre sélection exclusive de robes qui incarnent l'élégance et le raffinement. 
            Chaque pièce est soigneusement choisie pour vous offrir un style unique et intemporel.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-rows-4 gap-4 sm:gap-6 h-auto lg:h-[800px] mb-16">
          {featuredRobes.map((robe, index) => (
            <div
              key={robe.id}
              className={`group relative overflow-hidden rounded-2xl lg:rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700 ease-out ${getGridClasses(robe.gridSize)}`}
              onMouseEnter={() => setHoveredCard(robe.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onTouchStart={() => setHoveredCard(robe.id)}
              onTouchEnd={() => setTimeout(() => setHoveredCard(null), 300)}
              style={{
                transform: hoveredCard === robe.id ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                zIndex: hoveredCard === robe.id ? 10 : 1
              }}
            >
              {/* Image avec overlay dégradé */}
              <div className="relative w-full h-full overflow-hidden">
                <Link href={`/products/${robe.slug}`}>
                  <Image
                    src={robe.image}
                    alt={robe.name}
                    fill
                    className="object-cover transition-all duration-1000 ease-out group-hover:scale-110"
                  />
                </Link>
                
                {/* Overlay dégradé sophistiqué */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                
                {/* Overlay de couleur subtile */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-all duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${robe.colors[0] === 'Noir' ? '#000' : 
                                                           robe.colors[0] === 'Rouge' ? '#dc2626' :
                                                           robe.colors[0] === 'Rose' ? '#ec4899' :
                                                           robe.colors[0] === 'Blanc' ? '#f8fafc' :
                                                           robe.colors[0] === 'Or' ? '#f59e0b' : '#6b7280'}20, transparent)`
                  }}
                />
              </div>

              {/* Badges élégants */}
              <div className="bento-badges absolute top-3 left-3 sm:top-6 sm:left-6 flex flex-col gap-2 sm:gap-3 z-20">
                {robe.isNew && (
                  <div className="bg-white/95 backdrop-blur-md text-gray-900 px-2 py-1 sm:px-4 sm:py-2 text-xs font-medium tracking-wider uppercase rounded-full shadow-lg border border-white/20">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Sparkles className="h-3 w-3" />
                      <span className="hidden sm:inline">Nouveau</span>
                      <span className="sm:hidden">New</span>
                    </div>
                  </div>
                )}
                {robe.isSale && (
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 sm:px-4 sm:py-2 text-xs font-medium tracking-wider uppercase rounded-full shadow-lg">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Zap className="h-3 w-3" />
                      -{Math.round((1 - robe.price / robe.originalPrice) * 100)}%
                    </div>
                  </div>
                )}
              </div>

              {/* Actions rapides */}
              <div className="bento-actions absolute top-3 right-3 sm:top-6 sm:right-6 flex flex-col gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 z-20">
                <button
                  className="w-8 h-8 sm:w-12 sm:h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg border border-white/20"
                  onClick={() => toggleWishlist(robe.id)}
                >
                  <Heart 
                    className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-200 ${
                      wishlist.includes(robe.id) ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-600'
                    }`} 
                  />
                </button>
                <button className="w-8 h-8 sm:w-12 sm:h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg border border-white/20">
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                </button>
              </div>

              {/* Contenu de la carte */}
              <div className="bento-content absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent pb-6 sm:pb-8 lg:pb-12">
                {/* Note et avis */}
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 sm:h-4 sm:w-4 transition-all duration-200 ${
                          i < Math.floor(robe.rating) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-white/80 font-medium tracking-wide">
                    {robe.reviews} avis
                  </span>
                </div>

                {/* Nom du produit */}
                <h3 className="text-lg sm:text-xl lg:text-2xl font-light text-white mb-2 sm:mb-3 tracking-wide opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200">
                  {robe.name}
                </h3>

                {/* Description */}
                <p className="text-white/80 mb-3 sm:mb-6 font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-300 delay-300 line-clamp-2 text-sm sm:text-base">
                  {robe.description}
                </p>

                {/* Prix et action */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-400">
                  <div className="flex flex-col sm:flex-row items-start sm:items-baseline gap-1 sm:gap-3">
                    <span className="text-xl sm:text-2xl lg:text-3xl font-light text-white tracking-wide">
                      {formatPrice(robe.price).formattedPrice}
                    </span>
                    {robe.originalPrice && robe.originalPrice > robe.price && (
                      <span className="text-sm sm:text-lg text-white/60 line-through font-light">
                        {formatPrice(robe.originalPrice).formattedPrice}
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={() => addToCart(robe)}
                    className="bg-white/95 backdrop-blur-md text-gray-900 hover:bg-white hover:scale-105 transition-all duration-200 px-4 py-2 sm:px-6 sm:py-3 rounded-full font-medium shadow-lg border border-white/20 text-sm sm:text-base w-full sm:w-auto mt-2 sm:mt-0"
                  >
                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Ajouter</span>
                    <span className="sm:hidden">+</span>
                  </Button>
                </div>
              </div>

              {/* Effet de brillance au survol */}
              <div className="bento-overlay absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 z-5">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              </div>
            </div>
          ))}
        </div>

        {/* Bouton d'action principal */}
        <div className="text-center">
          <Link href="/products">
            <Button className="group bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-4 text-lg font-medium tracking-wide hover:from-gray-800 hover:to-gray-700 transition-all duration-300 rounded-full shadow-lg hover:shadow-xl">
              <span>Découvrir toute la collection</span>
              <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>

        {/* Message si aucun produit */}
        {featuredRobes.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-light text-gray-900 mb-4">
              Aucune robe disponible
            </h3>
            <p className="text-gray-600 mb-8">
              Nous travaillons pour vous proposer de nouvelles collections. Revenez bientôt !
            </p>
            <Link href="/products">
              <Button variant="outline">
                Voir tous les produits
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
