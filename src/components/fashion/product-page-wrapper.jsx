"use client"

import { useProduct } from '@/hooks/use-api'
import { ProductDetailPage } from './product-detail-page'
import { notFound } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export function ProductPageWrapper({ slug }) {
  const { product, isLoading, isError } = useProduct(slug)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    )
  }

  if (isError || !product) {
    notFound()
  }

  return <ProductDetailPage product={product} />
}
