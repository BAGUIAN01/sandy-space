import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

async function finalVerification() {
  try {
    console.log('🎯 VÉRIFICATION FINALE - Images avec IDs exacts')
    console.log('=' .repeat(60))
    
    // Récupérer tous les produits
    const products = await prisma.product.findMany({
      include: {
        images: true,
        category: true,
        brand: true
      },
      orderBy: { name: 'asc' }
    })
    
    console.log(`\n📦 PRODUITS:`)
    console.log(`   • Total: ${products.length}`)
    
    // Vérifier le dossier robes
    const robesDir = path.join(__dirname, '..', 'public', 'images', 'robes')
    const imageFiles = fs.readdirSync(robesDir).filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.png', '.jpg', '.jpeg'].includes(ext)
    })
    
    console.log(`\n📁 DOSSIER /images/robes:`)
    console.log(`   • Images présentes: ${imageFiles.length}`)
    
    // Vérifier chaque produit
    console.log(`\n🔍 VÉRIFICATION DÉTAILLÉE:`)
    console.log('=' .repeat(80))
    
    let perfectMatches = 0
    let totalImages = 0
    let existingFiles = 0
    
    for (const product of products) {
      console.log(`\n🏷️ ${product.name}`)
      console.log(`   ID: ${product.id}`)
      console.log(`   Slug: ${product.slug}`)
      console.log(`   Catégorie: ${product.category.name}`)
      
      if (product.images && product.images.length > 0) {
        totalImages += product.images.length
        
        for (let i = 0; i < product.images.length; i++) {
          const image = product.images[i]
          console.log(`   Image ${i + 1}: ${image.url}`)
          
          // Vérifier la correspondance avec l'ID
          const fileName = path.basename(image.url)
          const fileId = fileName.split('.')[0]
          
          if (fileId === product.id) {
            console.log(`     ✅ Correspondance parfaite avec l'ID`)
            perfectMatches++
          } else {
            console.log(`     ❌ Pas de correspondance (attendu: ${product.id})`)
          }
          
          // Vérifier l'existence du fichier
          const imagePath = path.join(__dirname, '..', 'public', image.url)
          if (fs.existsSync(imagePath)) {
            console.log(`     ✅ Fichier existe`)
            existingFiles++
          } else {
            console.log(`     ❌ Fichier manquant`)
          }
        }
      } else {
        console.log(`   ❌ Aucune image`)
      }
    }
    
    // Résumé
    console.log(`\n📊 RÉSUMÉ FINAL:`)
    console.log('=' .repeat(40))
    console.log(`   • Produits: ${products.length}`)
    console.log(`   • Images en base: ${totalImages}`)
    console.log(`   • Images dans le dossier: ${imageFiles.length}`)
    console.log(`   • Correspondances parfaites: ${perfectMatches}`)
    console.log(`   • Fichiers existants: ${existingFiles}`)
    console.log(`   • Taux de correspondance: ${Math.round((perfectMatches / totalImages) * 100)}%`)
    console.log(`   • Taux d'existence: ${Math.round((existingFiles / totalImages) * 100)}%`)
    
    // Exemples d'URLs
    console.log(`\n💡 EXEMPLES D'URLS FINALES:`)
    for (let i = 0; i < Math.min(5, products.length); i++) {
      const product = products[i]
      if (product.images && product.images.length > 0) {
        console.log(`   • ${product.name}: ${product.images[0].url}`)
      }
    }
    
    // Vérifier le backup
    const backupDir = path.join(__dirname, '..', 'public', 'images', 'robes-backup')
    if (fs.existsSync(backupDir)) {
      const backupFiles = fs.readdirSync(backupDir).filter(file => {
        const ext = path.extname(file).toLowerCase()
        return ['.png', '.jpg', '.jpeg'].includes(ext)
      })
      console.log(`\n📦 BACKUP:`)
      console.log(`   • Images sauvegardées: ${backupFiles.length}`)
      console.log(`   • Dossier: /images/robes-backup/`)
    }
    
    // Instructions d'utilisation
    console.log(`\n🚀 UTILISATION:`)
    console.log(`   // Dans vos composants React:`)
    console.log(`   <Image src={product.images?.[0]?.url} alt={product.name} />`)
    console.log(`   `)
    console.log(`   // Les URLs seront automatiquement:`)
    console.log(`   /images/robes/cmgv8dfxd002gztb8emjy5nk3.png`)
    console.log(`   /images/robes/cmgvjs1ji003qzt8ogmqiecg4.jpg`)
    console.log(`   etc...`)
    
    if (perfectMatches === totalImages && existingFiles === totalImages) {
      console.log(`\n🎊 MISSION ACCOMPLIE!`)
      console.log(`   ✅ Toutes les images correspondent exactement aux IDs`)
      console.log(`   ✅ Tous les fichiers existent`)
      console.log(`   ✅ Base de données mise à jour`)
      console.log(`   ✅ Structure parfaite pour l'utilisation`)
    } else {
      console.log(`\n⚠️ Des problèmes persistent.`)
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification finale:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter la vérification finale
finalVerification()
