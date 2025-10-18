import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

async function cleanObsoleteImages() {
  try {
    console.log('🧹 Nettoyage des images obsolètes...')
    
    // Récupérer tous les produits avec leurs images
    const products = await prisma.product.findMany({
      include: {
        images: true
      }
    })
    
    let cleanedCount = 0
    
    for (const product of products) {
      if (product.images && product.images.length > 0) {
        // Garder seulement les images dans le dossier /products/
        const validImages = product.images.filter(image => 
          image.url.startsWith('/images/products/')
        )
        
        const obsoleteImages = product.images.filter(image => 
          !image.url.startsWith('/images/products/')
        )
        
        if (obsoleteImages.length > 0) {
          console.log(`\n🔄 Nettoyage pour: ${product.name}`)
          
          // Supprimer les images obsolètes de la base de données
          for (const obsoleteImage of obsoleteImages) {
            await prisma.productImage.delete({
              where: { id: obsoleteImage.id }
            })
            console.log(`   🗑️ Image obsolète supprimée: ${obsoleteImage.url}`)
            cleanedCount++
          }
          
          // Si aucune image valide ne reste, créer une image par défaut
          if (validImages.length === 0) {
            const defaultImagePath = `/images/products/${product.slug}-1.png`
            const fullImagePath = path.join(__dirname, '..', 'public', defaultImagePath)
            
            if (fs.existsSync(fullImagePath)) {
              await prisma.productImage.create({
                data: {
                  url: defaultImagePath,
                  alt: `${product.name} - Image principale`,
                  order: 0,
                  isPrimary: true,
                  productId: product.id
                }
              })
              console.log(`   ✅ Image par défaut créée: ${defaultImagePath}`)
            }
          }
        }
      }
    }
    
    console.log(`\n🎉 ${cleanedCount} images obsolètes supprimées!`)
    
    // Vérification finale
    console.log('\n🔍 Vérification finale...')
    const finalProducts = await prisma.product.findMany({
      include: {
        images: true
      }
    })
    
    let perfectMapping = 0
    let totalImages = 0
    
    for (const product of finalProducts) {
      if (product.images && product.images.length > 0) {
        for (const image of product.images) {
          totalImages++
          const imageFileName = path.basename(image.url, path.extname(image.url))
          const productSlug = product.slug
          
          if (imageFileName.includes(productSlug)) {
            perfectMapping++
          }
        }
      }
    }
    
    console.log(`\n📊 Résultat final:`)
    console.log(`   • Images obsolètes supprimées: ${cleanedCount}`)
    console.log(`   • Total des images: ${totalImages}`)
    console.log(`   • Correspondances parfaites: ${perfectMapping}`)
    console.log(`   • Taux de correspondance: ${Math.round((perfectMapping / totalImages) * 100)}%`)
    
    if (perfectMapping === totalImages) {
      console.log('\n🎉 Toutes les images correspondent parfaitement aux IDs des produits!')
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter le nettoyage
cleanObsoleteImages()
