import fs from 'fs'
import path from 'path'

async function testImageAccessibility() {
  try {
    console.log('🖼️ Test d\'accessibilité des images')
    console.log('=' .repeat(50))
    
    const imagePath = 'public/images/robes/cmgvjs2ja0046zt8omfpswatb.jpg'
    const fallbackPath = 'public/images/robes/cmgv89opa0028ztywhjo2g2pl.png'
    
    console.log(`\n📁 Vérification des fichiers:`)
    
    // Vérifier si l'image JPG existe
    if (fs.existsSync(imagePath)) {
      const stats = fs.statSync(imagePath)
      console.log(`✅ Image JPG trouvée: ${imagePath}`)
      console.log(`   Taille: ${(stats.size / 1024).toFixed(2)} KB`)
      console.log(`   Modifiée: ${stats.mtime}`)
    } else {
      console.log(`❌ Image JPG non trouvée: ${imagePath}`)
    }
    
    // Vérifier si l'image PNG de fallback existe
    if (fs.existsSync(fallbackPath)) {
      const stats = fs.statSync(fallbackPath)
      console.log(`✅ Image PNG de fallback trouvée: ${fallbackPath}`)
      console.log(`   Taille: ${(stats.size / 1024).toFixed(2)} KB`)
      console.log(`   Modifiée: ${stats.mtime}`)
    } else {
      console.log(`❌ Image PNG de fallback non trouvée: ${fallbackPath}`)
    }
    
    // Lister toutes les images dans le dossier robes
    console.log(`\n📂 Toutes les images dans public/images/robes:`)
    const robesDir = 'public/images/robes'
    
    if (fs.existsSync(robesDir)) {
      const files = fs.readdirSync(robesDir)
      const imageFiles = files.filter(file => 
        file.toLowerCase().endsWith('.jpg') || 
        file.toLowerCase().endsWith('.jpeg') || 
        file.toLowerCase().endsWith('.png')
      )
      
      console.log(`   ${imageFiles.length} images trouvées:`)
      imageFiles.forEach((file, index) => {
        const filePath = path.join(robesDir, file)
        const stats = fs.statSync(filePath)
        const extension = file.split('.').pop().toLowerCase()
        console.log(`   ${index + 1}. ${file} (${extension}, ${(stats.size / 1024).toFixed(2)} KB)`)
      })
      
      // Vérifier spécifiquement les images de la robe soirée noire
      console.log(`\n🔍 Images de la robe soirée noire:`)
      const robeSoireeImages = imageFiles.filter(file => 
        file.includes('cmgvjs2ja0046zt8omfpswatb')
      )
      
      if (robeSoireeImages.length > 0) {
        robeSoireeImages.forEach(file => {
          const filePath = path.join(robesDir, file)
          const stats = fs.statSync(filePath)
          const extension = file.split('.').pop().toLowerCase()
          console.log(`   ✅ ${file} (${extension}, ${(stats.size / 1024).toFixed(2)} KB)`)
        })
      } else {
        console.log(`   ❌ Aucune image trouvée pour la robe soirée noire`)
      }
    } else {
      console.log(`❌ Dossier robes non trouvé: ${robesDir}`)
    }
    
    // Test de l'URL de l'image
    console.log(`\n🌐 URLs des images:`)
    console.log(`   Image JPG: /images/robes/cmgvjs2ja0046zt8omfpswatb.jpg`)
    console.log(`   Image PNG fallback: /images/robes/cmgv89opa0028ztywhjo2g2pl.png`)
    
    console.log(`\n💡 Suggestions:`)
    console.log(`   1. Vérifiez que le serveur Next.js est démarré`)
    console.log(`   2. Testez l'URL: http://localhost:3000/images/robes/cmgvjs2ja0046zt8omfpswatb.jpg`)
    console.log(`   3. Vérifiez la console du navigateur pour les erreurs 404`)
    console.log(`   4. Videz le cache du navigateur`)
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

// Exécuter le test
testImageAccessibility()
