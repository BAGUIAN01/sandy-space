const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    // Vérifier si un admin existe déjà
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (existingAdmin) {
      console.log('Un utilisateur admin existe déjà:', existingAdmin.username)
      return
    }

    // Créer l'utilisateur admin
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@sandyspace.com',
        password: hashedPassword,
        name: 'Administrateur',
        role: 'ADMIN',
        isActive: true
      }
    })

    // Créer un panier pour l'admin
    await prisma.cart.create({
      data: {
        userId: admin.id
      }
    })

    console.log('Utilisateur admin créé avec succès:')
    console.log('Username: admin')
    console.log('Email: admin@sandyspace.com')
    console.log('Password: admin123')
    console.log('⚠️  Changez le mot de passe après la première connexion!')

  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()
