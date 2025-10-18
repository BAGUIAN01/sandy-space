"use client"

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RobesFilters } from './robes-filters'
import { PriceBadge, PriceDisplay } from '@/components/ui/price-badge'
import { formatPriceWithIndicators, formatPriceShort } from '@/lib/price-utils'
import { useCartActions } from '@/stores/cart-store'
import { 
  Heart, 
  ShoppingCart, 
  Eye, 
  Star, 
  Filter, 
  SortAsc, 
  Grid,
  List,
  ChevronDown,
  X,
  Crown,
  Sparkles,
  Zap
} from 'lucide-react'

export function RobesPage({ products = [] }) {
  const robes = products
  const [selectedCategory, setSelectedCategory] = useState("Toutes")
  const [sortBy, setSortBy] = useState("popular")
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  console.log("robes", robes)
  
  // Store de panier et wishlist
  const { addToCartWithNotification, toggleWishlistWithNotification, wishlistStore } = useCartActions()
  
  // Filtres avancés
  const [filters, setFilters] = useState({
    priceRange: null,
    sizes: [],
    colors: [],
    brands: []
  })

  // Catégories de robes
  const categories = [
    { slug: "toutes", name: "Toutes" },
    { slug: "robes-soiree", name: "Soirée" },
    { slug: "robes-ete", name: "Été" },
    { slug: "robes-business", name: "Business" },
    { slug: "robes-cocktail", name: "Cocktail" },
    { slug: "robes-decontractees", name: "Décontracté" },
    { slug: "robes-mariee", name: "Mariage" }
  ]

  const sortOptions = [
    { value: "popular", label: "Populaire" },
    { value: "price-low", label: "Prix croissant" },
    { value: "price-high", label: "Prix décroissant" },
    { value: "newest", label: "Plus récent" },
    { value: "rating", label: "Mieux noté" }
  ]

  // Logique de filtrage et tri
  const filteredAndSortedRobes = useMemo(() => {
    let filtered = [...robes]

    // Filtrage par catégorie
    if (selectedCategory !== "Toutes") {
      const categorySlug = categories.find(cat => cat.name === selectedCategory)?.slug
      filtered = filtered.filter(robe => 
        robe.categorySlug === categorySlug || 
        robe.category?.slug === categorySlug
      )
    }

    // Filtrage par prix
    if (filters.priceRange) {
      filtered = filtered.filter(robe => {
        const price = parseFloat(robe.price || robe.basePrice || 0)
        return price >= filters.priceRange.min && 
               (filters.priceRange.max === Infinity || price <= filters.priceRange.max)
      })
    }

    // Filtrage par taille
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(robe => 
        filters.sizes.some(size => 
          robe.size?.includes(size) || 
          robe.sizes?.includes(size)
        )
      )
    }

    // Filtrage par couleur
    if (filters.colors.length > 0) {
      filtered = filtered.filter(robe => 
        filters.colors.some(color => 
          robe.colors?.some(robeColor => 
            robeColor.toLowerCase().includes(color.toLowerCase())
          )
        )
      )
    }

    // Filtrage par marque
    if (filters.brands.length > 0) {
      filtered = filtered.filter(robe => 
        filters.brands.includes(robe.brand?.name || robe.brand)
      )
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (parseFloat(a.price || a.basePrice || 0)) - (parseFloat(b.price || b.basePrice || 0))
        case "price-high":
          return (parseFloat(b.price || b.basePrice || 0)) - (parseFloat(a.price || a.basePrice || 0))
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        case "rating":
          return (b.avgRating || b.rating || 0) - (a.avgRating || a.rating || 0)
        case "popular":
        default:
          return (b.salesCount || b.viewCount || 0) - (a.salesCount || a.viewCount || 0)
      }
    })

    return filtered
  }, [robes, selectedCategory, filters, sortBy, categories])

  // Fonctions de gestion des filtres
  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName)
    setCurrentPage(1)
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSelectedCategory("Toutes")
    setFilters({
      priceRange: null,
      sizes: [],
      colors: [],
      brands: []
    })
    setCurrentPage(1)
  }

  // Les produits sont maintenant fournis via props depuis SWR

  const toggleWishlist = async (robe) => {
    try {
      toggleWishlistWithNotification(robe)
    } catch (error) {
      console.error('Error updating wishlist:', error)
    }
  }

  const addToCart = async (robe) => {
    try {
      addToCartWithNotification(robe)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  // Les produits sont maintenant fournis via props depuis SWR
  // Le loading et les erreurs sont gérés par le wrapper parent

  return (
    <div className="py-24 px-4 bg-white">
      <div className="container mx-auto max-w-8xl">
        {/* En-tête de section - Design élégant */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 rounded-full border border-amber-200 mb-6">
            <Crown className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-700 tracking-wide">Collection Premium</span>
          </div>
          
          <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
            Collection Robes
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mb-8"></div>
          
          <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
            Découvrez notre sélection exclusive de robes qui incarnent l'élégance et le raffinement. 
            Chaque pièce est soigneusement choisie pour vous offrir un style unique et intemporel.
          </p>
        </div>

        {/* Filtres et contrôles */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Panneau de filtres sticky */}
          <div className="lg:w-80 lg:sticky lg:top-4 lg:self-start">
            <RobesFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              isOpen={showFilters}
              onToggle={() => setShowFilters(!showFilters)}
            />
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            {/* Contrôles de tri et vue */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              {/* Résultats */}
              <div className="text-sm text-gray-600">
                {filteredAndSortedRobes.length} robe{filteredAndSortedRobes.length > 1 ? 's' : ''} trouvée{filteredAndSortedRobes.length > 1 ? 's' : ''}
              </div>

              <div className="flex items-center gap-4">
                {/* Tri */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 font-medium">Trier par</span>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="bg-transparent border border-gray-200 rounded-md px-3 py-1 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mode d'affichage */}
                <div className="flex border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-all duration-200 ${
                      viewMode === "grid" ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-all duration-200 ${
                      viewMode === "list" ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>


            {/* Grille des robes optimisée - 3 par ligne */}
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {filteredAndSortedRobes.map((robe) => (
            <div key={robe.id} className="group">
              {/* Card Container */}
              <div className="relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 ease-out group-hover:-translate-y-2">
                {/* Image du produit */}
                <div className="relative overflow-hidden bg-gray-50 rounded-t-2xl">
                  <Link href={`/products/${robe.slug}`}>
                    <div className="aspect-[4/5] relative bg-white rounded-t-2xl overflow-hidden">
                      <Image
                        src={robe.ProductImages[0].url || '/images/robes/cmgv89opa0028ztywhjo2g2pl.png'}
                        alt={robe.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out bg-white"
                        onError={(e) => {
                          e.target.src = '/images/robes/cmgv89opa0028ztywhjo2g2pl.png'
                        }}
                      />
                      {/* Overlay subtil au hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />
                    </div>
                  </Link>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {robe.isNew && (
                      <div className="bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 text-xs font-medium tracking-wide uppercase rounded-full shadow-sm">
                        <div className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Nouveau
                        </div>
                      </div>
                    )}
                    {robe.isSale && (
                      <div className="bg-red-500/95 backdrop-blur-sm text-white px-3 py-1.5 text-xs font-medium tracking-wide uppercase rounded-full shadow-sm">
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          -{Math.round((1 - robe.price / robe.originalPrice) * 100)}%
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions rapides */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 shadow-sm cursor-pointer"
                      onClick={() => toggleWishlist(robe)}
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          wishlistStore.isInWishlist(robe.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                        }`} 
                      />
                    </button>
                    <button className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 shadow-sm cursor-pointer">
                      <Eye className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Informations du produit optimisées */}
                <div className="p-4">
                  {/* Note et avis */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(robe.rating || 4.5) 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 font-medium tracking-wide">
                      {robe.reviews || 0} avis
                    </span>
                  </div>

                  {/* Nom du produit */}
                  <h3 className="text-base font-medium text-gray-900 mb-2 tracking-wide group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
                    {robe.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-500 mb-3 font-light leading-relaxed line-clamp-2">
                    {robe.description}
                  </p>

                  {/* Prix amélioré */}
                  <div className="mb-3">
                    <PriceDisplay
                      price={robe.price || robe.basePrice}
                      originalPrice={robe.originalPrice || robe.compareAtPrice}
                      size="lg"
                      showSavings={true}
                      showShortFormat={true}
                    />
                  </div>

                  {/* Couleurs et action compactes */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {robe.colors?.slice(0, 3).map((color, index) => (
                        <div
                          key={index}
                          className="w-3 h-3 rounded-full border border-gray-200 shadow-sm"
                          style={{
                            backgroundColor: color === "Noir" ? "#000" : 
                                           color === "Rouge" ? "#dc2626" :
                                           color === "Bleu" ? "#2563eb" :
                                           color === "Rose" ? "#ec4899" :
                                           color === "Blanc" ? "#fff" :
                                           color === "Jaune" ? "#eab308" :
                                           color === "Gris" ? "#6b7280" :
                                           color === "Marine" ? "#1e3a8a" :
                                           color === "Or" ? "#f59e0b" :
                                           color === "Beige" ? "#f5f5dc" :
                                           color === "Ivoire" ? "#fefce8" : "#gray"
                          }}
                        />
                      ))}
                      {robe.colors?.length > 3 && (
                        <span className="text-[10px] text-gray-400 font-medium">+{robe.colors.length - 3}</span>
                      )}
                    </div>

                    {/* Bouton d'ajout compact */}
                    <button
                      onClick={() => addToCart(robe)}
                      className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-1.5 text-xs font-medium tracking-wide uppercase hover:from-gray-800 hover:to-gray-700 transition-all duration-200 rounded-full shadow-sm hover:shadow-md cursor-pointer"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
              </div>
            ))}
          </div>

          {/* Message si aucun résultat */}
          {filteredAndSortedRobes.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-light text-gray-900 mb-4">
              Aucune robe trouvée
            </h3>
            <p className="text-gray-600 mb-8">
              Essayez de modifier vos filtres ou de parcourir une autre catégorie.
            </p>
            <Button 
              onClick={() => {
                setSelectedCategory("Toutes")
                setSortBy("popular")
                setCurrentPage(1)
              }}
            >
              Voir toutes les robes
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Précédent
              </Button>
              
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  )
}
