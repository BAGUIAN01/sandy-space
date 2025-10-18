import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

async function finalizeImageRename() {
  try {
    console.log('🔄 Finalisation du renommage des images...')
    
    const sourceDir = path.join(__dirname, '..', 'public', 'images', 'robes-renamed')
    const destDir = path.join(__dirname, '..', 'public', 'images', 'robes')
    
    if (!fs.existsSync(sourceDir)) {
      console.log('❌ Dossier source robes-renamed n\'existe pas')
      return
    }
    
    // Créer un backup de l'ancien dossier
    const backupDir = path.join(__dirname, '..', 'public', 'images', 'robes-backup')
    if (fs.existsSync(destDir) && !fs.existsSync(backupDir)) {
      fs.renameSync(destDir, backupDir)
      console.log(`📁 Backup créé: ${backupDir}`)
    }
    
    // Créer le nouveau dossier robes
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
      console.log(`📁 Nouveau dossier créé: ${destDir}`)
    }
    
    // Déplacer toutes les images renommées
    const renamedFiles = fs.readdirSync(sourceDir).filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.png', '.jpg', '.jpeg'].includes(ext)
    })
    
    console.log(`🔄 Déplacement de ${renamedFiles.length} images...`)
    
    let movedCount = 0
    for (const file of renamedFiles) {
      const sourcePath = path.join(sourceDir, file)
      const destPath = path.join(destDir, file)
      
      try {
        fs.copyFileSync(sourcePath, destPath)
        console.log(`   ✅ ${file}`)
        movedCount++
      } catch (error) {
        console.log(`   ❌ Erreur pour ${file}: ${error.message}`)
      }
    }
    
    // Mettre à jour les chemins dans la base de données
    console.log(`\n🔄 Mise à jour des chemins dans la base de données...`)
    
    const products = await prisma.product.findMany({
      include: { images: true }
    })
    
    let updatedCount = 0
    for (const product of products) {
      for (const image of product.images) {
        if (image.url.includes('/images/robes-renamed/')) {
          const newUrl = image.url.replace('/images/robes-renamed/', '/images/robes/')
          
          await prisma.productImage.update({
            where: { id: image.id },
            data: { url: newUrl }
          })
          
          console.log(`   ✅ ${product.name}: ${newUrl}`)
          updatedCount++
        }
      }
    }
    
    // Vérification finale
    console.log(`\n🔍 Vérification finale...`)
    
    const finalProducts = await prisma.product.findMany({
      include: { images: true }
    })
    
    let perfectMatches = 0
    let totalImages = 0
    
    for (const product of finalProducts) {
      if (product.images && product.images.length > 0) {
        for (const image of product.images) {
          totalImages++
          const fileName = path.basename(image.url)
          const fileId = fileName.split('.')[0]
          
          if (fileId === product.id) {
            perfectMatches++
          }
        }
      }
    }
    
    console.log(`\n📊 Résumé final:`)
    console.log(`   • Images déplacées: ${movedCount}`)
    console.log(`   • Chemins mis à jour: ${updatedCount}`)
    console.log(`   • Correspondances parfaites: ${perfectMatches}/${totalImages}`)
    console.log(`   • Taux de correspondance: ${Math.round((perfectMatches / totalImages) * 100)}%`)
    
    // Nettoyer le dossier temporaire
    console.log(`\n🧹 Nettoyage du dossier temporaire...`)
    try {
      fs.rmSync(sourceDir, { recursive: true, force: true })
      console.log(`   ✅ Dossier robes-renamed supprimé`)
    } catch (error) {
      console.log(`   ⚠️ Impossible de supprimer robes-renamed: ${error.message}`)
    }
    
    console.log(`\n🎉 Finalisation terminée!`)
    console.log(`   • Images dans /images/robes/ avec IDs exacts`)
    console.log(`   • Base de données mise à jour`)
    console.log(`   • Backup dans /images/robes-backup/`)
    
    if (perfectMatches === totalImages) {
      console.log(`\n🎊 PARFAIT! Toutes les images correspondent exactement aux IDs!`)
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la finalisation:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter la finalisation
finalizeImageRename()
