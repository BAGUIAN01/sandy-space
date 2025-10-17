"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SizeGuide, CategoryInfo } from './size-guide'
import { formatPrice } from '@/lib/utils'
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react'

// Composant spécialisé pour les robes
export function DressCard({ product, onAddToCart, onAddToWishlist, onQuickView }) {
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Badges */}
      {product.isNew && <Badge variant="success" className="absolute top-2 left-2 z-10">Nouveau</Badge>}
      {product.isSale && <Badge variant="destructive" className="absolute top-2 right-2 z-10">Promo</Badge>}
      
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={product.images?.[0]?.url || '/placeholder-dress.jpg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Actions overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
            <Button size="icon" variant="secondary" onClick={() => onQuickView?.(product)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" onClick={() => onAddToWishlist?.(product)}>
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 mb-1">{product.brand.name}</p>
        )}
        
        {/* Title */}
        <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-xs text-gray-500">(4.5)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-semibold text-lg">{formatPrice(product.basePrice)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Size Guide */}
        <div className="mb-3">
          <SizeGuide category="robes" />
        </div>

        {/* Add to Cart */}
        <Button
          className="w-full"
          onClick={() => onAddToCart?.(product)}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Ajouter au panier
        </Button>
      </CardContent>
    </Card>
  )
}

// Composant spécialisé pour les compléments alimentaires
export function SupplementCard({ product, onAddToCart, onAddToWishlist, onQuickView }) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Badges */}
      {product.isNew && <Badge variant="success" className="absolute top-2 left-2 z-10">Nouveau</Badge>}
      {product.isBio && <Badge variant="info" className="absolute top-2 right-2 z-10">Bio</Badge>}
      
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images?.[0]?.url || '/placeholder-supplement.jpg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <CardContent className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 mb-1">{product.brand.name}</p>
        )}
        
        {/* Title */}
        <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h3>

        {/* Description */}
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Dosage */}
        {product.dosage && (
          <div className="mb-3">
            <span className="text-xs font-medium text-green-600">Dosage: {product.dosage}</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-semibold text-lg">{formatPrice(product.basePrice)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <Button
          className="w-full"
          onClick={() => onAddToCart?.(product)}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Ajouter au panier
        </Button>
      </CardContent>
    </Card>
  )
}

// Composant spécialisé pour les chaussures
export function ShoeCard({ product, onAddToCart, onAddToWishlist, onQuickView }) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Badges */}
      {product.isNew && <Badge variant="success" className="absolute top-2 left-2 z-10">Nouveau</Badge>}
      {product.isSale && <Badge variant="destructive" className="absolute top-2 right-2 z-10">Promo</Badge>}
      
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images?.[0]?.url || '/placeholder-shoe.jpg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Actions overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
            <Button size="icon" variant="secondary" onClick={() => onQuickView?.(product)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" onClick={() => onAddToWishlist?.(product)}>
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 mb-1">{product.brand.name}</p>
        )}
        
        {/* Title */}
        <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-xs text-gray-500">(4.2)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-semibold text-lg">{formatPrice(product.basePrice)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Size Guide */}
        <div className="mb-3">
          <SizeGuide category="chaussures" />
        </div>

        {/* Add to Cart */}
        <Button
          className="w-full"
          onClick={() => onAddToCart?.(product)}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Voir les tailles
        </Button>
      </CardContent>
    </Card>
  )
}

// Composant spécialisé pour les perles
export function PearlCard({ product, onAddToCart, onAddToWishlist, onQuickView }) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Badges */}
      {product.isHandmade && <Badge variant="info" className="absolute top-2 left-2 z-10">Artisanal</Badge>}
      {product.isLimited && <Badge variant="warning" className="absolute top-2 right-2 z-10">Édition limitée</Badge>}
      
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images?.[0]?.url || '/placeholder-pearl.jpg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <CardContent className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 mb-1">{product.brand.name}</p>
        )}
        
        {/* Title */}
        <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h3>

        {/* Material */}
        {product.material && (
          <p className="text-xs text-gray-600 mb-2">Matière: {product.material}</p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-semibold text-lg">{formatPrice(product.basePrice)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <Button
          className="w-full"
          onClick={() => onAddToCart?.(product)}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Ajouter au panier
        </Button>
      </CardContent>
    </Card>
  )
}
