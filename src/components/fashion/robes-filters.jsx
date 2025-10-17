"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp,
  SlidersHorizontal,
  Tag,
  Palette,
  Ruler
} from 'lucide-react'

export function RobesFilters({ 
  categories = [],
  selectedCategory,
  onCategoryChange,
  filters,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onToggle
}) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: false,
    size: false,
    color: false,
    brand: false
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const priceRanges = [
    { label: "Moins de 32K FCFA", min: 0, max: 50, display: "Moins de 32K FCFA" },
    { label: "32K - 65K FCFA", min: 50, max: 100, display: "32K - 65K FCFA" },
    { label: "65K - 131K FCFA", min: 100, max: 200, display: "65K - 131K FCFA" },
    { label: "Plus de 131K FCFA", min: 200, max: Infinity, display: "Plus de 131K FCFA" }
  ]

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const colors = [
    { name: "Noir", value: "noir", color: "#000000" },
    { name: "Blanc", value: "blanc", color: "#FFFFFF" },
    { name: "Rouge", value: "rouge", color: "#DC2626" },
    { name: "Bleu", value: "bleu", color: "#2563EB" },
    { name: "Rose", value: "rose", color: "#EC4899" },
    { name: "Vert", value: "vert", color: "#16A34A" },
    { name: "Jaune", value: "jaune", color: "#EAB308" },
    { name: "Violet", value: "violet", color: "#9333EA" }
  ]

  const brands = [
    "Élégance",
    "Summer Vibes", 
    "Chic Collection",
    "Fashion Forward",
    "Style & Co"
  ]

  const activeFiltersCount = [
    selectedCategory !== "Toutes" ? 1 : 0,
    filters.priceRange ? 1 : 0,
    filters.sizes?.length || 0,
    filters.colors?.length || 0,
    filters.brands?.length || 0
  ].reduce((sum, count) => sum + count, 0)

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${isOpen ? 'block' : 'hidden lg:block'} lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto`}>
      {/* En-tête des filtres */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filtres</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Effacer tout
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Filtres par catégorie */}
        <div>
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-900">Catégorie</span>
            </div>
            {expandedSections.category ? 
              <ChevronUp className="h-4 w-4 text-gray-400" /> : 
              <ChevronDown className="h-4 w-4 text-gray-400" />
            }
          </button>
          
          {expandedSections.category && (
            <div className="mt-3 space-y-2">
              {categories.map((category) => (
                <label key={category.slug} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={category.name}
                    checked={selectedCategory === category.name}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-500"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Filtres par prix */}
        <div>
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">Prix</span>
            </div>
            {expandedSections.price ? 
              <ChevronUp className="h-4 w-4 text-gray-400" /> : 
              <ChevronDown className="h-4 w-4 text-gray-400" />
            }
          </button>
          
          {expandedSections.price && (
            <div className="mt-3 space-y-2">
              {priceRanges.map((range, index) => (
                <label key={index} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange?.min === range.min && filters.priceRange?.max === range.max}
                    onChange={() => onFiltersChange({ ...filters, priceRange: range })}
                    className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-500"
                  />
                  <span className="text-sm text-gray-700">{range.display}</span>
                </label>
              ))}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="priceRange"
                  checked={!filters.priceRange}
                  onChange={() => onFiltersChange({ ...filters, priceRange: null })}
                  className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-500"
                />
                <span className="text-sm text-gray-700">Tous les prix</span>
              </label>
            </div>
          )}
        </div>

        {/* Filtres par taille */}
        <div>
          <button
            onClick={() => toggleSection('size')}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-900">Taille</span>
            </div>
            {expandedSections.size ? 
              <ChevronUp className="h-4 w-4 text-gray-400" /> : 
              <ChevronDown className="h-4 w-4 text-gray-400" />
            }
          </button>
          
          {expandedSections.size && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      const newSizes = filters.sizes?.includes(size)
                        ? filters.sizes.filter(s => s !== size)
                        : [...(filters.sizes || []), size]
                      onFiltersChange({ ...filters, sizes: newSizes })
                    }}
                    className={`px-3 py-1 text-sm border rounded-full transition-all duration-200 ${
                      filters.sizes?.includes(size)
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filtres par couleur */}
        <div>
          <button
            onClick={() => toggleSection('color')}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-900">Couleur</span>
            </div>
            {expandedSections.color ? 
              <ChevronUp className="h-4 w-4 text-gray-400" /> : 
              <ChevronDown className="h-4 w-4 text-gray-400" />
            }
          </button>
          
          {expandedSections.color && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => {
                      const newColors = filters.colors?.includes(color.value)
                        ? filters.colors.filter(c => c !== color.value)
                        : [...(filters.colors || []), color.value]
                      onFiltersChange({ ...filters, colors: newColors })
                    }}
                    className={`relative w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      filters.colors?.includes(color.value)
                        ? 'border-gray-900 ring-2 ring-gray-300'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.color }}
                    title={color.name}
                  >
                    {filters.colors?.includes(color.value) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filtres par marque */}
        <div>
          <button
            onClick={() => toggleSection('brand')}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">Marque</span>
            </div>
            {expandedSections.brand ? 
              <ChevronUp className="h-4 w-4 text-gray-400" /> : 
              <ChevronDown className="h-4 w-4 text-gray-400" />
            }
          </button>
          
          {expandedSections.brand && (
            <div className="mt-3 space-y-2">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.brands?.includes(brand) || false}
                    onChange={(e) => {
                      const newBrands = e.target.checked
                        ? [...(filters.brands || []), brand]
                        : (filters.brands || []).filter(b => b !== brand)
                      onFiltersChange({ ...filters, brands: newBrands })
                    }}
                    className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-500 rounded"
                  />
                  <span className="text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
