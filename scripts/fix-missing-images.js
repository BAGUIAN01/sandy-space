import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

async function fixMissingImages() {
  try {
    console.log('🔧 Correction des images manquantes...')
    
    // Mapping des produits avec leurs nouvelles images
    const productImageMapping = {
      'robe-decontractee': '/images/products/robe-decontractee-1.png',
      'robe-elegante-noire': '/images/products/robe-elegante-noire-1.png',
      'robe-ete-florale': '/images/products/robe-ete-florale-1.png',
      'robe-de-mariee': '/images/products/robe-de-mariee-1.png'
    }
    
    // Récupérer tous les produits
    const products = await prisma.product.findMany({
      include: {
        images: true
      }
    })
    
    let fixedCount = 0
    
    for (const product of products) {
      const newImagePath = productImageMapping[product.slug]
      
      if (newImagePath) {
        console.log(`\n🔄 Correction pour: ${product.name}`)
        console.log(`   Slug: ${product.slug}`)
        console.log(`   Nouvelle image: ${newImagePath}`)
        
        // Vérifier si la nouvelle image existe
        const fullImagePath = path.join(__dirname, '..', 'public', newImagePath)
        if (!fs.existsSync(fullImagePath)) {
          console.log(`   ⚠️ Nouvelle image n'existe pas: ${newImagePath}`)
          continue
        }
        
        // Supprimer les anciennes images
        if (product.images && product.images.length > 0) {
          for (const oldImage of product.images) {
            await prisma.productImage.delete({
              where: { id: oldImage.id }
            })
            console.log(`   🗑️ Ancienne image supprimée: ${oldImage.url}`)
          }
        }
        
        // Créer la nouvelle image
        await prisma.productImage.create({
          data: {
            url: newImagePath,
            alt: `${product.name} - Image principale`,
            order: 0,
            isPrimary: true,
            productId: product.id
          }
        })
        
        console.log(`   ✅ Nouvelle image créée`)
        fixedCount++
      }
    }
    
    console.log(`\n🎉 ${fixedCount} produits corrigés!`)
    
    // Vérification finale
    console.log('\n🔍 Vérification finale...')
    const finalProducts = await prisma.product.findMany({
      include: {
        images: true
      }
    })
    
    let stillMissing = 0
    for (const product of finalProducts) {
      let hasValidImage = false
      
      if (product.images && product.images.length > 0) {
        for (const image of product.images) {
          const imagePath = path.join(__dirname, '..', 'public', image.url)
          if (fs.existsSync(imagePath)) {
            hasValidImage = true
            break
          }
        }
      }
      
      if (!hasValidImage) {
        stillMissing++
        console.log(`⚠️ Toujours sans image: ${product.name} (${product.slug})`)
      }
    }
    
    console.log(`\n📊 Résultat final:`)
    console.log(`   • Produits corrigés: ${fixedCount}`)
    console.log(`   • Produits sans image: ${stillMissing}`)
    
    if (stillMissing === 0) {
      console.log('🎉 Tous les produits ont maintenant des images valides!')
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter la correction
fixMissingImages()
