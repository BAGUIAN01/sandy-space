"use client"

import { useRobesProducts } from '@/hooks/use-api'
import { RobesPage } from './robes-page'
import { Loader2 } from 'lucide-react'

export function RobesPageWrapper() {
  const { products, isLoading, isError } = useRobesProducts({ limit: 20 })

  console.log("products", products)
  // Log détaillé des produits
  console.log("🔍 RobesPageWrapper - Products:", products)
  if (products && products.length > 0) {
    products.forEach((product, index) => {
      if (product.name.toLowerCase().includes('soirée') && product.name.toLowerCase().includes('noire')) {
        console.log(`🖤 Robe soirée noire trouvée:`, {
          name: product.name,
          id: product.id,
          image: product.image,
          extension: product.image?.split('.').pop()
        })
      }
    })
  }

  if (isLoading) {
    return (
      <div className="py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600" />
            <p className="text-gray-600">Chargement de la collection...</p>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-red-600">Erreur lors du chargement de la collection</p>
          </div>
        </div>
      </div>
    )
  }

  return <RobesPage products={products} />
}
