const fs = require('fs')
const path = require('path')

// Script pour renommer les images selon les IDs des produits
async function renameImagesToProductIds() {
  console.log('🖼️ Renaming images to match product IDs...')
  
  const robesDir = path.join(__dirname, '../public/images/robes')
  const sacsDir = path.join(__dirname, '../public/images/sac-a-main')
  
  // Mapping des produits avec leurs images correspondantes
  const productImageMapping = [
    {
      productId: 'robe-elegante-noire',
      imageFile: 'image142-1_1-png202504140235061.png',
      newName: 'robe-elegante-noire-1.png'
    },
    {
      productId: 'robe-ete-florale',
      imageFile: 'image13-1_2-png202504140234401.png',
      newName: 'robe-ete-florale-1.png'
    },
    {
      productId: 'robe-business',
      imageFile: 'image120-1_1-png202504140234221.png',
      newName: 'robe-business-1.png'
    },
    {
      productId: 'robe-cocktail',
      imageFile: 'image118-1_1-png202504140234161.png',
      newName: 'robe-cocktail-1.png'
    },
    {
      productId: 'robe-de-mariee',
      imageFile: 'image106-1_1-png202504140234181.png',
      newName: 'robe-de-mariee-1.png'
    },
    {
      productId: 'robe-decontractee',
      imageFile: 'image109-1_1-png202504140234021.png',
      newName: 'robe-decontractee-1.png'
    },
    {
      productId: 'robe-soiree-rouge',
      imageFile: 'image121-1_1-png202504140234241.png',
      newName: 'robe-soiree-rouge-1.png'
    },
    {
      productId: 'robe-ete-pastel',
      imageFile: 'image125-1_1-png202504140234301.png',
      newName: 'robe-ete-pastel-1.png'
    },
    {
      productId: 'robe-business-marine',
      imageFile: 'image126-1_1-png202504140234321.png',
      newName: 'robe-business-marine-1.png'
    },
    {
      productId: 'robe-cocktail-doree',
      imageFile: 'image128-1_1-png202504140234361.png',
      newName: 'robe-cocktail-doree-1.png'
    },
    {
      productId: 'robe-mariee-princesse',
      imageFile: 'image131-1_1-png202504140234441.png',
      newName: 'robe-mariee-princesse-1.png'
    },
    {
      productId: 'robe-decontractee-oversized',
      imageFile: 'image132-1_1-png202504140234461.png',
      newName: 'robe-decontractee-oversized-1.png'
    },
    {
      productId: 'robe-soiree-noire',
      imageFile: 'image138-1_1-png202504140234561.png',
      newName: 'robe-soiree-noire-1.png'
    },
    {
      productId: 'robe-ete-boheme',
      imageFile: 'image139-1_1-png202504140234581.png',
      newName: 'robe-ete-boheme-1.png'
    },
    {
      productId: 'robe-business-minimaliste',
      imageFile: 'image140-1_1-png202504140235041.png',
      newName: 'robe-business-minimaliste-1.png'
    },
    {
      productId: 'robe-cocktail-moderne',
      imageFile: 'image141-1_1-png202504140235001.png',
      newName: 'robe-cocktail-moderne-1.png'
    }
  ]
  
  // Créer un dossier pour les nouvelles images
  const newImagesDir = path.join(__dirname, '../public/images/products')
  if (!fs.existsSync(newImagesDir)) {
    fs.mkdirSync(newImagesDir, { recursive: true })
  }
  
  let renamedCount = 0
  
  for (const mapping of productImageMapping) {
    const sourcePath = path.join(robesDir, mapping.imageFile)
    const destPath = path.join(newImagesDir, mapping.newName)
    
    try {
      if (fs.existsSync(sourcePath)) {
        // Copier le fichier avec le nouveau nom
        fs.copyFileSync(sourcePath, destPath)
        console.log(`✅ Renamed: ${mapping.imageFile} → ${mapping.newName}`)
        renamedCount++
      } else {
        console.warn(`⚠️ Source file not found: ${mapping.imageFile}`)
      }
    } catch (error) {
      console.error(`❌ Error renaming ${mapping.imageFile}:`, error.message)
    }
  }
  
  console.log(`🎉 Renamed ${renamedCount} images successfully!`)
  console.log(`📁 New images location: ${newImagesDir}`)
  
  // Générer un fichier de mapping pour référence
  const mappingFile = path.join(newImagesDir, 'image-mapping.json')
  fs.writeFileSync(mappingFile, JSON.stringify(productImageMapping, null, 2))
  console.log(`📄 Mapping file created: ${mappingFile}`)
}

// Exécuter le script
renameImagesToProductIds()
  .catch(console.error)
