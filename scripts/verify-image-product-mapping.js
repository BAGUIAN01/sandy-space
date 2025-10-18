import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

async function verifyImageProductMapping() {
  try {
    console.log('🔍 Vérification de la correspondance images-produits...')
    
    // Récupérer tous les produits avec leurs images
    const products = await prisma.product.findMany({
      include: {
        images: true
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    console.log(`📊 Total des produits: ${products.length}`)
    console.log('\n📋 Correspondance images-produits:')
    console.log('=' .repeat(80))
    
    let perfectMatches = 0
    let goodMatches = 0
    let noMatches = 0
    
    for (const product of products) {
      console.log(`\n🏷️ ${product.name}`)
      console.log(`   Slug: ${product.slug}`)
      console.log(`   ID: ${product.id}`)
      
      if (product.images && product.images.length > 0) {
        for (const image of product.images) {
          console.log(`   Image: ${image.url}`)
          
          // Vérifier si l'image existe
          const imagePath = path.join(__dirname, '..', 'public', image.url)
          const exists = fs.existsSync(imagePath)
          console.log(`   Existe: ${exists ? '✅' : '❌'}`)
          
          // Vérifier la correspondance avec le slug
          const imageFileName = path.basename(image.url, path.extname(image.url))
          const productSlug = product.slug
          
          if (imageFileName.includes(productSlug)) {
            console.log(`   Correspondance: ✅ Parfaite`)
            perfectMatches++
          } else if (imageFileName.includes(productSlug.split('-')[0])) {
            console.log(`   Correspondance: ⚠️ Partielle`)
            goodMatches++
          } else {
            console.log(`   Correspondance: ❌ Aucune`)
            noMatches++
          }
        }
      } else {
        console.log(`   Images: ❌ Aucune`)
        noMatches++
      }
    }
    
    console.log('\n📊 Résumé des correspondances:')
    console.log('=' .repeat(50))
    console.log(`✅ Correspondances parfaites: ${perfectMatches}`)
    console.log(`⚠️ Correspondances partielles: ${goodMatches}`)
    console.log(`❌ Aucune correspondance: ${noMatches}`)
    
    const totalImages = products.reduce((sum, product) => 
      sum + (product.images ? product.images.length : 0), 0
    )
    
    console.log(`\n📈 Statistiques:`)
    console.log(`   • Total des images: ${totalImages}`)
    console.log(`   • Taux de correspondance parfaite: ${Math.round((perfectMatches / totalImages) * 100)}%`)
    console.log(`   • Taux de correspondance totale: ${Math.round(((perfectMatches + goodMatches) / totalImages) * 100)}%`)
    
    if (perfectMatches === totalImages) {
      console.log('\n🎉 Toutes les images correspondent parfaitement aux IDs des produits!')
    } else if (perfectMatches + goodMatches === totalImages) {
      console.log('\n✅ Toutes les images ont une correspondance acceptable!')
    } else {
      console.log('\n⚠️ Certaines images ne correspondent pas aux produits.')
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter la vérification
verifyImageProductMapping()
