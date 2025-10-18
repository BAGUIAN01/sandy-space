import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testAPIResponse() {
  try {
    console.log('🧪 Test de la réponse API /api/products/featured')
    console.log('=' .repeat(60))
    
    // Simuler exactement ce que fait l'API
    const categorySlug = 'robes'
    const limit = 20
    const sortBy = 'popular'
    const page = 1
    const skip = (page - 1) * limit

    const where = {
      status: 'ACTIVE',
      isActive: true,
      OR: [
        { isFeatured: true },
        { salesCount: { gt: 0 } },
        { viewCount: { gt: 10 } }
      ]
    }

    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      include: { children: true }
    })

    if (category) {
      if (category.children && category.children.length > 0) {
        const categoryIds = [category.id, ...category.children.map(child => child.id)]
        where.categoryId = {
          in: categoryIds
        }
      } else {
        where.category = {
          slug: categorySlug
        }
      }
    }

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
            stock: true
          }
        }
      },
      orderBy: [{ salesCount: 'desc' }, { viewCount: 'desc' }, { createdAt: 'desc' }],
      skip,
      take: limit
    })

    // Transformer les données exactement comme l'API
    const transformedProducts = products.map((product, index) => {
      const defaultVariant = product.variants[0]
      
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: parseFloat(defaultVariant?.price || product.basePrice),
        originalPrice: defaultVariant?.compareAtPrice ? parseFloat(defaultVariant.compareAtPrice) : null,
        image: product.images?.[0]?.url || '/images/robes/cmgv89opa0028ztywhjo2g2pl.png',
        category: product.category.name,
        categorySlug: product.category.slug
      }
    })

    console.log(`\n📦 ${transformedProducts.length} produits transformés:`)
    
    transformedProducts.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`)
      console.log(`   ID: ${product.id}`)
      console.log(`   Image: ${product.image}`)
      console.log(`   Extension: ${product.image.split('.').pop()}`)
      
      // Vérifier spécifiquement la robe soirée noire
      if (product.name.toLowerCase().includes('soirée') && product.name.toLowerCase().includes('noire')) {
        console.log(`   🖤 *** ROBE SOIRÉE NOIRE ***`)
        console.log(`   Image finale: ${product.image}`)
        console.log(`   Extension finale: ${product.image.split('.').pop()}`)
      }
    })

    // Simuler la réponse JSON de l'API
    const apiResponse = {
      success: true,
      data: transformedProducts,
      count: transformedProducts.length,
      total: products.length,
      page,
      totalPages: Math.ceil(products.length / limit),
      hasNextPage: page < Math.ceil(products.length / limit),
      hasPrevPage: page > 1
    }

    console.log(`\n📋 Réponse API simulée:`)
    console.log(`   Success: ${apiResponse.success}`)
    console.log(`   Count: ${apiResponse.count}`)
    console.log(`   Total: ${apiResponse.total}`)
    
    // Trouver la robe soirée noire dans la réponse
    const robeSoireeNoire = apiResponse.data.find(p => 
      p.name.toLowerCase().includes('soirée') && p.name.toLowerCase().includes('noire')
    )
    
    if (robeSoireeNoire) {
      console.log(`\n✅ Robe soirée noire dans la réponse API:`)
      console.log(`   Nom: ${robeSoireeNoire.name}`)
      console.log(`   Image: ${robeSoireeNoire.image}`)
      console.log(`   Extension: ${robeSoireeNoire.image.split('.').pop()}`)
    } else {
      console.log(`\n❌ Robe soirée noire non trouvée dans la réponse API`)
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter le test
testAPIResponse()
