const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkExistingData() {
  try {
    console.log('🔍 Vérification de votre base de données existante...\n')
    
    // Vérifier les utilisateurs existants
    const userCount = await prisma.user.count()
    console.log(`👥 Utilisateurs existants: ${userCount}`)
    
    if (userCount > 0) {
      const users = await prisma.user.findMany({
        take: 5,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true
        }
      })
      console.log('📋 Premiers utilisateurs:')
      users.forEach(user => {
        console.log(`  - ${user.username || user.email} (${user.role}) - ${user.createdAt.toLocaleDateString()}`)
      })
    }
    
    // Vérifier les produits
    const productCount = await prisma.product.count()
    console.log(`\n📦 Produits existants: ${productCount}`)
    
    // Vérifier les commandes
    const orderCount = await prisma.order.count()
    console.log(`🛒 Commandes existantes: ${orderCount}`)
    
    // Vérifier les catégories
    const categoryCount = await prisma.category.count()
    console.log(`📂 Catégories existantes: ${categoryCount}`)
    
    console.log('\n✅ Vérification terminée - Vos données sont préservées!')
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkExistingData()
