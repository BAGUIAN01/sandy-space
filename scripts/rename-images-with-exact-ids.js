import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

async function renameImagesWithExactIds() {
  try {
    console.log('🔄 Renommage des images avec les IDs exacts des produits...')
    
    // Récupérer tous les produits avec leurs images
    const products = await prisma.product.findMany({
      include: {
        images: true
      },
      orderBy: { name: 'asc' }
    })
    
    console.log(`📊 Total des produits: ${products.length}`)
    
    // Dossier source et destination
    const sourceDir = path.join(__dirname, '..', 'public', 'images', 'robes')
    const destDir = path.join(__dirname, '..', 'public', 'images', 'robes-renamed')
    
    // Créer le dossier de destination s'il n'existe pas
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
      console.log(`📁 Dossier créé: ${destDir}`)
    }
    
    // Lister toutes les images disponibles dans le dossier robes
    const availableImages = fs.readdirSync(sourceDir).filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.png', '.jpg', '.jpeg'].includes(ext)
    })
    
    console.log(`🖼️ Images disponibles: ${availableImages.length}`)
    
    let renamedCount = 0
    let skippedCount = 0
    
    // Créer un mapping des produits avec leurs images
    const productImageMapping = []
    
    for (const product of products) {
      console.log(`\n🏷️ ${product.name}`)
      console.log(`   ID: ${product.id}`)
      console.log(`   Slug: ${product.slug}`)
      
      // Chercher une image correspondante
      let imageToUse = null
      
      // 1. Chercher une image qui contient déjà l'ID
      const existingImageWithId = availableImages.find(img => 
        img.includes(product.id) || img.startsWith(product.id)
      )
      
      if (existingImageWithId) {
        imageToUse = existingImageWithId
        console.log(`   ✅ Image existante avec ID: ${existingImageWithId}`)
      } else {
        // 2. Chercher une image qui contient le slug
        const imageWithSlug = availableImages.find(img => 
          img.includes(product.slug) || img.includes(product.slug.replace(/-/g, '_'))
        )
        
        if (imageWithSlug) {
          imageToUse = imageWithSlug
          console.log(`   ⚠️ Image avec slug: ${imageWithSlug}`)
        } else {
          // 3. Prendre la première image disponible
          if (availableImages.length > 0) {
            imageToUse = availableImages[renamedCount % availableImages.length]
            console.log(`   🔄 Image assignée: ${imageToUse}`)
          }
        }
      }
      
      if (imageToUse) {
        const sourcePath = path.join(sourceDir, imageToUse)
        const ext = path.extname(imageToUse)
        const newFileName = `${product.id}${ext}`
        const destPath = path.join(destDir, newFileName)
        
        try {
          // Copier l'image avec le nouveau nom
          fs.copyFileSync(sourcePath, destPath)
          console.log(`   ✅ Renommée: ${imageToUse} → ${newFileName}`)
          
          productImageMapping.push({
            productId: product.id,
            productSlug: product.slug,
            productName: product.name,
            originalImage: imageToUse,
            newImage: newFileName,
            imagePath: `/images/robes-renamed/${newFileName}`
          })
          
          renamedCount++
        } catch (error) {
          console.log(`   ❌ Erreur: ${error.message}`)
          skippedCount++
        }
      } else {
        console.log(`   ⚠️ Aucune image disponible`)
        skippedCount++
      }
    }
    
    // Sauvegarder le mapping
    const mappingFile = path.join(destDir, 'product-image-mapping.json')
    fs.writeFileSync(mappingFile, JSON.stringify(productImageMapping, null, 2))
    
    console.log(`\n📊 Résumé:`)
    console.log(`   • Images renommées: ${renamedCount}`)
    console.log(`   • Images ignorées: ${skippedCount}`)
    console.log(`   • Mapping sauvegardé: ${mappingFile}`)
    
    // Mettre à jour la base de données avec les nouveaux chemins d'images
    console.log(`\n🔄 Mise à jour de la base de données...`)
    
    let updatedProducts = 0
    
    for (const mapping of productImageMapping) {
      try {
        // Supprimer les anciennes images du produit
        await prisma.productImage.deleteMany({
          where: { productId: mapping.productId }
        })
        
        // Créer la nouvelle image
        await prisma.productImage.create({
          data: {
            url: mapping.imagePath,
            alt: `${mapping.productName} - Image principale`,
            order: 0,
            isPrimary: true,
            productId: mapping.productId
          }
        })
        
        console.log(`   ✅ ${mapping.productName}: ${mapping.imagePath}`)
        updatedProducts++
      } catch (error) {
        console.log(`   ❌ Erreur pour ${mapping.productName}: ${error.message}`)
      }
    }
    
    console.log(`\n🎉 Terminé!`)
    console.log(`   • Images renommées: ${renamedCount}`)
    console.log(`   • Produits mis à jour: ${updatedProducts}`)
    console.log(`   • Dossier: ${destDir}`)
    
  } catch (error) {
    console.error('❌ Erreur lors du renommage:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter le renommage
renameImagesWithExactIds()
