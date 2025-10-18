'use client'

import { ProductGrid } from '@/components/fashion/product-card'
import { SearchBar, ProductFilters, SortDropdown } from '@/components/ecommerce/search-bar'
import { useCartActions } from '@/stores/cart-store'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function ProductsPageWrapper({ initialProducts, initialPagination, initialFilters }) {
  const [products, setProducts] = useState(initialProducts)
  const [pagination, setPagination] = useState(initialPagination)
  const [filters, setFilters] = useState(initialFilters)
  const [isLoading, setIsLoading] = useState(false)
  
  const { addToCartWithNotification, toggleWishlistWithNotification, wishlistStore } = useCartActions()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Fonction pour ajouter au panier
  const handleAddToCart = (product) => {
    addToCartWithNotification(product)
  }

  // Fonction pour toggle wishlist
  const handleToggleWishlist = (product) => {
    toggleWishlistWithNotification(product)
  }

  // Fonction pour vérifier si un produit est dans la wishlist
  const isInWishlist = (product) => {
    return wishlistStore.isInWishlist(product.id)
  }

  // Fonction pour changer les filtres
  const handleFilterChange = async (newFilters) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            params.set(key, value.join(','))
          } else {
            params.set(key, value)
          }
        }
      })
      
      router.push(`/products?${params.toString()}`)
    } catch (error) {
      console.error('Error updating filters:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction pour changer le tri
  const handleSortChange = async (sort) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams(searchParams.toString())
      params.set('sort', sort)
      router.push(`/products?${params.toString()}`)
    } catch (error) {
      console.error('Error updating sort:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction pour la recherche
  const handleSearch = (query) => {
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Nos Produits</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="flex gap-8">
        {/* Sidebar avec filtres */}
        <aside className="w-64 flex-shrink-0">
          <ProductFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </aside>

        {/* Contenu principal */}
        <main className="flex-1">
          {/* Barre de tri */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-600">
              {pagination.total} produits trouvés
            </p>
            <SortDropdown 
              sortBy={filters.sort}
              onSortChange={handleSortChange}
            />
          </div>

          {/* Grille de produits */}
          <ProductGrid 
            products={products}
            columns={4}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleToggleWishlist}
            isInWishlist={isInWishlist}
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <a
                    key={page}
                    href={`/products?page=${page}`}
                    className={`px-3 py-2 rounded-md text-sm ${
                      page === pagination.page
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
