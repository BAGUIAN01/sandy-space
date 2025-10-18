const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting enhanced database seeding with FCFA prices...')

  // Créer les catégories
  const categories = await createCategories()
  
  // Créer les attributs
  const attributes = await createAttributes()
  
  // Créer les marques
  const brands = await createBrands()
  
  // Créer les produits (robes) avec plus de données
  const products = await createRobes(categories, attributes, brands)
  
  // Créer les variantes
  await createProductVariants(products, attributes)

  console.log('✅ Enhanced database seeding completed!')
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
    },
    {
      name: 'Sacs à Main',
      slug: 'sacs-main',
      description: 'Sacs à main élégants et pratiques',
      image: '/images/categories/sacs.jpg',
      order: 2,
      isActive: true
    },
    {
      name: 'Accessoires',
      slug: 'accessoires',
      description: 'Accessoires de mode pour compléter votre look',
      image: '/images/categories/accessoires.jpg',
      order: 3,
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
      update: { ...data, parentId },
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
      name: 'Couleur',
      slug: 'couleur',
      type: 'COLOR',
      isVariant: true,
      isFilter: true,
      order: 1,
      values: [
        'Noir', 'Blanc', 'Rouge', 'Bleu', 'Rose', 'Jaune', 'Vert', 'Gris', 
        'Marine', 'Or', 'Argent', 'Beige', 'Ivoire', 'Bordeaux', 'Violet', 'Orange'
      ]
    },
    {
      name: 'Taille',
      slug: 'taille',
      type: 'SIZE',
      isVariant: true,
      isFilter: true,
      order: 2,
      values: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    {
      name: 'Matière',
      slug: 'matiere',
      type: 'MATERIAL',
      isVariant: false,
      isFilter: true,
      order: 3,
      values: ['Coton', 'Soie', 'Polyester', 'Viscose', 'Lin', 'Dentelle', 'Satin', 'Crêpe']
    },
    {
      name: 'Style',
      slug: 'style',
      type: 'STYLE',
      isVariant: false,
      isFilter: true,
      order: 4,
      values: ['Élégant', 'Moderne', 'Romantique', 'Décontracté', 'Minimaliste', 'Vintage', 'Bohème']
    }
  ]

  const createdAttributes = []
  
  for (const attrData of attributes) {
    const { values, ...attributeData } = attrData
    
    const attribute = await prisma.attribute.upsert({
      where: { slug: attributeData.slug },
      update: attributeData,
      create: attributeData
    })
    
    // Créer les valeurs d'attributs
    for (let i = 0; i < values.length; i++) {
      const value = values[i]
      const slug = value.toLowerCase().replace(/\s+/g, '-')
      
      await prisma.attributeValue.upsert({
        where: {
          attributeId_slug: {
            attributeId: attribute.id,
            slug: slug
          }
        },
        update: { 
          value,
          label: value,
          slug: slug,
          order: i
        },
        create: {
          attributeId: attribute.id,
          value: value,
          label: value,
          slug: slug,
          order: i
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
    },
    {
      name: 'Chic & Co',
      slug: 'chic-co',
      description: 'Mode urbaine et tendance',
      logo: '/images/brands/chic-co.png',
      website: 'https://chic-co.com',
      isActive: true
    },
    {
      name: 'Luxe Mode',
      slug: 'luxe-mode',
      description: 'Haute couture et luxe',
      logo: '/images/brands/luxe-mode.png',
      website: 'https://luxe-mode.com',
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
  console.log('👗 Creating robes with FCFA prices...')
  
  // Conversion EUR vers FCFA (1 EUR = 655 FCFA)
  const convertToFCFA = (eurPrice) => Math.round(eurPrice * 655)
  
  const robesData = [
    {
      name: "Robe Élégante Noire",
      slug: "robe-elegante-noire",
      description: "Robe élégante parfaite pour les occasions spéciales. Coupe ajustée avec une finition impeccable qui met en valeur votre silhouette. Idéale pour les soirées et événements importants.",
      shortDescription: "Robe élégante parfaite pour les occasions spéciales",
      basePrice: convertToFCFA(89.99), // 58 945 FCFA
      compareAtPrice: convertToFCFA(120.00), // 78 600 FCFA
      sku: "REB001",
      categorySlug: "robes-soiree",
      brandSlug: "sandy-space",
      isFeatured: true,
      images: ["/images/products/robe-elegante-noire-1.png"],
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
      basePrice: convertToFCFA(65.99), // 43 225 FCFA
      compareAtPrice: convertToFCFA(85.00), // 55 675 FCFA
      sku: "REF002",
      categorySlug: "robes-ete",
      brandSlug: "summer-vibes",
      isFeatured: true,
      images: ["/images/products/robe-ete-florale-1.png"],
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
      basePrice: convertToFCFA(95.99), // 62 875 FCFA
      compareAtPrice: null,
      sku: "RB003",
      categorySlug: "robes-business",
      brandSlug: "sandy-space",
      isFeatured: true,
      images: ["/images/products/robe-business-1.png"],
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
      basePrice: convertToFCFA(75.99), // 49 775 FCFA
      compareAtPrice: convertToFCFA(100.00), // 65 500 FCFA
      sku: "RC004",
      categorySlug: "robes-cocktail",
      brandSlug: "elegance",
      isFeatured: true,
      images: ["/images/products/robe-cocktail-1.png"],
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
      basePrice: convertToFCFA(299.99), // 196 495 FCFA
      compareAtPrice: convertToFCFA(399.99), // 261 995 FCFA
      sku: "RM005",
      categorySlug: "robes-mariee",
      brandSlug: "elegance",
      isFeatured: true,
      images: ["/images/products/robe-de-mariee-1.png"],
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
      basePrice: convertToFCFA(45.99), // 30 125 FCFA
      compareAtPrice: null,
      sku: "RD006",
      categorySlug: "robes-decontractees",
      brandSlug: "summer-vibes",
      isFeatured: true,
      images: ["/images/products/robe-decontractee-1.png"],
      colors: ["Blanc", "Beige", "Rose"],
      sizes: ["S", "M", "L", "XL"],
      materials: ["Coton", "Lin"],
      styles: ["Décontracté", "Minimaliste"]
    },
    // Ajout de plus de robes avec des images correspondantes
    {
      name: "Robe Soirée Rouge",
      slug: "robe-soiree-rouge",
      description: "Robe de soirée rouge passionnée qui vous fera briller lors de vos événements spéciaux. Coupe ajustée et matière luxueuse.",
      shortDescription: "Robe de soirée rouge passionnée",
      basePrice: convertToFCFA(125.99), // 82 525 FCFA
      compareAtPrice: convertToFCFA(160.00), // 104 800 FCFA
      sku: "RSR007",
      categorySlug: "robes-soiree",
      brandSlug: "luxe-mode",
      isFeatured: true,
      images: ["/images/products/robe-soiree-rouge-1.png"],
      colors: ["Rouge", "Noir"],
      sizes: ["S", "M", "L"],
      materials: ["Soie", "Satin"],
      styles: ["Élégant", "Moderne"]
    },
    {
      name: "Robe Été Pastel",
      slug: "robe-ete-pastel",
      description: "Robe d'été aux couleurs pastel douces. Parfaite pour les journées ensoleillées et les sorties décontractées.",
      shortDescription: "Robe d'été aux couleurs pastel",
      basePrice: convertToFCFA(55.99), // 36 675 FCFA
      compareAtPrice: convertToFCFA(75.00), // 49 125 FCFA
      sku: "REP008",
      categorySlug: "robes-ete",
      brandSlug: "summer-vibes",
      isFeatured: false,
      images: ["/images/products/robe-ete-pastel-1.png"],
      colors: ["Rose", "Lavande", "Menthe"],
      sizes: ["S", "M", "L"],
      materials: ["Coton", "Viscose"],
      styles: ["Romantique", "Décontracté"]
    },
    {
      name: "Robe Business Marine",
      slug: "robe-business-marine",
      description: "Robe professionnelle marine pour un look sophistiqué au bureau. Coupe structurée et élégante.",
      shortDescription: "Robe professionnelle marine",
      basePrice: convertToFCFA(89.99), // 58 945 FCFA
      compareAtPrice: null,
      sku: "RBM009",
      categorySlug: "robes-business",
      brandSlug: "chic-co",
      isFeatured: false,
      images: ["/images/products/robe-business-marine-1.png"],
      colors: ["Marine", "Noir", "Gris"],
      sizes: ["S", "M", "L", "XL"],
      materials: ["Polyester", "Viscose"],
      styles: ["Moderne", "Minimaliste"]
    },
    {
      name: "Robe Cocktail Dorée",
      slug: "robe-cocktail-doree",
      description: "Robe cocktail dorée qui vous fera briller lors de vos soirées. Finition métallique et coupe ajustée.",
      shortDescription: "Robe cocktail dorée",
      basePrice: convertToFCFA(95.99), // 62 875 FCFA
      compareAtPrice: convertToFCFA(125.00), // 81 875 FCFA
      sku: "RCD010",
      categorySlug: "robes-cocktail",
      brandSlug: "luxe-mode",
      isFeatured: true,
      images: ["/images/products/robe-cocktail-doree-1.png"],
      colors: ["Or", "Argent"],
      sizes: ["S", "M", "L"],
      materials: ["Satin", "Polyester"],
      styles: ["Élégant", "Moderne"]
    },
    {
      name: "Robe Mariée Princesse",
      slug: "robe-mariee-princesse",
      description: "Robe de mariée style princesse avec une jupe volumineuse et des détails romantiques. Parfaite pour votre grand jour.",
      shortDescription: "Robe de mariée style princesse",
      basePrice: convertToFCFA(450.99), // 295 395 FCFA
      compareAtPrice: convertToFCFA(600.00), // 393 000 FCFA
      sku: "RMP011",
      categorySlug: "robes-mariee",
      brandSlug: "luxe-mode",
      isFeatured: true,
      images: ["/images/products/robe-mariee-princesse-1.png"],
      colors: ["Blanc", "Ivoire", "Champagne"],
      sizes: ["S", "M", "L"],
      materials: ["Soie", "Dentelle", "Tulle"],
      styles: ["Romantique", "Élégant"]
    },
    {
      name: "Robe Décontractée Oversized",
      slug: "robe-decontractee-oversized",
      description: "Robe décontractée oversized pour un look confortable et tendance. Parfaite pour les journées détendues.",
      shortDescription: "Robe décontractée oversized",
      basePrice: convertToFCFA(39.99), // 26 195 FCFA
      compareAtPrice: convertToFCFA(55.00), // 36 025 FCFA
      sku: "RDO012",
      categorySlug: "robes-decontractees",
      brandSlug: "chic-co",
      isFeatured: false,
      images: ["/images/products/robe-decontractee-oversized-1.png"],
      colors: ["Gris", "Beige", "Noir"],
      sizes: ["S", "M", "L", "XL"],
      materials: ["Coton", "Lin"],
      styles: ["Décontracté", "Minimaliste"]
    },
    {
      name: "Robe Soirée Noire",
      slug: "robe-soiree-noire",
      description: "Robe de soirée noire intemporelle et élégante. Un classique qui ne se démode jamais.",
      shortDescription: "Robe de soirée noire intemporelle",
      basePrice: convertToFCFA(110.99), // 72 695 FCFA
      compareAtPrice: convertToFCFA(140.00), // 91 700 FCFA
      sku: "RSN013",
      categorySlug: "robes-soiree",
      brandSlug: "elegance",
      isFeatured: true,
      images: ["/images/products/robe-soiree-noire-1.png"],
      colors: ["Noir"],
      sizes: ["S", "M", "L"],
      materials: ["Soie", "Polyester"],
      styles: ["Élégant", "Moderne"]
    },
    {
      name: "Robe Été Bohème",
      slug: "robe-ete-boheme",
      description: "Robe d'été bohème avec des motifs ethniques. Parfaite pour les festivals et les vacances.",
      shortDescription: "Robe d'été bohème",
      basePrice: convertToFCFA(49.99), // 32 745 FCFA
      compareAtPrice: convertToFCFA(65.00), // 42 575 FCFA
      sku: "REB014",
      categorySlug: "robes-ete",
      brandSlug: "summer-vibes",
      isFeatured: false,
      images: ["/images/products/robe-ete-boheme-1.png"],
      colors: ["Multicolore", "Orange", "Turquoise"],
      sizes: ["S", "M", "L"],
      materials: ["Coton", "Viscose"],
      styles: ["Bohème", "Décontracté"]
    },
    {
      name: "Robe Business Minimaliste",
      slug: "robe-business-minimaliste",
      description: "Robe business minimaliste pour un look professionnel et moderne. Coupe épurée et élégante.",
      shortDescription: "Robe business minimaliste",
      basePrice: convertToFCFA(79.99), // 52 395 FCFA
      compareAtPrice: null,
      sku: "RBM015",
      categorySlug: "robes-business",
      brandSlug: "chic-co",
      isFeatured: false,
      images: ["/images/products/robe-business-minimaliste-1.png"],
      colors: ["Noir", "Gris", "Beige"],
      sizes: ["S", "M", "L", "XL"],
      materials: ["Polyester", "Viscose"],
      styles: ["Minimaliste", "Moderne"]
    },
    {
      name: "Robe Cocktail Moderne",
      slug: "robe-cocktail-moderne",
      description: "Robe cocktail moderne avec des lignes géométriques. Parfaite pour les événements contemporains.",
      shortDescription: "Robe cocktail moderne",
      basePrice: convertToFCFA(85.99), // 56 325 FCFA
      compareAtPrice: convertToFCFA(110.00), // 72 050 FCFA
      sku: "RCM016",
      categorySlug: "robes-cocktail",
      brandSlug: "chic-co",
      isFeatured: false,
      images: ["/images/products/robe-cocktail-moderne-1.png"],
      colors: ["Noir", "Blanc", "Rouge"],
      sizes: ["S", "M", "L"],
      materials: ["Polyester", "Viscose"],
      styles: ["Moderne", "Minimaliste"]
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
        publishedAt: new Date(),
        currency: 'FCFA'
      },
      create: {
        ...productData,
        categoryId: category.id,
        brandId: brand?.id,
        status: 'ACTIVE',
        isActive: true,
        publishedAt: new Date(),
        currency: 'FCFA'
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
    const defaultSize = sizeValues.find(s => s.value === 'M')
    if (defaultSize) {
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
