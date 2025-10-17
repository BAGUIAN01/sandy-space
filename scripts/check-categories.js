const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkCategories() {
  try {
    // Récupérer toutes les catégories
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    console.log('Catégories trouvées:')
    categories.forEach(category => {
      console.log(`- ID: ${category.id}, Nom: ${category.name}, Slug: ${category.slug}, Produits: ${category._count.products}`)
    })

    // Récupérer tous les produits
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      take: 10
    })

    console.log('\nPremiers 10 produits:')
    products.forEach(product => {
      console.log(`- ID: ${product.id}, Nom: ${product.name}, Catégorie: ${product.category?.name} (${product.category?.slug})`)
    })

  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkCategories()
