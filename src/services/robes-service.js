import { prisma } from '@/lib/prisma'

export class RobesService {
  // Récupérer les robes en vedette pour le bento grid
  async getFeaturedRobes(limit = 6) {
    try {
      // Rechercher la catégorie "Robes" ou similaire
      const robesCategory = await prisma.category.findFirst({
        where: {
          OR: [
            { slug: 'robes' },
            { name: { contains: 'robe', mode: 'insensitive' } },
            { name: { contains: 'dress', mode: 'insensitive' } }
          ],
          isActive: true
        }
      })

      if (!robesCategory) {
        // Si pas de catégorie robes, récupérer des produits en vedette
        return this.getFeaturedProducts(limit)
      }

      const products = await prisma.product.findMany({
        where: {
          categoryId: robesCategory.id,
          status: 'ACTIVE',
          isActive: true,
          OR: [
            { isFeatured: true },
            { salesCount: { gt: 0 } },
            { viewCount: { gt: 10 } }
          ]
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          images: {
            where: {
              isPrimary: true
            },
            select: {
              url: true,
              alt: true
            }
          },
          variants: {
            where: {
              isActive: true,
              isDefault: true
            },
            select: {
              id: true,
              price: true,
              compareAtPrice: true,
              stock: true,
              attributes: {
                include: {
                  attributeValue: {
                    include: {
                      attribute: {
                        select: {
                          name: true,
                          type: true
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          reviews: {
            where: {
              isApproved: true
            },
            select: {
              rating: true
            }
          }
        },
        orderBy: [
          { isFeatured: 'desc' },
          { salesCount: 'desc' },
          { viewCount: 'desc' },
          { createdAt: 'desc' }
        ],
        take: limit
      })

      return this.transformProductsForBento(products)

    } catch (error) {
      console.error('Error fetching featured robes:', error)
      throw new Error('Failed to fetch featured robes')
    }
  }

  // Récupérer des produits en vedette génériques
  async getFeaturedProducts(limit = 6) {
    try {
      const products = await prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          isActive: true,
          isFeatured: true
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          images: {
            where: {
              isPrimary: true
            },
            select: {
              url: true,
              alt: true
            }
          },
          variants: {
            where: {
              isActive: true,
              isDefault: true
            },
            select: {
              id: true,
              price: true,
              compareAtPrice: true,
              stock: true,
              attributes: {
                include: {
                  attributeValue: {
                    include: {
                      attribute: {
                        select: {
                          name: true,
                          type: true
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          reviews: {
            where: {
              isApproved: true
            },
            select: {
              rating: true
            }
          }
        },
        orderBy: [
          { salesCount: 'desc' },
          { viewCount: 'desc' },
          { createdAt: 'desc' }
        ],
        take: limit
      })

      return this.transformProductsForBento(products)

    } catch (error) {
      console.error('Error fetching featured products:', error)
      throw new Error('Failed to fetch featured products')
    }
  }

  // Transformer les produits pour le format bento grid
  transformProductsForBento(products) {
    const gridSizes = ['large', 'medium', 'small', 'medium', 'large', 'small']
    
    return products.map((product, index) => {
      // Calculer la note moyenne
      const avgRating = product.reviews.length > 0 
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 4.5 // Note par défaut

      // Récupérer la variante par défaut
      const defaultVariant = product.variants[0]
      
      // Extraire les couleurs disponibles
      const colors = defaultVariant?.attributes
        ?.filter(attr => attr.attributeValue.attribute.type === 'COLOR')
        ?.map(attr => attr.attributeValue.value) || ['Noir', 'Blanc', 'Rouge']

      // Extraire les tailles disponibles
      const sizes = defaultVariant?.attributes
        ?.filter(attr => attr.attributeValue.attribute.type === 'SIZE')
        ?.map(attr => attr.attributeValue.value) || ['S', 'M', 'L', 'XL']

      // Déterminer si c'est une nouveauté (créé il y a moins de 30 jours)
      const isNew = new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

      // Déterminer si c'est en promotion
      const isSale = defaultVariant?.compareAtPrice && 
                    defaultVariant.compareAtPrice > defaultVariant.price

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: parseFloat(defaultVariant?.price || product.basePrice),
        originalPrice: defaultVariant?.compareAtPrice ? parseFloat(defaultVariant.compareAtPrice) : null,
        image: product.images[0]?.url || '/images/placeholder.jpg',
        category: product.category.name,
        categorySlug: product.category.slug,
        size: sizes,
        colors: colors,
        rating: Math.round(avgRating * 10) / 10,
        reviews: product.reviews.length,
        isNew,
        isSale,
        isFeatured: product.isFeatured,
        description: product.shortDescription || product.description?.substring(0, 100) + '...',
        stock: defaultVariant?.stock || 0,
        gridSize: gridSizes[index % gridSizes.length]
      }
    })
  }

  // Récupérer les catégories de robes
  async getRobeCategories() {
    try {
      const categories = await prisma.category.findMany({
        where: {
          OR: [
            { slug: 'robes' },
            { name: { contains: 'robe', mode: 'insensitive' } },
            { name: { contains: 'dress', mode: 'insensitive' } }
          ],
          isActive: true
        },
        include: {
          children: {
            where: {
              isActive: true
            },
            select: {
              id: true,
              name: true,
              slug: true,
              image: true
            },
            orderBy: {
              order: 'asc'
            }
          }
        },
        orderBy: {
          order: 'asc'
        }
      })

      return categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        children: category.children
      }))

    } catch (error) {
      console.error('Error fetching robe categories:', error)
      throw new Error('Failed to fetch robe categories')
    }
  }

  // Rechercher des robes
  async searchRobes(query, filters = {}) {
    try {
      const { category, priceMin, priceMax, colors, sizes, sortBy = 'popular' } = filters

      // Construire les filtres de recherche
      const where = {
        status: 'ACTIVE',
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { shortDescription: { contains: query, mode: 'insensitive' } }
        ]
      }

      // Ajouter filtre par catégorie
      if (category) {
        where.category = {
          slug: category
        }
      }

      // Ajouter filtres de prix
      if (priceMin || priceMax) {
        where.basePrice = {}
        if (priceMin) where.basePrice.gte = parseFloat(priceMin)
        if (priceMax) where.basePrice.lte = parseFloat(priceMax)
      }

      // Construire l'ordre de tri
      let orderBy = []
      switch (sortBy) {
        case 'price-low':
          orderBy = [{ basePrice: 'asc' }]
          break
        case 'price-high':
          orderBy = [{ basePrice: 'desc' }]
          break
        case 'newest':
          orderBy = [{ createdAt: 'desc' }]
          break
        case 'rating':
          orderBy = [{ viewCount: 'desc' }] // Approximation
          break
        default: // popular
          orderBy = [{ salesCount: 'desc' }, { viewCount: 'desc' }]
      }

      const products = await prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          images: {
            where: {
              isPrimary: true
            },
            select: {
              url: true,
              alt: true
            }
          },
          variants: {
            where: {
              isActive: true,
              isDefault: true
            },
            select: {
              id: true,
              price: true,
              compareAtPrice: true,
              stock: true,
              attributes: {
                include: {
                  attributeValue: {
                    include: {
                      attribute: {
                        select: {
                          name: true,
                          type: true
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          reviews: {
            where: {
              isApproved: true
            },
            select: {
              rating: true
            }
          }
        },
        orderBy,
        take: 50
      })

      return this.transformProductsForBento(products)

    } catch (error) {
      console.error('Error searching robes:', error)
      throw new Error('Failed to search robes')
    }
  }
}

export const robesService = new RobesService()
export default robesService
