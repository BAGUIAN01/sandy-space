import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migratePricesToFCFA() {
  try {
    console.log('🔄 Début de la migration des prix EUR vers FCFA...')
    
    // Récupérer tous les produits avec des prix en EUR
    const products = await prisma.product.findMany({
      where: {
        currency: 'EUR'
      }
    })
    
    console.log(`📦 ${products.length} produits trouvés avec des prix en EUR`)
    
    let updatedCount = 0
    
    for (const product of products) {
      // Convertir les prix EUR vers FCFA (1 EUR = 655 FCFA)
      const basePriceFCFA = Math.round(Number(product.basePrice) * 655)
      const compareAtPriceFCFA = product.compareAtPrice 
        ? Math.round(Number(product.compareAtPrice) * 655)
        : null
      const costPriceFCFA = product.costPrice 
        ? Math.round(Number(product.costPrice) * 655)
        : null
      
      await prisma.product.update({
        where: { id: product.id },
        data: {
          basePrice: basePriceFCFA,
          compareAtPrice: compareAtPriceFCFA,
          costPrice: costPriceFCFA,
          currency: 'FCFA'
        }
      })
      
      updatedCount++
      console.log(`✅ ${product.name}: ${product.basePrice} EUR → ${basePriceFCFA} FCFA`)
    }
    
    console.log(`🎉 Migration terminée: ${updatedCount} produits mis à jour`)
    
    // Vérifier les résultats
    const fcfProducts = await prisma.product.findMany({
      where: { currency: 'FCFA' }
    })
    
    console.log(`📊 ${fcfProducts.length} produits maintenant en FCFA`)
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter la migration
migratePricesToFCFA()
