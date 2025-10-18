'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/fashion/product-card'
import { useCartActions } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart } from 'lucide-react'

export default function TestCartPage() {
  const { addToCartWithNotification, toggleWishlistWithNotification, wishlistStore, cartStore } = useCartActions()
  const [isAddingToCart, setIsAddingToCart] = useState({})
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Charger les produits depuis l'API existante
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        // Utiliser l'API existante ou créer des données de test avec la bonne structure
        const testProducts = [
          {
            id: '1',
            name: 'Robe Décontractée',
            slug: 'robe-decontractee',
            basePrice: 29475, // Prix en FCFA (45 EUR * 655)
            compareAtPrice: 39300, // Prix original en FCFA (60 EUR * 655)
            image: '/images/robes/image13-1_2-png202504140234401.png',
            images: [
              { url: '/images/robes/image13-1_2-png202504140234401.png', alt: 'Robe Décontractée' }
            ],
            brand: { name: 'Sandy Space' },
            category: { name: 'Robes' },
            sku: 'SS-ROBE-001',
            stock: 10,
            description: 'Une robe décontractée et confortable parfaite pour le quotidien.',
            shortDescription: 'Robe décontractée',
            tags: ['robe', 'décontracté', 'confortable'],
            rating: 4.5,
            reviews: 12,
            colors: ['Noir', 'Rouge', 'Bleu']
          },
          {
            id: '2',
            name: 'Robe de Mariée',
            slug: 'robe-mariee',
            basePrice: 98250, // Prix en FCFA (150 EUR * 655)
            compareAtPrice: 131000, // Prix original en FCFA (200 EUR * 655)
            image: '/images/robes/image13-1_2-png202504140234401.png',
            images: [
              { url: '/images/robes/image13-1_2-png202504140234401.png', alt: 'Robe de Mariée' }
            ],
            brand: { name: 'Sandy Space' },
            category: { name: 'Robes' },
            sku: 'SS-ROBE-002',
            stock: 3,
            description: 'Robe de mariée élégante et raffinée pour votre grand jour.',
            shortDescription: 'Robe de mariée',
            tags: ['robe', 'mariée', 'élégant', 'cérémonie'],
            rating: 4.8,
            reviews: 8,
            colors: ['Blanc', 'Ivoire', 'Beige']
          },
          {
            id: '3',
            name: 'Sac à Main Cuir',
            slug: 'sac-main-cuir',
            basePrice: 22925, // Prix en FCFA (35 EUR * 655)
            compareAtPrice: 29475, // Prix original en FCFA (45 EUR * 655)
            image: '/images/sac-a-main/image1-1_2-png202504140247341.png',
            images: [
              { url: '/images/sac-a-main/image1-1_2-png202504140247341.png', alt: 'Sac à Main Cuir' }
            ],
            brand: { name: 'Sandy Space' },
            category: { name: 'Sacs' },
            sku: 'SS-SAC-001',
            stock: 5,
            description: 'Sac à main en cuir véritable, spacieux et élégant.',
            shortDescription: 'Sac à main cuir',
            tags: ['sac', 'cuir', 'élégant'],
            rating: 4.2,
            reviews: 15,
            colors: ['Marron', 'Noir', 'Rouge']
          }
        ]
        
        setProducts(testProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = async (product) => {
    setIsAddingToCart(prev => ({ ...prev, [product.id]: true }))
    try {
      addToCartWithNotification(product)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setTimeout(() => {
        setIsAddingToCart(prev => ({ ...prev, [product.id]: false }))
      }, 1500)
    }
  }

  const handleToggleWishlist = (product) => {
    toggleWishlistWithNotification(product)
  }

  const isInWishlist = (product) => {
    return wishlistStore.isInWishlist(product.id)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des produits...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Test du Panier avec Vraies Données
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Testez les fonctionnalités du panier avec des produits structurés
          </p>
          
          {/* Stats du panier */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                <span className="font-semibold">Panier:</span>
                <span className="text-green-600 font-bold">{cartStore.getTotalItems()} articles</span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span className="font-semibold">Wishlist:</span>
                <span className="text-red-500 font-bold">{wishlistStore.items.length} articles</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grille de produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                isInWishlist={isInWishlist(product)}
                isAddingToCart={isAddingToCart[product.id] || false}
              />
            </div>
          ))}
        </div>

        {/* Debug info */}
        <div className="mt-12 bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-2xl font-bold mb-4">Debug - Structure des données</h2>
          <div className="space-y-3 text-sm">
            <p><strong>Produits chargés:</strong> {products.length}</p>
            <p><strong>Articles dans le panier:</strong> {cartStore.items.length}</p>
            {cartStore.items.length > 0 && (
              <div>
                <p><strong>Détails du panier:</strong></p>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(cartStore.items, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
