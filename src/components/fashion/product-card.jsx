"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PriceBadge, PriceDisplay } from '@/components/ui/price-badge'
import { formatPriceWithIndicators } from '@/lib/price-utils'
import { 
  Heart, 
  ShoppingCart, 
  Eye, 
  Star, 
  Sparkles,
  Zap,
  Truck,
  Shield,
  ArrowRight,
  Plus,
  Minus
} from 'lucide-react'

export function ProductCard({ product, viewMode = "grid", onAddToCart, onToggleWishlist, isInWishlist }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [selectedSize, setSelectedSize] = useState(product.size?.[0] || 'M')
  const [showQuickView, setShowQuickView] = useState(false)

  // Utilisation des utilitaires de prix améliorés
  const priceInfo = formatPriceWithIndicators(product.price, product.originalPrice)

  // Gestion de l'ajout au panier avec feedback
  const handleAddToCart = async () => {
    if (isAddingToCart) return
    
    setIsAddingToCart(true)
    try {
      await onAddToCart?.(product)
      // Feedback visuel de succès
      setTimeout(() => setIsAddingToCart(false), 1500)
    } catch (error) {
      setIsAddingToCart(false)
    }
  }

  // Couleurs pour les indicateurs
  const getColorHex = (colorName) => {
    const colors = {
      'Noir': '#000000',
      'Rouge': '#DC2626',
      'Bleu': '#2563EB',
      'Rose': '#EC4899',
      'Blanc': '#FFFFFF',
      'Jaune': '#EAB308',
      'Gris': '#6B7280',
      'Marine': '#1E3A8A',
      'Or': '#F59E0B',
      'Beige': '#F5F5DC',
      'Ivoire': '#FEFCE8'
    }
    return colors[colorName] || '#6B7280'
  }

  if (viewMode === "list") {
    return (
      <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 ease-out">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative w-full md:w-80 h-64 md:h-80 overflow-hidden">
            <Link href={`/products/${product.slug}`}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
            </Link>
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <Badge className="bg-white/95 backdrop-blur-md text-gray-900 border-white/20 shadow-lg">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Nouveau
                </Badge>
              )}
              {priceInfo.hasDiscount && (
                <PriceBadge 
                  price={product.price} 
                  originalPrice={product.originalPrice} 
                  size="sm"
                />
              )}
            </div>

            {/* Actions rapides */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Button
                size="sm"
                variant="secondary"
                className="w-10 h-10 p-0 bg-white/95 backdrop-blur-md hover:bg-white shadow-lg"
                onClick={() => onToggleWishlist?.(product.id)}
              >
                <Heart 
                  className={`h-4 w-4 ${
                    isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`} 
                />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="w-10 h-10 p-0 bg-white/95 backdrop-blur-md hover:bg-white shadow-lg"
                onClick={() => setShowQuickView(true)}
              >
                <Eye className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 font-medium">
                  {product.rating} ({product.reviews} avis)
                </span>
              </div>

              {/* Title */}
              <Link href={`/products/${product.slug}`}>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-gray-700 transition-colors duration-200">
                  {product.name}
                </h3>
              </Link>

              {/* Description */}
              <p className="text-gray-600 mb-4 line-clamp-2">
                {product.description}
              </p>

              {/* Price */}
              <div className="mb-4">
                <PriceDisplay 
                  price={product.price}
                  originalPrice={product.originalPrice}
                  size="lg"
                  showSavings={true}
                />
              </div>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-gray-500 font-medium">Couleurs:</span>
                  <div className="flex gap-2">
                    {product.colors.slice(0, 5).map((color, index) => (
                      <div
                        key={index}
                        className="w-5 h-5 rounded-full border-2 border-gray-200 shadow-sm hover:scale-110 transition-transform duration-200"
                        style={{ backgroundColor: getColorHex(color) }}
                        title={color}
                      />
                    ))}
                    {product.colors.length > 5 && (
                      <span className="text-xs text-gray-400 font-medium">
                        +{product.colors.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex-1 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isAddingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Ajout...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Ajouter au panier
                  </>
                )}
              </Button>
              <Link href={`/products/${product.slug}`}>
                <Button variant="outline" className="px-6">
                  Voir détails
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Vue grille (par défaut)
  return (
    <div 
      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-50">
        <Link href={`/products/${product.slug}`}>
          <div className="aspect-[3/4] relative">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-white/95 backdrop-blur-md text-gray-900 border-white/20 shadow-lg animate-pulse">
              <Sparkles className="h-3 w-3 mr-1" />
              Nouveau
            </Badge>
          )}
          {priceInfo.hasDiscount && (
            <PriceBadge 
              price={product.price} 
              originalPrice={product.originalPrice} 
              size="sm"
            />
          )}
        </div>

        {/* Quick Actions */}
        <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}>
          <Button
            size="sm"
            variant="secondary"
            className="w-10 h-10 p-0 bg-white/95 backdrop-blur-md hover:bg-white shadow-lg hover:scale-110 transition-all duration-200"
            onClick={() => onToggleWishlist?.(product.id)}
          >
            <Heart 
              className={`h-4 w-4 transition-all duration-200 ${
                isInWishlist ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-600'
              }`} 
            />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="w-10 h-10 p-0 bg-white/95 backdrop-blur-md hover:bg-white shadow-lg hover:scale-110 transition-all duration-200"
            onClick={() => setShowQuickView(true)}
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </Button>
        </div>

        {/* Stock indicator */}
        {product.stock && product.stock < 10 && (
          <div className="absolute bottom-4 left-4">
            <Badge variant="destructive" className="text-xs">
              Plus que {product.stock} en stock
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 transition-colors duration-200 ${
                  i < Math.floor(product.rating) 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Title */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-gray-700 transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price Section */}
        <div className="mb-4">
          <PriceDisplay 
            price={product.price}
            originalPrice={product.originalPrice}
            size="default"
            showSavings={true}
          />
        </div>

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-gray-500 font-medium">Couleurs:</span>
            <div className="flex gap-1.5">
              {product.colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border-2 border-gray-200 shadow-sm hover:scale-125 transition-transform duration-200 cursor-pointer"
                  style={{ backgroundColor: getColorHex(color) }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-400 font-medium ml-1">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Trust indicators */}
        <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Truck className="h-3 w-3" />
            <span>Livraison gratuite</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>Retour facile</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 group/btn"
        >
          {isAddingToCart ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Ajout en cours...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
              Ajouter au panier
              <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}