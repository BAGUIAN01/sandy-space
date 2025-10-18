import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const parentOnly = searchParams.get('parentOnly') === 'true'
    const withProducts = searchParams.get('withProducts') === 'true'

    // Construire les filtres
    const where = {
      isActive: true
    }

    if (parentOnly) {
      where.parentId = null
    }

    // Inclure les relations si demandé
    const include = {}
    if (withProducts) {
      include.products = {
        where: {
          status: 'ACTIVE',
          isActive: true
        },
        select: {
          id: true,
          name: true,
          slug: true,
          basePrice: true,
          images: {
            where: {
              isPrimary: true
            },
            select: {
              url: true
            }
          }
        },
        take: 4,
        orderBy: {
          salesCount: 'desc'
        }
      }
    }

    include.children = {
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        order: true
      },
      orderBy: {
        order: 'asc'
      }
    }

    // Récupérer les catégories
    const categories = await prisma.category.findMany({
      where,
      include,
      orderBy: [
        { order: 'asc' },
        { name: 'asc' }
      ]
    })

    // Transformer les données
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      parentId: category.parentId,
      order: category.order,
      children: category.children?.map(child => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        image: child.image,
        order: child.order
      })),
      products: withProducts ? category.products?.map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: parseFloat(product.basePrice),
        image: product.images[0]?.url || '/images/placeholder.jpg'
      })) : undefined
    }))

    return NextResponse.json({
      success: true,
      data: transformedCategories,
      count: transformedCategories.length
    })

  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
