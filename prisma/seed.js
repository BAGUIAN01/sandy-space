const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Créer les catégories
  const categories = await createCategories()
  
  // Créer les attributs
  const attributes = await createAttributes()
  
  // Créer les marques
  const brands = await createBrands()
  
  // Créer les produits (robes)
  const products = await createRobes(categories, attributes, brands)
  
  // Créer les variantes
  await createProductVariants(products, attributes)

  console.log('✅ Database seeding completed!')
}

async function createCategories() {
  console.log('📁 Creating categories...')
  
  const categories = [
    {
      name: 'Robes',
      slug: 'robes',
      description: 'Collection de robes élégantes pour toutes les occasions',
      image: '/images/categories/robes.jpg',
      order: 1,
      isActive: true
    },
    {
      name: 'Robes de Soirée',
      slug: 'robes-soiree',
      description: 'Robes sophistiquées pour les événements spéciaux',
      parentSlug: 'robes',
      order: 1,
      isActive: true
    },
    {
      name: 'Robes d\'Été',
      slug: 'robes-ete',
      description: 'Robes légères et confortables pour l\'été',
      parentSlug: 'robes',
      order: 2,
      isActive: true
    },
    {
      name: 'Robes Business',
      slug: 'robes-business',
      description: 'Robes professionnelles pour le bureau',
      parentSlug: 'robes',
      order: 3,
      isActive: true
    },
    {
      name: 'Robes Cocktail',
      slug: 'robes-cocktail',
      description: 'Robes cocktail pour les événements',
      parentSlug: 'robes',
      order: 4,
      isActive: true
    },
    {
      name: 'Robes Décontractées',
      slug: 'robes-decontractees',
      description: 'Robes confortables pour tous les jours',
      parentSlug: 'robes',
      order: 5,
      isActive: true
    },
    {
      name: 'Robes de Mariée',
      slug: 'robes-mariee',
      description: 'Robes de mariée romantiques et élégantes',
      parentSlug: 'robes',
      order: 6,
      isActive: true
    }
  ]

  const createdCategories = []
  
  for (const categoryData of categories) {
    const { parentSlug, ...data } = categoryData
    let parentId = null
    
    if (parentSlug) {
      const parent = createdCategories.find(c => c.slug === parentSlug)
      if (parent) parentId = parent.id
    }
    
    const category = await prisma.category.upsert({
      where: { slug: data.slug },
      update: data,
      create: { ...data, parentId }
    })
    
    createdCategories.push(category)
  }
  
  return createdCategories
}

async function createAttributes() {
  console.log('🏷️ Creating attributes...')
  
  const attributes = [
    {
      name: 'Taille',
      slug: 'taille',
      type: 'SIZE',
      values: [
        { value: 'XS', label: 'Extra Small', slug: 'xs' },
        { value: 'S', label: 'Small', slug: 's' },
        { value: 'M', label: 'Medium', slug: 'm' },
        { value: 'L', label: 'Large', slug: 'l' },
        { value: 'XL', label: 'Extra Large', slug: 'xl' },
        { value: 'XXL', label: 'Double Extra Large', slug: 'xxl' }
      ]
    },
    {
      name: 'Couleur',
      slug: 'couleur',
      type: 'COLOR',
      values: [
        { value: 'Noir', label: 'Noir', slug: 'noir', colorHex: '#000000' },
        { value: 'Blanc', label: 'Blanc', slug: 'blanc', colorHex: '#FFFFFF' },
        { value: 'Rouge', label: 'Rouge', slug: 'rouge', colorHex: '#DC2626' },
        { value: 'Rose', label: 'Rose', slug: 'rose', colorHex: '#EC4899' },
        { value: 'Bleu', label: 'Bleu', slug: 'bleu', colorHex: '#2563EB' },
        { value: 'Jaune', label: 'Jaune', slug: 'jaune', colorHex: '#EAB308' },
        { value: 'Gris', label: 'Gris', slug: 'gris', colorHex: '#6B7280' },
        { value: 'Marine', label: 'Marine', slug: 'marine', colorHex: '#1E3A8A' },
        { value: 'Or', label: 'Or', slug: 'or', colorHex: '#F59E0B' },
        { value: 'Beige', label: 'Beige', slug: 'beige', colorHex: '#F5F5DC' },
        { value: 'Ivoire', label: 'Ivoire', slug: 'ivoire', colorHex: '#FEFCE8' }
      ]
    },
    {
      name: 'Matière',
      slug: 'matiere',
      type: 'MATERIAL',
      values: [
        { value: 'Coton', label: 'Coton', slug: 'coton' },
        { value: 'Soie', label: 'Soie', slug: 'soie' },
        { value: 'Polyester', label: 'Polyester', slug: 'polyester' },
        { value: 'Viscose', label: 'Viscose', slug: 'viscose' },
        { value: 'Lin', label: 'Lin', slug: 'lin' },
        { value: 'Laine', label: 'Laine', slug: 'laine' }
      ]
    },
    {
      name: 'Style',
      slug: 'style',
      type: 'STYLE',
      values: [
        { value: 'Élégant', label: 'Élégant', slug: 'elegant' },
        { value: 'Décontracté', label: 'Décontracté', slug: 'decontracte' },
        { value: 'Romantique', label: 'Romantique', slug: 'romantique' },
        { value: 'Moderne', label: 'Moderne', slug: 'moderne' },
        { value: 'Vintage', label: 'Vintage', slug: 'vintage' },
        { value: 'Minimaliste', label: 'Minimaliste', slug: 'minimaliste' }
      ]
    }
  ]

  const createdAttributes = []
  
  for (const attrData of attributes) {
    const { values, ...data } = attrData
    
    const attribute = await prisma.attribute.upsert({
      where: { slug: data.slug },
      update: data,
      create: data
    })
    
    // Créer les valeurs d'attributs
    for (const valueData of values) {
      await prisma.attributeValue.upsert({
        where: { 
          attributeId_slug: {
            attributeId: attribute.id,
            slug: valueData.slug
          }
        },
        update: valueData,
        create: {
          ...valueData,
          attributeId: attribute.id
        }
      })
    }
    
    createdAttributes.push(attribute)
  }
  
  return createdAttributes
}

async function createBrands() {
  console.log('🏪 Creating brands...')
  
  const brands = [
    {
      name: 'Sandy Space',
      slug: 'sandy-space',
      description: 'Marque premium de mode féminine',
      logo: '/images/brands/sandy-space.png',
      website: 'https://sandy-space.com',
      isActive: true
    },
    {
      name: 'Élégance',
      slug: 'elegance',
      description: 'Robes de soirée sophistiquées',
      logo: '/images/brands/elegance.png',
      website: 'https://elegance.com',
      isActive: true
    },
    {
      name: 'Summer Vibes',
      slug: 'summer-vibes',
      description: 'Collection été moderne et confortable',
      logo: '/images/brands/summer-vibes.png',
      website: 'https://summer-vibes.com',
      isActive: true
    }
  ]

  const createdBrands = []
  
  for (const brandData of brands) {
    const brand = await prisma.brand.upsert({
      where: { slug: brandData.slug },
      update: brandData,
      create: brandData
    })
    
    createdBrands.push(brand)
  }
  
  return createdBrands
}

async function createRobes(categories, attributes, brands) {
  console.log('👗 Creating robes...')
  
  const robesData = [
    {
      name: "Robe Élégante Noire",
      slug: "robe-elegante-noire",
      description: "Robe élégante parfaite pour les occasions spéciales. Coupe ajustée avec une finition impeccable qui met en valeur votre silhouette. Idéale pour les soirées et événements importants.",
      shortDescription: "Robe élégante parfaite pour les occasions spéciales",
      basePrice: 89.99,
      compareAtPrice: 120.00,
      sku: "REB001",
      categorySlug: "robes-soiree",
      brandSlug: "sandy-space",
      isFeatured: true,
      images: ["/images/robes/image142-1_1-png202504140235061.png"],
      colors: ["Noir", "Rouge", "Bleu"],
      sizes: ["S", "M", "L", "XL"],
      materials: ["Soie", "Polyester"],
      styles: ["Élégant", "Moderne"]
    },
    {
      name: "Robe Été Florale",
      slug: "robe-ete-florale",
      description: "Robe légère et confortable pour l'été avec un motif floral délicat. Matière respirante qui vous garde au frais toute la journée. Parfaite pour les sorties décontractées.",
      shortDescription: "Robe légère et confortable pour l'été",
      basePrice: 65.99,
      compareAtPrice: 85.00,
      sku: "REF002",
      categorySlug: "robes-ete",
      brandSlug: "summer-vibes",
      isFeatured: true,
      images: ["/images/robes/image13-1_2-png202504140234401.png"],
      colors: ["Rose", "Blanc", "Jaune"],
      sizes: ["S", "M", "L"],
      materials: ["Coton", "Viscose"],
      styles: ["Décontracté", "Romantique"]
    },
    {
      name: "Robe Business",
      slug: "robe-business",
      description: "Robe professionnelle pour le bureau avec une coupe structurée. Élégante et confortable, elle vous accompagne lors de vos journées de travail avec style.",
      shortDescription: "Robe professionnelle pour le bureau",
      basePrice: 95.99,
      compareAtPrice: null,
      sku: "RB003",
      categorySlug: "robes-business",
      brandSlug: "sandy-space",
      isFeatured: true,
      images: ["/images/robes/image120-1_1-png202504140234221.png"],
      colors: ["Noir", "Gris", "Marine"],
      sizes: ["S", "M", "L", "XL"],
      materials: ["Polyester", "Viscose"],
      styles: ["Moderne", "Minimaliste"]
    },
    {
      name: "Robe Cocktail",
      slug: "robe-cocktail",
      description: "Robe cocktail sophistiquée pour les événements. Coupe ajustée avec des détails raffinés qui vous feront briller lors de vos soirées.",
      shortDescription: "Robe cocktail sophistiquée",
      basePrice: 75.99,
      compareAtPrice: 100.00,
      sku: "RC004",
      categorySlug: "robes-cocktail",
      brandSlug: "elegance",
      isFeatured: true,
      images: ["/images/robes/image118-1_1-png202504140234161.png"],
      colors: ["Rouge", "Noir", "Or"],
      sizes: ["S", "M", "L"],
      materials: ["Soie", "Polyester"],
      styles: ["Élégant", "Moderne"]
    },
    {
      name: "Robe de Mariée",
      slug: "robe-de-mariee",
      description: "Robe de mariée romantique et élégante. Finition délicate avec des détails raffinés pour votre jour le plus spécial. Créée avec amour pour votre bonheur.",
      shortDescription: "Robe de mariée romantique et élégante",
      basePrice: 299.99,
      compareAtPrice: 399.99,
      sku: "RM005",
      categorySlug: "robes-mariee",
      brandSlug: "elegance",
      isFeatured: true,
      images: ["/images/robes/image106-1_1-png202504140234181.png"],
      colors: ["Blanc", "Ivoire"],
      sizes: ["S", "M", "L"],
      materials: ["Soie", "Dentelle"],
      styles: ["Romantique", "Élégant"]
    },
    {
      name: "Robe Décontractée",
      slug: "robe-decontractee",
      description: "Robe confortable pour tous les jours. Coupe ample et matière douce qui vous accompagne dans votre quotidien avec style et confort.",
      shortDescription: "Robe confortable pour tous les jours",
      basePrice: 45.99,
      compareAtPrice: null,
      sku: "RD006",
      categorySlug: "robes-decontractees",
      brandSlug: "summer-vibes",
      isFeatured: true,
      images: ["/images/robes/image109-1_1-png202504140234021.png"],
      colors: ["Blanc", "Beige", "Rose"],
      sizes: ["S", "M", "L", "XL"],
      materials: ["Coton", "Lin"],
      styles: ["Décontracté", "Minimaliste"]
    }
  ]

  const createdProducts = []
  
  for (const robeData of robesData) {
    const { 
      categorySlug, 
      brandSlug, 
      images, 
      colors, 
      sizes, 
      materials, 
      styles,
      ...productData 
    } = robeData
    
    // Trouver la catégorie et la marque
    const category = categories.find(c => c.slug === categorySlug)
    const brand = brands.find(b => b.slug === brandSlug)
    
    if (!category) {
      console.warn(`Category not found: ${categorySlug}`)
      continue
    }
    
    // Créer le produit
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {
        ...productData,
        categoryId: category.id,
        brandId: brand?.id,
        status: 'ACTIVE',
        isActive: true,
        publishedAt: new Date()
      },
      create: {
        ...productData,
        categoryId: category.id,
        brandId: brand?.id,
        status: 'ACTIVE',
        isActive: true,
        publishedAt: new Date()
      }
    })
    
    // Ajouter les images
    for (let i = 0; i < images.length; i++) {
      // Vérifier si l'image existe déjà
      const existingImage = await prisma.productImage.findFirst({
        where: {
          productId: product.id,
          url: images[i]
        }
      })
      
      if (!existingImage) {
        await prisma.productImage.create({
          data: {
            url: images[i],
            alt: `${product.name} - Image ${i + 1}`,
            order: i,
            isPrimary: i === 0,
            productId: product.id
          }
        })
      }
    }
    
    createdProducts.push(product)
  }
  
  return createdProducts
}

async function createProductVariants(products, attributes) {
  console.log('🔄 Creating product variants...')
  
  const colorAttr = attributes.find(a => a.slug === 'couleur')
  const sizeAttr = attributes.find(a => a.slug === 'taille')
  
  if (!colorAttr || !sizeAttr) {
    console.warn('Color or size attribute not found')
    return
  }
  
  // Récupérer les valeurs d'attributs
  const colorValues = await prisma.attributeValue.findMany({
    where: { attributeId: colorAttr.id }
  })
  
  const sizeValues = await prisma.attributeValue.findMany({
    where: { attributeId: sizeAttr.id }
  })
  
  for (const product of products) {
    // Récupérer le produit avec ses données
    const fullProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        images: true
      }
    })
    
    if (!fullProduct) continue
    
    // Créer des variantes par défaut pour chaque produit
    const variantSku = `${product.sku}-DEFAULT`
    
    // Vérifier si la variante existe déjà
    const existingVariant = await prisma.productVariant.findUnique({
      where: { sku: variantSku }
    })
    
    let defaultVariant
    if (existingVariant) {
      defaultVariant = existingVariant
    } else {
      defaultVariant = await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: variantSku,
          price: fullProduct.basePrice,
          compareAtPrice: fullProduct.compareAtPrice,
          stock: Math.floor(Math.random() * 50) + 10,
          isActive: true,
          isDefault: true
        }
      })
    }
    
    // Ajouter les attributs à la variante par défaut
    // Couleur par défaut (première couleur disponible)
    const defaultColor = colorValues[0]
    if (defaultColor) {
      // Vérifier si l'attribut existe déjà
      const existingColorAttr = await prisma.variantAttribute.findFirst({
        where: {
          variantId: defaultVariant.id,
          attributeValueId: defaultColor.id
        }
      })
      
      if (!existingColorAttr) {
        await prisma.variantAttribute.create({
          data: {
            variantId: defaultVariant.id,
            attributeValueId: defaultColor.id
          }
        })
      }
    }
    
    // Taille par défaut (M)
    const defaultSize = sizeValues.find(s => s.slug === 'm')
    if (defaultSize) {
      // Vérifier si l'attribut existe déjà
      const existingSizeAttr = await prisma.variantAttribute.findFirst({
        where: {
          variantId: defaultVariant.id,
          attributeValueId: defaultSize.id
        }
      })
      
      if (!existingSizeAttr) {
        await prisma.variantAttribute.create({
          data: {
            variantId: defaultVariant.id,
            attributeValueId: defaultSize.id
          }
        })
      }
    }
  }
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
