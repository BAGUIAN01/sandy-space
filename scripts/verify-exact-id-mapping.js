import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

async function verifyExactIdMapping() {
  try {
    console.log('🔍 Vérification du mapping exact des IDs...')
    
    // Récupérer tous les produits avec leurs images
    const products = await prisma.product.findMany({
      include: {
        images: true,
        category: true,
        brand: true
      },
      orderBy: { name: 'asc' }
    })
    
    console.log(`📊 Total des produits: ${products.length}`)
    console.log('\n📋 Vérification du mapping:')
    console.log('=' .repeat(80))
    
    let perfectMatches = 0
    let totalImages = 0
    let existingFiles = 0
    let missingFiles = 0
    
    for (const product of products) {
      console.log(`\n🏷️ ${product.name}`)
      console.log(`   ID: ${product.id}`)
      console.log(`   Slug: ${product.slug}`)
      console.log(`   Catégorie: ${product.category.name}`)
      console.log(`   Marque: ${product.brand?.name || 'N/A'}`)
      
      if (product.images && product.images.length > 0) {
        totalImages += product.images.length
        
        for (let i = 0; i < product.images.length; i++) {
          const image = product.images[i]
          console.log(`   Image ${i + 1}: ${image.url}`)
          
          // Vérifier si le nom du fichier correspond exactement à l'ID
          const fileName = path.basename(image.url)
          const fileId = fileName.split('.')[0] // Enlever l'extension
          
          if (fileId === product.id) {
            console.log(`     ✅ Correspondance parfaite avec l'ID`)
            perfectMatches++
          } else {
            console.log(`     ❌ Pas de correspondance (attendu: ${product.id})`)
          }
          
          // Vérifier si le fichier existe
          const imagePath = path.join(__dirname, '..', 'public', image.url)
          if (fs.existsSync(imagePath)) {
            console.log(`     ✅ Fichier existe`)
            existingFiles++
          } else {
            console.log(`     ❌ Fichier manquant`)
            missingFiles++
          }
        }
      } else {
        console.log(`   ❌ Aucune image`)
      }
    }
    
    console.log(`\n📊 Résumé:`)
    console.log(`   • Total des images: ${totalImages}`)
    console.log(`   • Correspondances parfaites: ${perfectMatches}`)
    console.log(`   • Fichiers existants: ${existingFiles}`)
    console.log(`   • Fichiers manquants: ${missingFiles}`)
    console.log(`   • Taux de correspondance: ${Math.round((perfectMatches / totalImages) * 100)}%`)
    console.log(`   • Taux d'existence: ${Math.round((existingFiles / totalImages) * 100)}%`)
    
    // Vérifier le dossier robes-renamed
    console.log(`\n📁 Vérification du dossier robes-renamed:`)
    const renamedDir = path.join(__dirname, '..', 'public', 'images', 'robes-renamed')
    
    if (fs.existsSync(renamedDir)) {
      const renamedFiles = fs.readdirSync(renamedDir).filter(file => {
        const ext = path.extname(file).toLowerCase()
        return ['.png', '.jpg', '.jpeg'].includes(ext)
      })
      
      console.log(`   • Images renommées: ${renamedFiles.length}`)
      
      // Vérifier que chaque fichier correspond à un produit
      let matchedFiles = 0
      for (const file of renamedFiles) {
        const fileId = file.split('.')[0]
        const matchingProduct = products.find(p => p.id === fileId)
        if (matchingProduct) {
          matchedFiles++
        }
      }
      
      console.log(`   • Fichiers correspondants: ${matchedFiles}`)
      console.log(`   • Taux de correspondance: ${Math.round((matchedFiles / renamedFiles.length) * 100)}%`)
    } else {
      console.log(`   ❌ Dossier robes-renamed n'existe pas`)
    }
    
    // Exemples d'utilisation
    console.log(`\n💡 Exemples d'utilisation:`)
    console.log(`   // Dans le code, utiliser:`)
    console.log(`   src={product.images?.[0]?.url}`)
    console.log(`   `)
    console.log(`   // Les URLs seront:`)
    console.log(`   /images/robes-renamed/cmgv8dfxd002gztb8emjy5nk3.png`)
    console.log(`   /images/robes-renamed/cmgvjs1ji003qzt8ogmqiecg4.jpg`)
    console.log(`   etc...`)
    
    if (perfectMatches === totalImages && missingFiles === 0) {
      console.log(`\n🎉 PARFAIT! Toutes les images correspondent exactement aux IDs des produits!`)
    } else {
      console.log(`\n⚠️ Des améliorations sont encore nécessaires.`)
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter la vérification
verifyExactIdMapping()
