import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

async function assignImagesToProducts() {
  try {
    console.log('🖼️ Attribution d\'images aux produits...')
    
    // Récupérer tous les produits avec leurs images
    const products = await prisma.product.findMany({
      include: {
        images: true
      }
    })
    
    // Trouver les produits avec des images manquantes
    const productsWithMissingImages = []
    
    for (const product of products) {
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
        productsWithMissingImages.push(product)
      }
    }
    
    console.log(`📊 Produits avec images manquantes: ${productsWithMissingImages.length}`)
    
    if (productsWithMissingImages.length === 0) {
      console.log('✅ Tous les produits ont des images valides!')
      return
    }
    
    // Lister les images disponibles dans le dossier products
    const productsDir = path.join(__dirname, '..', 'public', 'images', 'products')
    const availableImages = []
    
    if (fs.existsSync(productsDir)) {
      const files = fs.readdirSync(productsDir)
      const imageFiles = files.filter(file => 
        file.toLowerCase().endsWith('.png') || 
        file.toLowerCase().endsWith('.jpg') || 
        file.toLowerCase().endsWith('.jpeg')
      )
      
      for (const file of imageFiles) {
        availableImages.push(`/images/products/${file}`)
      }
    }
    
    console.log(`📁 Images disponibles: ${availableImages.length}`)
    
    if (availableImages.length === 0) {
      console.log('❌ Aucune image disponible dans le dossier products')
      return
    }
    
    // Assigner des images aux produits
    let assignedCount = 0
    
    for (let i = 0; i < productsWithMissingImages.length; i++) {
      const product = productsWithMissingImages[i]
      const imageToAssign = availableImages[i % availableImages.length] // Rotation des images
      
      console.log(`\n🔄 Assignation pour: ${product.name}`)
      console.log(`   Image: ${imageToAssign}`)
      
      // Supprimer les anciennes images invalides
      if (product.images && product.images.length > 0) {
        for (const oldImage of product.images) {
          await prisma.productImage.delete({
            where: { id: oldImage.id }
          })
        }
      }
      
      // Créer la nouvelle image
      await prisma.productImage.create({
        data: {
          url: imageToAssign,
          alt: `${product.name} - Image principale`,
          order: 0,
          isPrimary: true,
          productId: product.id
        }
      })
      
      console.log(`   ✅ Image assignée`)
      assignedCount++
    }
    
    console.log(`\n🎉 ${assignedCount} images assignées avec succès!`)
    
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
        console.log(`⚠️ Toujours sans image: ${product.name}`)
      }
    }
    
    console.log(`\n📊 Résultat final:`)
    console.log(`   • Images assignées: ${assignedCount}`)
    console.log(`   • Produits sans image: ${stillMissing}`)
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'attribution:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter l'attribution
assignImagesToProducts()
