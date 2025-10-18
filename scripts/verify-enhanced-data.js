import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyEnhancedData() {
  try {
    console.log('🔍 Vérification des données améliorées...')
    
    // Vérifier les catégories
    const categories = await prisma.category.findMany({
      include: {
        children: true
      }
    })
    console.log(`📁 Catégories: ${categories.length}`)
    categories.forEach(cat => {
      console.log(`   • ${cat.name} (${cat.slug}) - ${cat.children.length} sous-catégories`)
    })
    
    // Vérifier les marques
    const brands = await prisma.brand.findMany()
    console.log(`\n🏪 Marques: ${brands.length}`)
    brands.forEach(brand => {
      console.log(`   • ${brand.name} (${brand.slug})`)
    })
    
    // Vérifier les attributs
    const attributes = await prisma.attribute.findMany({
      include: {
        values: true
      }
    })
    console.log(`\n🏷️ Attributs: ${attributes.length}`)
    attributes.forEach(attr => {
      console.log(`   • ${attr.name} (${attr.type}) - ${attr.values.length} valeurs`)
    })
    
    // Vérifier les produits
    const products = await prisma.product.findMany({
      include: {
        images: true,
        variants: true,
        category: true,
        brand: true
      }
    })
    console.log(`\n👗 Produits: ${products.length}`)
    products.forEach(product => {
      console.log(`   • ${product.name}`)
      console.log(`     Prix: ${product.basePrice} ${product.currency}`)
      console.log(`     Catégorie: ${product.category.name}`)
      console.log(`     Marque: ${product.brand?.name || 'N/A'}`)
      console.log(`     Images: ${product.images.length}`)
      console.log(`     Variantes: ${product.variants.length}`)
    })
    
    // Vérifier les variantes
    const variants = await prisma.productVariant.findMany({
      include: {
        attributes: {
          include: {
            attributeValue: true
          }
        }
      }
    })
    console.log(`\n🔄 Variantes: ${variants.length}`)
    
    // Statistiques des prix
    const priceStats = await prisma.product.aggregate({
      _min: { basePrice: true },
      _max: { basePrice: true },
      _avg: { basePrice: true },
      _count: { basePrice: true }
    })
    
    console.log(`\n💰 Statistiques des prix (FCFA):`)
    console.log(`   • Prix minimum: ${priceStats._min.basePrice}`)
    console.log(`   • Prix maximum: ${priceStats._max.basePrice}`)
    console.log(`   • Prix moyen: ${Math.round(priceStats._avg.basePrice)}`)
    console.log(`   • Nombre de produits: ${priceStats._count.basePrice}`)
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter la vérification
verifyEnhancedData()
