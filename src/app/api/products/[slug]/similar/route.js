import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params
    const { slug } = resolvedParams
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 4

    console.log('Fetching similar products for:', slug)

    // Récupérer le produit actuel (par slug ou par ID si slug est un ID)
    const currentProduct = await prisma.product.findFirst({
      where: { 
        OR: [
          { slug },
          { id: slug } // Permet aussi de chercher par ID
        ]
      },
      select: {
        id: true,
        categoryId: true,
        brandId: true
      }
    })

    console.log('Current product found:', currentProduct)

    if (!currentProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Récupérer les produits similaires basés sur la catégorie
    const similarProducts = await prisma.product.findMany({
      where: {
        AND: [
          { id: { not: currentProduct.id } }, // Exclure le produit actuel
          { status: 'ACTIVE' },
          { isActive: true },
          { categoryId: currentProduct.categoryId } // Même catégorie seulement
        ]
      },
      include: {
        images: {
          take: 1
        },
        category: {
          select: {
            name: true,
            slug: true
          }
        },
        brand: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    console.log('Similar products found:', similarProducts.length)

    // Transformer les données
    const transformedProducts = similarProducts.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      basePrice: parseFloat(product.basePrice),
      compareAtPrice: product.compareAtPrice ? parseFloat(product.compareAtPrice) : null,
      currency: product.currency,
      sku: product.sku,
      weight: product.weight,
      
      // Images
      image: product.images[0]?.url || null,
      
      // Relations
      category: product.category,
      brand: product.brand,
      
      // Statistiques
      avgRating: 0,
      reviewCount: 0,
      viewCount: product.viewCount,
      salesCount: product.salesCount,
      
      // Statut
      isFeatured: product.isFeatured,
      
      // Dates
      createdAt: product.createdAt
    }))

    return NextResponse.json({
      success: true,
      data: transformedProducts
    })

  } catch (error) {
    console.error('Error fetching similar products:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
