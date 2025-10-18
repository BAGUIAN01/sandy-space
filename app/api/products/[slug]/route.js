import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Fonction pour obtenir l'image d'un produit par son ID
function getProductImage(productId) {
  if (!productId) {
    return '/images/robes/backup/image13-1_2-png202504140234401.png'
  }
  
  // Utiliser directement l'ID du produit pour le nom de l'image
  const imageUrl = `/images/robes/${productId}.png`
  console.log(`Product ID: ${productId}, Image: ${imageUrl}`)
  return imageUrl
}

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params
    const { slug } = resolvedParams
    console.log('Looking for product with slug:', slug)

    // Récupérer le produit avec les relations de base
    const product = await prisma.product.findFirst({
      where: {
        slug: slug
      },
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    console.log('Product found:', product)
    console.log('Product images:', product.images)
    console.log('Product basePrice:', product.basePrice)

    // Incrémenter le compteur de vues (avec gestion d'erreur)
    try {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          viewCount: {
            increment: 1
          }
        }
      })
    } catch (viewCountError) {
      console.warn('Failed to increment viewCount:', viewCountError.message)
      // Continue sans incrémenter le compteur de vues
    }

    // Données transformées pour correspondre à l'API featured
    const transformedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description || 'Description non disponible',
      shortDescription: product.shortDescription,
      
      // Prix cohérents avec l'API featured
      price: parseFloat(product.basePrice),
      originalPrice: product.compareAtPrice ? parseFloat(product.compareAtPrice) : null,
      basePrice: product.basePrice,
      compareAtPrice: product.compareAtPrice,
      
      currency: product.currency || 'EUR',
      sku: product.sku,
      weight: product.weight,
      dimensions: product.dimensions,
      status: product.status,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      category: product.category,
      brand: product.brand,
      
      // Images avec lien direct par ID
      image: getProductImage(product.id),
      images: [{
        id: 'main',
        url: getProductImage(product.id),
        alt: product.name,
        order: 0,
        isPrimary: true,
        fallbackUrl: '/images/robes/backup/image13-1_2-png202504140234401.png'
      }],
      
      // Statistiques réelles - synchronisées avec l'API featured
      viewCount: product.viewCount || 0,
      salesCount: product.salesCount || 0,
      avgRating: 4.5, // Valeur par défaut cohérente
      reviewCount: 0,
      rating: 4.5, // Pour la cohérence avec l'API featured
      reviews: 0, // Nombre d'avis
      
      // Variantes et avis
      variants: [],
      colors: ['Noir', 'Rouge', 'Bleu'], // Couleurs par défaut
      sizes: ['S', 'M', 'L'], // Tailles par défaut
      size: ['S', 'M', 'L'], // Pour la cohérence avec l'API featured
      
      // Indicateurs basés sur les vraies données
      isNew: product.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      isSale: product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.basePrice),
      
      // Dates réelles
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }

    return NextResponse.json({
      success: true,
      data: transformedProduct
    })

  } catch (error) {
    console.error('Error fetching product by slug:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}