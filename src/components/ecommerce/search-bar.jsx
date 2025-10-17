"use client"

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Heart, Search, Filter, SortAsc, ShoppingCart } from 'lucide-react'

export function SearchBar({ 
  onSearch,
  placeholder = "Rechercher des produits...",
  className 
}) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className={cn('search-bar', className)}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
    </form>
  )
}

export function WishlistButton({ 
  isInWishlist = false,
  onToggle,
  className 
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className={cn(
        'transition-colors',
        isInWishlist 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500',
        className
      )}
    >
      <Heart 
        className={cn(
          'h-5 w-5 transition-all',
          isInWishlist && 'fill-current'
        )} 
      />
    </Button>
  )
}

export function CartButton({ 
  itemCount = 0,
  onClick,
  className 
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn(
        'relative transition-colors text-gray-400 hover:text-gray-600',
        className
      )}
      aria-label={`Panier (${itemCount} articles)`}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Button>
  )
}

export function CompareButton({ 
  isInCompare = false,
  onToggle,
  className 
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className={cn(
        'transition-colors',
        isInCompare 
          ? 'text-blue-500 hover:text-blue-600' 
          : 'text-gray-400 hover:text-blue-500',
        className
      )}
    >
      <Filter className="h-5 w-5" />
    </Button>
  )
}

export function ProductFilters({ 
  filters = {},
  onFilterChange,
  className 
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (filterType, value) => {
    onFilterChange({
      ...filters,
      [filterType]: value
    })
  }

  const clearFilters = () => {
    onFilterChange({})
  }

  return (
    <div className={cn('product-filters', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filtres</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-sm"
        >
          Effacer tout
        </Button>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Prix</h4>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Catégories</h4>
        <div className="space-y-2">
          {['Femme', 'Homme', 'Enfant', 'Accessoires'].map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.categories?.includes(category) || false}
                onChange={(e) => {
                  const categories = filters.categories || []
                  if (e.target.checked) {
                    handleFilterChange('categories', [...categories, category])
                  } else {
                    handleFilterChange('categories', categories.filter(c => c !== category))
                  }
                }}
                className="mr-2"
              />
              <span className="text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Couleurs</h4>
        <div className="flex flex-wrap gap-2">
          {['Noir', 'Blanc', 'Rouge', 'Bleu', 'Vert', 'Rose'].map((color) => (
            <button
              key={color}
              onClick={() => {
                const colors = filters.colors || []
                if (colors.includes(color)) {
                  handleFilterChange('colors', colors.filter(c => c !== color))
                } else {
                  handleFilterChange('colors', [...colors, color])
                }
              }}
              className={cn(
                'px-3 py-1 text-xs rounded-full border transition-colors',
                filters.colors?.includes(color)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              )}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Tailles</h4>
        <div className="flex flex-wrap gap-2">
          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <button
              key={size}
              onClick={() => {
                const sizes = filters.sizes || []
                if (sizes.includes(size)) {
                  handleFilterChange('sizes', sizes.filter(s => s !== size))
                } else {
                  handleFilterChange('sizes', [...sizes, size])
                }
              }}
              className={cn(
                'w-8 h-8 text-xs rounded border transition-colors',
                filters.sizes?.includes(size)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SortDropdown({ 
  sortBy,
  onSortChange,
  className 
}) {
  const sortOptions = [
    { value: 'newest', label: 'Plus récent' },
    { value: 'oldest', label: 'Plus ancien' },
    { value: 'price-low', label: 'Prix croissant' },
    { value: 'price-high', label: 'Prix décroissant' },
    { value: 'name', label: 'Nom A-Z' },
    { value: 'popular', label: 'Plus populaire' }
  ]

  return (
    <div className={cn('sort-dropdown', className)}>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
