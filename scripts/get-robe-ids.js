const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function getRobeIds() {
  try {
    // Récupérer tous les produits de la catégorie robes
    const robes = await prisma.product.findMany({
      where: {
        category: {
          slug: 'robes'
        }
      },
      select: {
        id: true,
        name: true,
        slug: true
      },
      orderBy: {
        id: 'asc'
      }
    })

    console.log('Robes trouvées:', robes.length)
    console.log('IDs des robes:')
    robes.forEach((robe, index) => {
      console.log(`${index + 1}. ID: ${robe.id}, Nom: ${robe.name}, Slug: ${robe.slug}`)
    })

    return robes
  } catch (error) {
    console.error('Erreur lors de la récupération des robes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

getRobeIds()
