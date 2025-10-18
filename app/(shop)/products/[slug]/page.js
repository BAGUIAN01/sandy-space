import { notFound } from 'next/navigation'
import { ProductPageWrapper } from '@/components/fashion/product-page-wrapper'

export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/products/${resolvedParams.slug}`, {
      cache: 'no-store' // Pour les métadonnées dynamiques
    })
    
    if (!response.ok) {
      return {
        title: 'Produit introuvable | Sandy Space',
        description: 'Le produit que vous recherchez n\'existe pas ou n\'est plus disponible.'
      }
    }

    const data = await response.json()
    
    if (!data.success || !data.data) {
      return {
        title: 'Produit introuvable | Sandy Space',
        description: 'Le produit que vous recherchez n\'existe pas ou n\'est plus disponible.'
      }
    }

    const product = data.data

    return {
      title: product.metaTitle || `${product.name} | Sandy Space`,
      description: product.metaDescription || product.shortDescription || product.description,
      keywords: product.tags?.join(', '),
      openGraph: {
        title: product.name,
        description: product.shortDescription || product.description,
        images: product.images?.map(img => ({
          url: img.url,
          width: 800,
          height: 600,
          alt: img.alt || product.name
        })) || [],
        type: 'website',
        siteName: 'Sandy Space'
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: product.shortDescription || product.description,
        images: product.images?.[0]?.url
      },
      alternates: {
        canonical: `/products/${product.slug}`
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Produit introuvable | Sandy Space',
      description: 'Le produit que vous recherchez n\'existe pas ou n\'est plus disponible.'
    }
  }
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params
  return <ProductPageWrapper slug={resolvedParams.slug} />
}