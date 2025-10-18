import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 12
    const categorySlug = searchParams.get('category')
    const sortBy = searchParams.get('sortBy') || 'popular'
    const page = parseInt(searchParams.get('page')) || 1
    const skip = (page - 1) * limit

    // Construire les filtres de base
    const where = {
      status: 'ACTIVE',
      isActive: true,
      OR: [
        { isFeatured: true },
        { salesCount: { gt: 0 } },
        { viewCount: { gt: 10 } }
      ]
    }

    // Ajouter filtre par catégorie si spécifié
    if (categorySlug && categorySlug !== 'toutes') {
      // Récupérer la catégorie et ses sous-catégories
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
        include: { children: true }
      })

      if (category) {
        // Si c'est une catégorie parent avec des enfants, inclure les sous-catégories
        if (category.children && category.children.length > 0) {
          const categoryIds = [category.id, ...category.children.map(child => child.id)]
          where.categoryId = {
            in: categoryIds
          }
        } else {
          // Sinon, filtre par la catégorie exacte
          where.category = {
            slug: categorySlug
          }
        }
      }
    }

    // Construire l'ordre de tri
    let orderBy = []
    switch (sortBy) {
      case 'price-low':
        orderBy = [{ basePrice: 'asc' }]
        break
      case 'price-high':
        orderBy = [{ basePrice: 'desc' }]
        break
      case 'newest':
        orderBy = [{ createdAt: 'desc' }]
        break
      case 'rating':
        orderBy = [{ viewCount: 'desc' }] // Approximation
        break
      default: // popular
        orderBy = [{ salesCount: 'desc' }, { viewCount: 'desc' }, { createdAt: 'desc' }]
    }

    // Récupérer le total pour la pagination
    const total = await prisma.product.count({ where })

    // Récupérer les produits avec leurs relations
    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: {
          where: {
            isPrimary: true
          },
          select: {
            url: true,
            alt: true
          }
        },
        variants: {
          where: {
            isActive: true,
            isDefault: true
          },
          select: {
            id: true,
            price: true,
            compareAtPrice: true,
            stock: true,
            attributes: {
              include: {
                attributeValue: {
                  include: {
                    attribute: {
                      select: {
                        name: true,
                        type: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        reviews: {
          where: {
            isApproved: true
          },
          select: {
            rating: true
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy,
      skip,
      take: limit
    })

    // Transformer les données pour le frontend
    const transformedProducts = products.map((product, index) => {
      console.log(`Transforming product ${index}: ID=${product.id}, Name=${product.name}`)
      // Calculer la note moyenne
      const avgRating = product.reviews.length > 0 
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0

      // Récupérer la variante par défaut
      const defaultVariant = product.variants[0]
      
      // Extraire les couleurs disponibles
      const colors = defaultVariant?.attributes
        ?.filter(attr => attr.attributeValue.attribute.type === 'COLOR')
        ?.map(attr => attr.attributeValue.value) || []

      // Extraire les tailles disponibles
      const sizes = defaultVariant?.attributes
        ?.filter(attr => attr.attributeValue.attribute.type === 'SIZE')
        ?.map(attr => attr.attributeValue.value) || []

      // Déterminer si c'est une nouveauté (créé il y a moins de 30 jours)
      const isNew = new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

      // Déterminer si c'est en promotion
      const isSale = defaultVariant?.compareAtPrice && 
                    defaultVariant.compareAtPrice > defaultVariant.price

      // Déterminer la taille de grille (alternance pour un effet visuel)
      const gridSizes = ['large', 'medium', 'small', 'medium', 'large', 'small']
      const productGridSize = gridSizes[index % gridSizes.length]

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: parseFloat(defaultVariant?.price || product.basePrice),
        originalPrice: defaultVariant?.compareAtPrice ? parseFloat(defaultVariant.compareAtPrice) : null,
        image: product.images?.[0]?.url || '/images/robes/cmgv89opa0028ztywhjo2g2pl.png',
        category: product.category.name,
        categorySlug: product.category.slug,
        size: sizes,
        colors: colors,
        rating: 4.5,
        reviews: 12,
        isNew,
        isSale,
        isFeatured: product.isFeatured,
        description: product.shortDescription || product.description?.substring(0, 100) + '...',
        stock: defaultVariant?.stock || 0,
        tags: product.tags.map(pt => pt.tag.name),
        gridSize: productGridSize
      }
    })

    return NextResponse.json({
      success: true,
      data: transformedProducts,
      count: transformedProducts.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    })

  } catch (error) {
    console.error('Error fetching featured products:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch featured products',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
