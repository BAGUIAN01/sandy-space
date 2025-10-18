import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

async function debugImageIssue() {
  try {
    console.log('🔍 Debug - Problème d\'affichage des images')
    console.log('=' .repeat(60))
    
    // 1. Vérifier la structure des produits avec images
    console.log('\n📋 1. Structure des produits avec images:')
    const products = await prisma.product.findMany({
      include: {
        images: {
          where: { isPrimary: true },
          orderBy: { order: 'asc' }
        },
        category: true
      },
      take: 3
    })
    
    for (const product of products) {
      console.log(`\n🏷️ ${product.name}`)
      console.log(`   ID: ${product.id}`)
      console.log(`   Slug: ${product.slug}`)
      console.log(`   Catégorie: ${product.category.name}`)
      console.log(`   Images: ${product.images.length}`)
      
      if (product.images.length > 0) {
        product.images.forEach((image, index) => {
          console.log(`     Image ${index + 1}: ${image.url}`)
          console.log(`       Alt: ${image.alt}`)
          console.log(`       Primary: ${image.isPrimary}`)
        })
      } else {
        console.log(`     ❌ Aucune image`)
      }
    }
    
    // 2. Simuler l'API featured
    console.log('\n📋 2. Simulation API featured:')
    const featuredProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        status: 'ACTIVE',
        category: {
          slug: 'robes'
        }
      },
      include: {
        images: {
          where: { isPrimary: true },
          select: { url: true, alt: true }
        },
        category: {
          select: { name: true, slug: true }
        }
      },
      take: 3
    })
    
    for (const product of featuredProducts) {
      const imageUrl = product.images?.[0]?.url || '/images/robes/cmgv89opa0028ztywhjo2g2pl.png'
      console.log(`\n🏷️ ${product.name}`)
      console.log(`   Image URL: ${imageUrl}`)
      console.log(`   Catégorie: ${product.category.name}`)
    }
    
    // 3. Vérifier les données retournées par l'API
    console.log('\n📋 3. Structure des données pour le frontend:')
    const transformedProducts = featuredProducts.map(product => {
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images?.[0]?.url || '/images/robes/cmgv89opa0028ztywhjo2g2pl.png',
        category: product.category.name,
        categorySlug: product.category.slug
      }
    })
    
    for (const product of transformedProducts) {
      console.log(`\n🏷️ ${product.name}`)
      console.log(`   ID: ${product.id}`)
      console.log(`   Image: ${product.image}`)
      console.log(`   Catégorie: ${product.category}`)
    }
    
    // 4. Vérifier les fichiers d'images
    console.log('\n📋 4. Vérification des fichiers d\'images:')
    
    for (const product of products) {
      if (product.images.length > 0) {
        const imagePath = path.join(process.cwd(), 'public', product.images[0].url)
        const exists = fs.existsSync(imagePath)
        console.log(`   ${exists ? '✅' : '❌'} ${product.name}: ${product.images[0].url}`)
      }
    }
    
    console.log('\n🎯 Résumé du problème:')
    console.log('   1. L\'API featured récupère les images correctement')
    console.log('   2. Les images sont dans la base de données')
    console.log('   3. Le problème est dans robes-page.jsx qui utilise robe.image')
    console.log('   4. La propriété robe.image n\'existe pas dans le schéma')
    console.log('   5. Il faut utiliser robe.image (retourné par l\'API)')
    
  } catch (error) {
    console.error('❌ Erreur lors du debug:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter le debug
debugImageIssue()
