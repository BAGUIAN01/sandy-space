import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testAfterCacheClear() {
  try {
    console.log('🧹 Test après nettoyage du cache')
    console.log('=' .repeat(50))
    
    // Test direct de la base de données
    const robeSoireeNoire = await prisma.product.findFirst({
      where: {
        name: { contains: 'Soirée Noire', mode: 'insensitive' }
      },
      include: {
        images: {
          where: { isPrimary: true },
          orderBy: { order: 'asc' }
        }
      }
    })
    
    if (robeSoireeNoire) {
      console.log('✅ Robe Soirée Noire trouvée en base:')
      console.log(`   Nom: ${robeSoireeNoire.name}`)
      console.log(`   ID: ${robeSoireeNoire.id}`)
      console.log(`   Image: ${robeSoireeNoire.images[0]?.url}`)
      console.log(`   Extension: ${robeSoireeNoire.images[0]?.url?.split('.').pop()}`)
    } else {
      console.log('❌ Robe Soirée Noire non trouvée')
    }
    
    // Test de l'API featured
    console.log('\n🔍 Test de l\'API featured:')
    const products = await prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        isActive: true,
        OR: [
          { isFeatured: true },
          { salesCount: { gt: 0 } },
          { viewCount: { gt: 10 } }
        ]
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        },
        images: {
          where: { isPrimary: true },
          select: { url: true, alt: true }
        }
      },
      take: 5
    })
    
    console.log(`   ${products.length} produits trouvés`)
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name}`)
      console.log(`      Image: ${product.images[0]?.url}`)
      console.log(`      Extension: ${product.images[0]?.url?.split('.').pop()}`)
    })
    
    console.log('\n🎯 Instructions pour le navigateur:')
    console.log('1. Ouvrez les DevTools (F12)')
    console.log('2. Allez sur l\'onglet Application/Storage')
    console.log('3. Cliquez sur "Clear storage" ou "Vider le stockage"')
    console.log('4. Ou utilisez Ctrl+Shift+R pour un rechargement forcé')
    console.log('5. Testez l\'URL: http://localhost:3026/images/robes/cmgvjs2ja0046zt8omfpswatb.jpg')
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter le test
testAfterCacheClear()
