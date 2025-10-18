const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function safeAuthIntegration() {
  try {
    console.log('🔍 Vérification de votre base de données existante...\n')
    
    // 1. Vérifier les utilisateurs existants
    const existingUsers = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        password: true
      }
    })
    
    console.log(`👥 Utilisateurs existants trouvés: ${existingUsers.length}`)
    
    if (existingUsers.length > 0) {
      console.log('📋 Vos utilisateurs existants:')
      existingUsers.forEach(user => {
        const hasPassword = user.password ? '✅' : '❌'
        console.log(`  - ${user.username || user.email} (${user.role}) ${hasPassword} mot de passe`)
      })
    }
    
    // 2. Vérifier si des tables NextAuth existent déjà
    const accountCount = await prisma.account.count().catch(() => 0)
    const sessionCount = await prisma.session.count().catch(() => 0)
    
    console.log(`\n🔐 Tables NextAuth:`)
    console.log(`  - Accounts: ${accountCount}`)
    console.log(`  - Sessions: ${sessionCount}`)
    
    // 3. Vérifier s'il y a déjà un admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })
    
    if (existingAdmin) {
      console.log(`\n👑 Admin existant trouvé: ${existingAdmin.username || existingAdmin.email}`)
      console.log('✅ Aucune action nécessaire pour l\'admin')
    } else {
      console.log('\n⚠️  Aucun admin trouvé')
      
      // Proposer de créer un admin seulement si l'utilisateur le confirme
      console.log('\n🤔 Voulez-vous créer un utilisateur admin?')
      console.log('   - Username: admin')
      console.log('   - Email: admin@sandyspace.com')
      console.log('   - Password: admin123')
      console.log('\n   ⚠️  Changez le mot de passe après la première connexion!')
      
      // Pour l'instant, on ne crée pas automatiquement l'admin
      console.log('\n💡 Pour créer l\'admin plus tard, utilisez: npm run create-admin')
    }
    
    // 4. Vérifier les autres données importantes
    const productCount = await prisma.product.count()
    const orderCount = await prisma.order.count()
    const categoryCount = await prisma.category.count()
    
    console.log('\n📊 Résumé de vos données:')
    console.log(`  - Produits: ${productCount}`)
    console.log(`  - Commandes: ${orderCount}`)
    console.log(`  - Catégories: ${categoryCount}`)
    console.log(`  - Utilisateurs: ${existingUsers.length}`)
    
    console.log('\n✅ Intégration sécurisée terminée!')
    console.log('🎉 Vos données existantes sont préservées')
    console.log('\n📝 Prochaines étapes:')
    console.log('   1. Créez votre fichier .env.local avec vos informations de base')
    console.log('   2. Lancez: npm run dev')
    console.log('   3. Visitez: http://localhost:3000/auth/login')
    
    if (!existingAdmin) {
      console.log('   4. Si besoin: npm run create-admin')
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message)
    console.log('\n💡 Assurez-vous que:')
    console.log('   - Votre base de données est démarrée')
    console.log('   - Votre fichier .env.local est configuré correctement')
    console.log('   - Votre DATABASE_URL est correcte')
  } finally {
    await prisma.$disconnect()
  }
}

safeAuthIntegration()
