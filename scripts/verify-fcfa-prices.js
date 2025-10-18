import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyFCFAPrices() {
  try {
    console.log('🔍 Vérification des prix en FCFA...')
    
    // Récupérer quelques produits pour vérifier
    const products = await prisma.product.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        basePrice: true,
        compareAtPrice: true,
        costPrice: true,
        currency: true
      }
    })
    
    console.log(`📦 ${products.length} produits vérifiés:`)
    console.log('=' .repeat(80))
    
    products.forEach(product => {
      console.log(`\n🏷️  ${product.name}`)
      console.log(`   ID: ${product.id}`)
      console.log(`   Devise: ${product.currency}`)
      console.log(`   Prix de base: ${product.basePrice} ${product.currency}`)
      console.log(`   Prix barré: ${product.compareAtPrice || 'N/A'} ${product.currency}`)
      console.log(`   Prix coût: ${product.costPrice || 'N/A'} ${product.currency}`)
      
      // Vérifier si les prix semblent raisonnables pour le FCFA
      const basePrice = Number(product.basePrice)
      if (basePrice > 1000 && basePrice < 1000000) {
        console.log(`   ✅ Prix raisonnable pour FCFA`)
      } else {
        console.log(`   ⚠️  Prix suspect - vérifier la conversion`)
      }
    })
    
    // Statistiques globales
    const stats = await prisma.product.groupBy({
      by: ['currency'],
      _count: {
        id: true
      }
    })
    
    console.log('\n📊 Statistiques par devise:')
    stats.forEach(stat => {
      console.log(`   ${stat.currency}: ${stat._count.id} produits`)
    })
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter la vérification
verifyFCFAPrices()
