"use client"

import { useState, useEffect } from 'react'
import { ProductGallery } from './product-gallery'
import { ProductInfo } from './product-info'
import { ProductVariants } from './product-variants'
import { RelatedProducts } from './related-products'
import { useCartActions } from '@/stores/cart-store'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { 
  ChevronRight,
  Home,
  Package,
  Tag
} from 'lucide-react'

export function ProductDetailPage({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  
  const { addToCartWithNotification, toggleWishlistWithNotification, wishlistStore } = useCartActions()

  // Initialiser la variante sélectionnée si le produit a des variantes
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      // Sélectionner la première variante disponible
      const firstAvailableVariant = product.variants.find(v => v.stock > 0) || product.variants[0]
      setSelectedVariant(firstAvailableVariant)
    }
  }, [product.variants])

  // Gestion de l'ajout au panier
  const handleAddToCart = async (product, variant = null) => {
    setIsLoading(true)
    try {
      addToCartWithNotification(product, variant, 1)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Gestion de la wishlist
  const handleToggleWishlist = (productId) => {
    toggleWishlistWithNotification(product, selectedVariant)
  }

  // Vérifier si le produit est dans la wishlist
  const isInWishlist = wishlistStore.isInWishlist(product.id, selectedVariant?.id)

  // Debug des données du produit
  console.log('ProductDetailPage - product:', product)
  console.log('ProductDetailPage - product.images:', product.images)

  // Breadcrumbs simplifiés
  const breadcrumbs = [
    { label: 'Accueil', href: '/', icon: Home },
    ...(product.category ? [
      { label: product.category.name, href: `/products/robes`, icon: Tag }
    ] : []),
    { label: product.name, href: null }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galerie d'images */}
          <div className="space-y-4">
            <ProductGallery 
              images={product.images}
              showThumbnails={true}
              showZoom={true}
              showFullscreen={true}
              onImageChange={setCurrentImageIndex}
            />
          </div>

          {/* Informations produit */}
          <div className="space-y-6">
            <ProductInfo 
              product={product}
              selectedVariant={selectedVariant}
              onVariantChange={setSelectedVariant}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isInWishlist={isInWishlist}
            />

            {/* Sélecteurs de variantes */}
            {product.variants && product.variants.length > 0 && (
              <ProductVariants 
                product={product}
                variants={product.variants}
                selectedVariant={selectedVariant}
                onVariantChange={setSelectedVariant}
              />
            )}
          </div>
        </div>

        {/* Section détails supplémentaires */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description étendue */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description détaillée</h2>
              
              <div className="prose prose-gray max-w-none">
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>

              {/* Caractéristiques */}
              {(product.weight || product.dimensions) && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Spécifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.weight && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Poids</span>
                        <span className="font-medium text-gray-900">{product.weight}g</span>
                      </div>
                    )}
                    
                    {product.dimensions && (
                      <>
                        {product.dimensions.length && (
                          <div className="flex justify-between py-2">
                            <span className="text-gray-600">Longueur</span>
                            <span className="font-medium text-gray-900">{product.dimensions.length}cm</span>
                          </div>
                        )}
                        {product.dimensions.width && (
                          <div className="flex justify-between py-2">
                            <span className="text-gray-600">Largeur</span>
                            <span className="font-medium text-gray-900">{product.dimensions.width}cm</span>
                          </div>
                        )}
                        {product.dimensions.height && (
                          <div className="flex justify-between py-2">
                            <span className="text-gray-600">Hauteur</span>
                            <span className="font-medium text-gray-900">{product.dimensions.height}cm</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations de livraison */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Livraison & Retours</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Livraison gratuite</p>
                    <p className="text-sm text-gray-600">À partir de 50 000 FCFA</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Retour facile</p>
                    <p className="text-sm text-gray-600">30 jours pour changer d'avis</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Échange gratuit</p>
                    <p className="text-sm text-gray-600">Sous 15 jours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Garanties */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Garanties</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 text-sm">🛡️</span>
                  <span className="text-sm text-gray-700">Garantie qualité 1 an</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 text-sm">🔒</span>
                  <span className="text-sm text-gray-700">Paiement sécurisé</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-600 text-sm">📞</span>
                  <span className="text-sm text-gray-700">Support client 24/7</span>
                </div>
              </div>
            </div>

            {/* Partager */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Partager ce produit</h3>
              
              <div className="flex gap-3">
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium transition-colors border border-gray-200">
                  Facebook
                </button>
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium transition-colors border border-gray-200">
                  Twitter
                </button>
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium transition-colors border border-gray-200">
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        <RelatedProducts 
          productId={product.id}
          categorySlug={product.category?.slug}
          limit={4}
          title="Vous pourriez aussi aimer"
          className="mt-16"
        />
      </div>
    </div>
  )
}