import { ProductGrid } from '@/components/fashion/product-card'
import { SearchBar, ProductFilters, SortDropdown } from '@/components/ecommerce/search-bar'
import { productService } from '@/services/product-service'

export default async function ProductsPage({ searchParams }) {
  const filters = {
    category: searchParams.category,
    brand: searchParams.brand,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    colors: searchParams.colors?.split(','),
    sizes: searchParams.sizes?.split(','),
    sort: searchParams.sort || 'newest',
    page: searchParams.page || 1,
    limit: searchParams.limit || 12
  }

  const { products, pagination } = await productService.getProducts(filters)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Nos Produits</h1>
        <SearchBar 
          onSearch={(query) => {
            // Redirection vers la page de recherche
            window.location.href = `/search?q=${encodeURIComponent(query)}`
          }}
        />
      </div>

      <div className="flex gap-8">
        {/* Sidebar avec filtres */}
        <aside className="w-64 flex-shrink-0">
          <ProductFilters 
            filters={filters}
            onFilterChange={(newFilters) => {
              // Mise à jour des paramètres URL
              const params = new URLSearchParams(newFilters)
              window.location.href = `/products?${params.toString()}`
            }}
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
              onSortChange={(sort) => {
                const params = new URLSearchParams(searchParams)
                params.set('sort', sort)
                window.location.href = `/products?${params.toString()}`
              }}
            />
          </div>

          {/* Grille de produits */}
          <ProductGrid 
            products={products}
            columns={4}
            onAddToCart={(product) => {
              // Logique d'ajout au panier
              console.log('Ajouter au panier:', product)
            }}
            onAddToWishlist={(product) => {
              // Logique d'ajout à la wishlist
              console.log('Ajouter à la wishlist:', product)
            }}
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
