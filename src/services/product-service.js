import { apiService } from './api'

export class ProductService {
  // Récupérer tous les produits avec filtres
  async getProducts(filters = {}) {
    return apiService.get('/products', filters)
  }

  // Récupérer un produit par son slug
  async getProductBySlug(slug) {
    return apiService.get(`/products/${slug}`)
  }

  // Récupérer un produit par son ID
  async getProductById(id) {
    return apiService.get(`/products/id/${id}`)
  }

  // Récupérer les produits par catégorie
  async getProductsByCategory(categorySlug, filters = {}) {
    return apiService.get(`/products/category/${categorySlug}`, filters)
  }

  // Récupérer les produits par marque
  async getProductsByBrand(brandSlug, filters = {}) {
    return apiService.get(`/products/brand/${brandSlug}`, filters)
  }

  // Rechercher des produits
  async searchProducts(query, filters = {}) {
    return apiService.get('/products/search', { q: query, ...filters })
  }

  // Récupérer les produits recommandés
  async getRecommendedProducts(productId, limit = 4) {
    return apiService.get(`/products/${productId}/recommended`, { limit })
  }

  // Récupérer les produits similaires
  async getSimilarProducts(productId, limit = 4) {
    return apiService.get(`/products/${productId}/similar`, { limit })
  }

  // Récupérer les produits en vedette
  async getFeaturedProducts(limit = 8) {
    return apiService.get('/products/featured', { limit })
  }

  // Récupérer les nouveaux produits
  async getNewProducts(limit = 8) {
    return apiService.get('/products/new', { limit })
  }

  // Récupérer les produits en promotion
  async getSaleProducts(limit = 8) {
    return apiService.get('/products/sale', { limit })
  }

  // Récupérer les variantes d'un produit
  async getProductVariants(productId) {
    return apiService.get(`/products/${productId}/variants`)
  }

  // Vérifier la disponibilité d'une variante
  async checkVariantAvailability(variantId) {
    return apiService.get(`/products/variants/${variantId}/availability`)
  }

  // Incrémenter le compteur de vues
  async incrementViewCount(productId) {
    return apiService.post(`/products/${productId}/view`)
  }

  // Récupérer les avis d'un produit
  async getProductReviews(productId, filters = {}) {
    return apiService.get(`/products/${productId}/reviews`, filters)
  }

  // Ajouter un avis
  async addProductReview(productId, reviewData) {
    return apiService.post(`/products/${productId}/reviews`, reviewData)
  }

  // Récupérer les catégories
  async getCategories() {
    return apiService.get('/categories')
  }

  // Récupérer les marques
  async getBrands() {
    return apiService.get('/brands')
  }

  // Récupérer les attributs disponibles
  async getAttributes() {
    return apiService.get('/attributes')
  }

  // Récupérer les valeurs d'attributs
  async getAttributeValues(attributeId) {
    return apiService.get(`/attributes/${attributeId}/values`)
  }
}

export const productService = new ProductService()
export default productService
