const fs = require('fs')
const path = require('path')

// IDs des robes de la base de données
const robeIds = [
  'cmgv89opa0028ztywhjo2g2pl', // Robe Élégante Noire
  'cmgv8dfoz002cztb8v0s16ggb', // Robe Été Florale
  'cmgv8dfxd002gztb8emjy5nk3', // Robe Business
  'cmgv8dg63002kztb88jwasl2v', // Robe Cocktail
  'cmgv8dgen002oztb8tx4ypkxq', // Robe de Mariée
  'cmgv8dgn2002sztb8bmkwigxy'  // Robe Décontractée
]

// Images disponibles
const imageFiles = [
  'image13-1_2-png202504140234401.png',
  'image14-1_2-png202504140235031.png',
  'image21-1_2-png202504140234521.png',
  'image105-1_1-png202504140233591.png',
  'image106-1_1-png202504140234181.png',
  'image109-1_1-png202504140234021.png'
]

const sourceDir = path.join(__dirname, '..', 'public', 'images', 'robes')
const backupDir = path.join(__dirname, '..', 'public', 'images', 'robes', 'backup')

async function renameImages() {
  try {
    // Créer le dossier backup
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
      console.log('Dossier backup créé:', backupDir)
    }

    // Renommer les images
    for (let i = 0; i < Math.min(robeIds.length, imageFiles.length); i++) {
      const oldPath = path.join(sourceDir, imageFiles[i])
      const newPath = path.join(sourceDir, `${robeIds[i]}.png`)
      const backupPath = path.join(backupDir, imageFiles[i])

      if (fs.existsSync(oldPath)) {
        // Créer une copie de sauvegarde
        fs.copyFileSync(oldPath, backupPath)
        console.log(`Sauvegarde: ${imageFiles[i]} -> backup/`)

        // Renommer le fichier
        fs.renameSync(oldPath, newPath)
        console.log(`Renommé: ${imageFiles[i]} -> ${robeIds[i]}.png`)
      } else {
        console.log(`Fichier non trouvé: ${oldPath}`)
      }
    }

    console.log('\nRenommage terminé!')
    console.log('Fichiers renommés:')
    robeIds.forEach((id, index) => {
      if (index < imageFiles.length) {
        console.log(`${index + 1}. ${id}.png (était ${imageFiles[index]})`)
      }
    })

  } catch (error) {
    console.error('Erreur lors du renommage:', error)
  }
}

renameImages()
