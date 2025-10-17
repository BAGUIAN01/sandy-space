"use client"

import { ProductCard } from './product-card'
import { Button } from '@/components/ui/button'
import { useSimilarProducts } from '@/hooks/use-api'
import { 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react'

export function RelatedProducts({ 
  productId, 
  categorySlug, 
  limit = 4, 
  title = "Produits similaires",
  className = ""
}) {
  const { products: relatedProducts, isLoading: loading, isError: error } = useSimilarProducts(productId, limit)

  if (loading) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-900 to-gray-600 mx-auto rounded"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Ne pas afficher la section s'il y a une erreur ou pas de produits similaires
  if (error) {
    console.warn('RelatedProducts: API error, hiding section:', error)
    return null
  }
  
  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-6 w-6 text-gray-600" />
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-gray-900 to-gray-600 mx-auto rounded"></div>
        </div>

        {/* Grille des produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode="grid"
              showQuickActions={true}
            />
          ))}
        </div>

        {/* Bouton voir plus */}
        {categorySlug && (
          <div className="text-center mt-12">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-gray-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-200"
            >
              <a href={`/products/category/${categorySlug}`}>
                Voir tous les produits de cette catégorie
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}