"use client"

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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
  X
} from 'lucide-react'

// Données des robes (simulées pour l'instant)
const robesData = [
  {
    id: 1,
    name: "Robe Élégante Noire",
    price: 89.99,
    originalPrice: 120.00,
    image: "/images/robes/image142-1_1-png202504140235061.png",
    category: "Soirée",
    size: ["S", "M", "L", "XL"],
    colors: ["Noir", "Rouge", "Bleu"],
    rating: 4.8,
    reviews: 24,
    isNew: true,
    isSale: false,
    description: "Robe élégante parfaite pour les occasions spéciales"
  },
  {
    id: 2,
    name: "Robe Été Florale",
    price: 65.99,
    originalPrice: 85.00,
    image: "/images/robes/image13-1_2-png202504140234401.png",
    category: "Été",
    size: ["S", "M", "L"],
    colors: ["Rose", "Blanc", "Jaune"],
    rating: 4.6,
    reviews: 18,
    isNew: false,
    isSale: true,
    description: "Robe légère et confortable pour l'été"
  },
  {
    id: 3,
    name: "Robe Business",
    price: 95.99,
    originalPrice: 95.99,
    image: "/images/robes/image120-1_1-png202504140234221.png",
    category: "Business",
    size: ["S", "M", "L", "XL"],
    colors: ["Noir", "Gris", "Marine"],
    rating: 4.7,
    reviews: 31,
    isNew: false,
    isSale: false,
    description: "Robe professionnelle pour le bureau"
  },
  {
    id: 4,
    name: "Robe Cocktail",
    price: 75.99,
    originalPrice: 100.00,
    image: "/images/robes/image118-1_1-png202504140234161.png",
    category: "Cocktail",
    size: ["S", "M", "L"],
    colors: ["Rouge", "Noir", "Or"],
    rating: 4.9,
    reviews: 15,
    isNew: true,
    isSale: true,
    description: "Robe cocktail sophistiquée"
  },
  {
    id: 5,
    name: "Robe Décontractée",
    price: 45.99,
    originalPrice: 45.99,
    image: "/images/robes/image109-1_1-png202504140234021.png",
    category: "Décontracté",
    size: ["S", "M", "L", "XL"],
    colors: ["Blanc", "Beige", "Rose"],
    rating: 4.5,
    reviews: 22,
    isNew: false,
    isSale: false,
    description: "Robe confortable pour tous les jours"
  },
  {
    id: 6,
    name: "Robe de Mariée",
    price: 299.99,
    originalPrice: 399.99,
    image: "/images/robes/image106-1_1-png202504140234181.png",
    category: "Mariage",
    size: ["S", "M", "L"],
    colors: ["Blanc", "Ivoire"],
    rating: 5.0,
    reviews: 8,
    isNew: false,
    isSale: true,
    description: "Robe de mariée romantique et élégante"
  }
]

const categories = ["Toutes", "Soirée", "Été", "Business", "Cocktail", "Décontracté", "Mariage"]
const sortOptions = [
  { value: "popular", label: "Populaire" },
  { value: "price-low", label: "Prix croissant" },
  { value: "price-high", label: "Prix décroissant" },
  { value: "newest", label: "Plus récent" },
  { value: "rating", label: "Mieux noté" }
]

export function RobesSection() {
  const [selectedCategory, setSelectedCategory] = useState("Toutes")
  const [sortBy, setSortBy] = useState("popular")
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [wishlist, setWishlist] = useState([])
  const [cart, setCart] = useState([])

  // Filtrage et tri des robes
  const filteredAndSortedRobes = useMemo(() => {
    let filtered = robesData

    // Filtrage par catégorie
    if (selectedCategory !== "Toutes") {
      filtered = filtered.filter(robe => robe.category === selectedCategory)
    }

    // Tri
    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.price - a.price)
        break
      case "newest":
        filtered = [...filtered].sort((a, b) => b.isNew - a.isNew)
        break
      case "rating":
        filtered = [...filtered].sort((a, b) => b.rating - a.rating)
        break
      default: // popular
        filtered = [...filtered].sort((a, b) => b.reviews - a.reviews)
    }

    return filtered
  }, [selectedCategory, sortBy])

  const toggleWishlist = (robeId) => {
    setWishlist(prev => 
      prev.includes(robeId) 
        ? prev.filter(id => id !== robeId)
        : [...prev, robeId]
    )
  }

  const addToCart = (robe) => {
    setCart(prev => [...prev, { ...robe, quantity: 1 }])
  }

  return (
    <section id="robes-section" className="py-24 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        {/* En-tête de section - Design épuré */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-primary-light text-gray-900 mb-6 tracking-wide">
            Collection Robes
          </h2>
          <div className="w-24 h-px bg-gray-300 mx-auto mb-8"></div>
          <p className="text-lg text-gray-500 font-primary max-w-2xl mx-auto leading-relaxed">
            Découvrez notre sélection de robes élégantes pour toutes les occasions. 
            De la robe de soirée à la robe décontractée, trouvez votre style parfait.
          </p>
        </div>

        {/* Filtres et contrôles */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          {/* Filtres par catégorie - Design épuré */}
          <div className="flex flex-wrap gap-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-primary-medium tracking-wide transition-all duration-300 ${
                  selectedCategory === category 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Contrôles de tri et vue */}
          <div className="flex items-center gap-4">
            {/* Bouton filtres mobile */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>

            {/* Tri - Design épuré */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-primary">Trier par</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-0 text-sm font-primary text-gray-900 focus:outline-none cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode d'affichage - Design épuré */}
            <div className="flex border border-gray-200">
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

        {/* Panneau de filtres mobile */}
        {showFilters && (
          <div className="lg:hidden bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Filtres</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Grille des robes */}
        <div className={`grid gap-8 ${
          viewMode === "grid" 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        }`}>
          {filteredAndSortedRobes.map((robe) => (
            <div key={robe.id} className="group">
              {/* Card Container */}
              <div className="relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 ease-out group-hover:-translate-y-2">
                {/* Image du produit */}
                <div className="relative overflow-hidden bg-gray-50 rounded-t-2xl">
                  <Link href={`/products/robe/${robe.id}`}>
                    <div className="aspect-[3/4] relative rounded-t-2xl overflow-hidden">
                      <Image
                        src={robe.image}
                        alt={robe.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      {/* Overlay subtil au hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />
                    </div>
                  </Link>
                  
                  {/* Badges épurés */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {robe.isNew && (
                      <div className="bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 text-xs font-medium tracking-wide uppercase rounded-full shadow-sm">
                        Nouveau
                      </div>
                    )}
                    {robe.isSale && (
                      <div className="bg-red-500/95 backdrop-blur-sm text-white px-3 py-1.5 text-xs font-medium tracking-wide uppercase rounded-full shadow-sm">
                        -{Math.round((1 - robe.price / robe.originalPrice) * 100)}%
                      </div>
                    )}
                  </div>

                  {/* Actions rapides minimalistes */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 shadow-sm"
                      onClick={() => toggleWishlist(robe.id)}
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          wishlist.includes(robe.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                        }`} 
                      />
                    </button>
                    <button className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 shadow-sm">
                      <Eye className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Informations du produit - Design épuré */}
                <div className="p-6">
                  {/* Note et avis - Discret */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(robe.rating) 
                              ? 'text-gray-400 fill-gray-400' 
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 font-primary tracking-wide">
                      {robe.reviews} avis
                    </span>
                  </div>

                  {/* Nom du produit - Typographie luxueuse */}
                  <h3 className="text-lg font-primary-light text-gray-900 mb-2 tracking-wide group-hover:text-gray-700 transition-colors duration-300">
                    {robe.name}
                  </h3>

                  {/* Description - Discrète */}
                  <p className="text-sm text-gray-500 mb-4 font-primary leading-relaxed line-clamp-2">
                    {robe.description}
                  </p>

                  {/* Prix - Design minimaliste */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-primary-semibold text-gray-900 tracking-wide">
                        {(robe.price * 655).toFixed(0)} FCFA
                      </span>
                      {robe.originalPrice > robe.price && (
                        <span className="text-sm text-gray-400 line-through font-primary">
                          {(robe.originalPrice * 655).toFixed(0)} FCFA
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Couleurs et action - Épuré */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {robe.colors.slice(0, 4).map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border-2 border-gray-200 shadow-sm"
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
                      {robe.colors.length > 4 && (
                        <span className="text-xs text-gray-400 font-primary">+{robe.colors.length - 4}</span>
                      )}
                    </div>

                    {/* Bouton d'ajout minimaliste */}
                    <button
                      onClick={() => addToCart(robe)}
                      className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-2.5 text-xs font-primary-medium tracking-wide uppercase hover:from-gray-800 hover:to-gray-700 transition-all duration-200 rounded-full shadow-sm hover:shadow-md"
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
            <p className="text-gray-500 text-lg">Aucune robe trouvée pour cette catégorie.</p>
          </div>
        )}

        {/* Pagination (à implémenter plus tard) */}
        <div className="flex justify-center mt-12">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Précédent
            </Button>
            <Button variant="default" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">
              Suivant
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
