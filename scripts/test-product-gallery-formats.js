import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

// Fonction de test pour vérifier les formats d'images
const isSupportedImage = (url = "") => {
  if (!url) return false;
  return /\.(jpe?g|png)$/i.test(url.split('?')[0]);
}

async function testProductGalleryFormats() {
  try {
    console.log('🧪 Test des formats d\'images pour ProductGallery...')
    
    // Récupérer tous les produits avec leurs images
    const products = await prisma.product.findMany({
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { name: 'asc' }
    })
    
    console.log(`📊 Total des produits: ${products.length}`)
    console.log('\n📋 Test des formats d\'images:')
    console.log('=' .repeat(80))
    
    let pngCount = 0
    let jpgCount = 0
    let unsupportedCount = 0
    let totalImages = 0
    
    for (const product of products) {
      console.log(`\n🏷️ ${product.name}`)
      console.log(`   ID: ${product.id}`)
      
      if (product.images && product.images.length > 0) {
        for (let i = 0; i < product.images.length; i++) {
          const image = product.images[i]
          totalImages++
          
          console.log(`   Image ${i + 1}: ${image.url}`)
          
          // Tester le format
          if (isSupportedImage(image.url)) {
            if (image.url.toLowerCase().includes('.png')) {
              console.log(`     ✅ Format PNG supporté`)
              pngCount++
            } else if (image.url.toLowerCase().includes('.jpg') || image.url.toLowerCase().includes('.jpeg')) {
              console.log(`     ✅ Format JPG/JPEG supporté`)
              jpgCount++
            }
          } else {
            console.log(`     ❌ Format non supporté`)
            unsupportedCount++
          }
          
          // Vérifier l'existence du fichier
          const imagePath = path.join(__dirname, '..', 'public', image.url)
          if (fs.existsSync(imagePath)) {
            console.log(`     ✅ Fichier existe`)
          } else {
            console.log(`     ❌ Fichier manquant`)
          }
        }
      } else {
        console.log(`   ❌ Aucune image`)
      }
    }
    
    console.log(`\n📊 Résumé des formats:`)
    console.log('=' .repeat(40))
    console.log(`   • Total des images: ${totalImages}`)
    console.log(`   • Images PNG: ${pngCount}`)
    console.log(`   • Images JPG/JPEG: ${jpgCount}`)
    console.log(`   • Formats non supportés: ${unsupportedCount}`)
    console.log(`   • Taux de support: ${Math.round(((pngCount + jpgCount) / totalImages) * 100)}%`)
    
    // Test de la fonction isSupportedImage
    console.log(`\n🧪 Test de la fonction isSupportedImage:`)
    const testUrls = [
      '/images/robes/cmgv89opa0028ztywhjo2g2pl.png',
      '/images/robes/cmgvjs1ji003qzt8ogmqiecg4.jpg',
      '/images/robes/cmgv8dfxd002gztb8emjy5nk3.png',
      '/images/robes/cmgvjs2ja0046zt8omfpswatb.jpg',
      '/images/test.gif', // Non supporté
      '/images/test.webp', // Non supporté
    ]
    
    for (const url of testUrls) {
      const supported = isSupportedImage(url)
      console.log(`   ${supported ? '✅' : '❌'} ${url}`)
    }
    
    // Exemples d'utilisation
    console.log(`\n💡 Exemples d'utilisation dans ProductGallery:`)
    console.log(`   // Le composant accepte maintenant:`)
    console.log(`   <ProductGallery images={product.images} />`)
    console.log(`   `)
    console.log(`   // Formats supportés:`)
    console.log(`   • PNG: /images/robes/cmgv89opa0028ztywhjo2g2pl.png`)
    console.log(`   • JPG: /images/robes/cmgvjs1ji003qzt8ogmqiecg4.jpg`)
    console.log(`   • JPEG: /images/robes/cmgvjs1ji003qzt8ogmqiecg4.jpeg`)
    
    if (unsupportedCount === 0) {
      console.log(`\n🎉 Tous les formats d'images sont supportés!`)
    } else {
      console.log(`\n⚠️ ${unsupportedCount} images ont des formats non supportés.`)
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter le test
testProductGalleryFormats()
