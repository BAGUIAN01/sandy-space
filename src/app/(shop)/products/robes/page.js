import { Suspense } from 'react'
import { Metadata } from 'next'
import { RobesPageWrapper } from '@/components/fashion/robes-page-wrapper'
import { Breadcrumb } from '@/components/layout/breadcrumb'

export const metadata = {
  title: 'Collection Robes - Sandy Space',
  description: 'Découvrez notre collection exclusive de robes élégantes pour toutes les occasions. Robes de soirée, robes d\'été, robes business et plus encore.',
  keywords: 'robes, mode, élégance, soirée, été, business, cocktail, mariée',
  openGraph: {
    title: 'Collection Robes - Sandy Space',
    description: 'Découvrez notre collection exclusive de robes élégantes',
    images: ['/images/og/robes-collection.jpg'],
  },
}

const breadcrumbItems = [
  { label: 'Accueil', href: '/' },
  { label: 'Robes', href: '/products/robes' }
]

export default function RobesCollectionPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Page principale */}
      <Suspense fallback={
        <div className="py-24 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded mb-8 w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded mb-12 w-2/3"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-2xl h-96"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }>
        <RobesPageWrapper />
      </Suspense>
    </div>
  )
}
