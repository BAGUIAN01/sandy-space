'use client'

import { useState } from 'react'
import { ProductCard } from '@/components/fashion/product-card'
import { useCartActions } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart } from 'lucide-react'

// Produits de test avec prix en EUR (seront convertis en FCFA automatiquement)
const testProducts = [
  {
    id: '1',
    name: 'Robe Décontractée',
    slug: 'robe-decontractee',
    basePrice: 45, // Prix en EUR
    compareAtPrice: 60, // Prix original en EUR
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
    tags: ['robe', 'décontracté', 'confortable']
  },
  {
    id: '2',
    name: 'Robe de Mariée',
    slug: 'robe-mariee',
    basePrice: 150, // Prix en EUR
    compareAtPrice: 200, // Prix original en EUR
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
    tags: ['robe', 'mariée', 'élégant', 'cérémonie']
  },
  {
    id: '3',
    name: 'Sac à Main Cuir',
    slug: 'sac-main-cuir',
    basePrice: 35, // Prix en EUR
    compareAtPrice: 45, // Prix original en EUR
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
    tags: ['sac', 'cuir', 'élégant']
  }
]

export default function TestCartPage() {
  const { addToCartWithNotification, toggleWishlistWithNotification, wishlistStore, cartStore } = useCartActions()
  const [isAddingToCart, setIsAddingToCart] = useState({})

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Test du Panier Sandy Space
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Testez les fonctionnalités du panier avec ces produits
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
          {testProducts.map((product) => (
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

        {/* Instructions */}
        <div className="mt-12 bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-2xl font-bold mb-4">Instructions de test</h2>
          <div className="space-y-3 text-gray-600">
            <p>• <strong>Ajouter au panier:</strong> Cliquez sur le bouton "Ajouter au panier" sur chaque produit</p>
            <p>• <strong>Notifications:</strong> Des notifications apparaîtront en haut à droite</p>
            <p>• <strong>Panier:</strong> Le compteur dans le header se mettra à jour automatiquement</p>
            <p>• <strong>Ouvrir le panier:</strong> Cliquez sur l'icône panier dans le header</p>
            <p>• <strong>Wishlist:</strong> Cliquez sur l'icône cœur pour ajouter aux favoris</p>
            <p>• <strong>Persistance:</strong> Les données sont sauvegardées dans le localStorage</p>
          </div>
        </div>
      </div>
    </div>
  )
}
