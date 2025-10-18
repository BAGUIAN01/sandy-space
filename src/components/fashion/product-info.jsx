"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PriceDisplay } from '@/components/ui/price-badge'
import { 
  Star, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw, 
  Clock,
  Award,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'

export function ProductInfo({ product, selectedVariant, onVariantChange, onAddToCart, onToggleWishlist, isInWishlist }) {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  // Calculer le prix actuel (variante ou prix de base)
  const currentPrice = selectedVariant?.price || product.basePrice
  const originalPrice = selectedVariant?.compareAtPrice || product.compareAtPrice

  // Gestion de l'ajout au panier
  const handleAddToCart = async () => {
    if (isAddingToCart) return
    
    setIsAddingToCart(true)
    try {
      await onAddToCart?.(product, selectedVariant)
      // Feedback visuel de succès
      setTimeout(() => setIsAddingToCart(false), 1500)
    } catch (error) {
      setIsAddingToCart(false)
      console.error('Error adding to cart:', error)
    }
  }

  // Gestion du partage
  const handleShare = async () => {
    setIsSharing(true)
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.shortDescription || product.description,
          url: window.location.href
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        // TODO: Afficher une notification de succès
      }
    } catch (error) {
      console.error('Error sharing:', error)
    } finally {
      setIsSharing(false)
    }
  }

  // Gestion de la wishlist
  const handleToggleWishlist = () => {
    onToggleWishlist?.(product.id)
  }

  // Vérifier la disponibilité
  const isAvailable = selectedVariant ? selectedVariant.stock > 0 : true
  const isLowStock = selectedVariant ? selectedVariant.stock <= 5 && selectedVariant.stock > 0 : false

  return (
    <div className="space-y-6">
      {/* Header du produit */}
      <div className="space-y-4">
        {/* Marque */}
        {product.brand && (
          <div className="flex items-center gap-2">
            {product.brand.logo && (
              <img 
                src={product.brand.logo} 
                alt={product.brand.name}
                className="w-6 h-6 object-contain"
              />
            )}

          </div>
        )}

        {/* Titre */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          {product.name}
        </h1>

        {/* SKU */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Référence:</span>
          <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
            {selectedVariant?.sku || product.sku}
          </code>
        </div>
      </div>

      {/* Prix et promotions */}
      <div className="space-y-3">
        <PriceDisplay 
          price={currentPrice}
          originalPrice={originalPrice}
          size="xl"
          showSavings={true}
          className="mb-4"
        />

        {/* Indicateurs de stock */}
        <div className="flex items-center gap-4">
          {isAvailable ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {isLowStock ? `Plus que ${selectedVariant.stock} en stock` : 'En stock'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Rupture de stock</span>
            </div>
          )}

          {product.isFeatured && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <Award className="h-3 w-3 mr-1" />
              Produit vedette
            </Badge>
          )}
        </div>
      </div>

      {/* Avis et notes */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.avgRating) 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-900">
            {product.avgRating}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{product.reviewCount} avis</span>
        </div>

        {product.viewCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4" />
            <span>{product.viewCount} vues</span>
          </div>
        )}
      </div>

      {/* Actions principales */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={!isAvailable || isAddingToCart}
          className="flex-1 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 py-3"
        >
          {isAddingToCart ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Ajout en cours...
            </>
          ) : !isAvailable ? (
            'Indisponible'
          ) : (
            'Ajouter au panier'
          )}
        </Button>

        <Button
          variant="outline"
          onClick={handleToggleWishlist}
          className="px-6 border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-700 hover:text-red-600"
        >
          <Heart 
            className={`h-4 w-4 mr-2 transition-colors duration-200 ${
              isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`} 
          />
          {isInWishlist ? 'Retiré' : 'Wishlist'}
        </Button>

        <Button
          variant="outline"
          onClick={handleShare}
          disabled={isSharing}
          className="px-6 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700 hover:text-blue-600"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Partager
        </Button>
      </div>

      {/* Informations de livraison */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Livraison</p>
              <p className="text-sm text-muted-foreground">À partir de 50 000 FCFA • 2-3 jours ouvrés</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Retour facile</p>
              <p className="text-sm text-muted-foreground">30 jours pour changer d'avis</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <RotateCcw className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Échange gratuit</p>
              <p className="text-sm text-muted-foreground">Sous 15 jours</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground leading-relaxed">
            {showFullDescription ? (
              <div dangerouslySetInnerHTML={{ __html: product.description || product.shortDescription || 'Description non disponible.' }} />
            ) : (
              <p className="line-clamp-3">
                {product.shortDescription || product.description || 'Description non disponible.'}
              </p>
            )}
            
            {(product.shortDescription && product.description && product.description !== product.shortDescription) && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-primary hover:text-primary/80 font-medium text-sm mt-2 transition-colors duration-200"
              >
                {showFullDescription ? 'Voir moins' : 'Lire la suite'}
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Avertissement de stock bas */}
      {isLowStock && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-amber-600" />
            <p className="text-sm text-amber-800">
              <strong>Stock limité!</strong> Plus que {selectedVariant.stock} exemplaires disponibles.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}