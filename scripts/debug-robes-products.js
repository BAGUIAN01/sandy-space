import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function debugRobesProducts() {
  try {
    console.log('🔍 Debug de useRobesProducts - API /api/products/featured')
    console.log('=' .repeat(60))
    
    // Simuler la requête de l'API featured avec category=robes
    const categorySlug = 'robes'
    const limit = 12
    const sortBy = 'popular'
    const page = 1
    const skip = (page - 1) * limit

    // Construire les filtres de base (comme dans l'API)
    const where = {
      status: 'ACTIVE',
      isActive: true,
      OR: [
        { isFeatured: true },
        { salesCount: { gt: 0 } },
        { viewCount: { gt: 10 } }
      ]
    }

    // Ajouter filtre par catégorie robes
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

    console.log('📋 Filtres appliqués:', JSON.stringify(where, null, 2))

    // Récupérer les produits comme dans l'API
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

    console.log(`\n📦 ${products.length} produits trouvés:`)
    
    products.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`)
      console.log(`   ID: ${product.id}`)
      console.log(`   Catégorie: ${product.category.name}`)
      console.log(`   Images primaires: ${product.images.length}`)
      
      if (product.images.length > 0) {
        product.images.forEach((img, imgIndex) => {
          console.log(`   Image ${imgIndex + 1}: ${img.url}`)
        })
      } else {
        console.log(`   ⚠️ Aucune image primaire trouvée`)
      }
      
      // Simuler la transformation de l'API
      const defaultVariant = product.variants[0]
      const transformedImage = product.images?.[0]?.url || '/images/robes/cmgv89opa0028ztywhjo2g2pl.png'
      
      console.log(`   Image transformée: ${transformedImage}`)
      
      // Vérifier spécifiquement la robe soirée noire
      if (product.name.toLowerCase().includes('noire') || product.name.toLowerCase().includes('soirée')) {
        console.log(`   🖤 *** ROBE NOIRE/SOIRÉE DÉTECTÉE ***`)
        console.log(`   Image originale: ${product.images?.[0]?.url}`)
        console.log(`   Image finale: ${transformedImage}`)
        console.log(`   Extension originale: ${product.images?.[0]?.url?.split('.').pop()}`)
        console.log(`   Extension finale: ${transformedImage.split('.').pop()}`)
      }
    })

    // Vérifier spécifiquement la robe soirée noire
    console.log(`\n🔍 Vérification spécifique de la robe soirée noire:`)
    const robeSoireeNoire = products.find(p => 
      p.name.toLowerCase().includes('soirée') && p.name.toLowerCase().includes('noire')
    )
    
    if (robeSoireeNoire) {
      console.log(`✅ Robe soirée noire trouvée:`)
      console.log(`   Nom: ${robeSoireeNoire.name}`)
      console.log(`   ID: ${robeSoireeNoire.id}`)
      console.log(`   Image DB: ${robeSoireeNoire.images?.[0]?.url}`)
      console.log(`   Extension: ${robeSoireeNoire.images?.[0]?.url?.split('.').pop()}`)
    } else {
      console.log(`❌ Robe soirée noire non trouvée dans les résultats`)
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter le debug
debugRobesProducts()
