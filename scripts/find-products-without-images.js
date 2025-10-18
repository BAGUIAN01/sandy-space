import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

async function findProductsWithoutImages() {
  try {
    console.log('🔍 Recherche des produits sans images...')
    
    // Récupérer tous les produits avec leurs images
    const products = await prisma.product.findMany({
      include: {
        images: true
      }
    })
    
    const productsWithoutImages = products.filter(product => 
      !product.images || product.images.length === 0
    )
    
    console.log(`📊 Total des produits: ${products.length}`)
    console.log(`❌ Produits sans images: ${productsWithoutImages.length}`)
    
    if (productsWithoutImages.length > 0) {
      console.log('\n📋 Produits sans images:')
      productsWithoutImages.forEach(product => {
        console.log(`   • ${product.name} (${product.slug})`)
        console.log(`     ID: ${product.id}`)
        console.log(`     Prix: ${product.basePrice} ${product.currency}`)
      })
    }
    
    // Vérifier aussi les produits avec des images qui pointent vers des fichiers inexistants
    console.log('\n🔍 Vérification des images existantes...')
    const productsWithImages = products.filter(product => 
      product.images && product.images.length > 0
    )
    
    let missingImages = 0
    for (const product of productsWithImages) {
      for (const image of product.images) {
        const imagePath = path.join(__dirname, '..', 'public', image.url)
        if (!fs.existsSync(imagePath)) {
          console.log(`⚠️ Image manquante: ${image.url} pour ${product.name}`)
          missingImages++
        }
      }
    }
    
    console.log(`\n📊 Résumé:`)
    console.log(`   • Produits sans images: ${productsWithoutImages.length}`)
    console.log(`   • Images manquantes: ${missingImages}`)
    
    return productsWithoutImages
    
  } catch (error) {
    console.error('❌ Erreur lors de la recherche:', error)
    return []
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter la recherche
findProductsWithoutImages()