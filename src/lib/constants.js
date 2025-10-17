// Constantes pour l'e-commerce de mode

export const PRODUCT_STATUS = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
  OUT_OF_STOCK: 'OUT_OF_STOCK'
}

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED'
}

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED',
  EXPIRED: 'EXPIRED'
}

export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  STAFF: 'STAFF'
}

// Catégories principales pour votre entreprise
export const FASHION_CATEGORIES = [
  { name: 'Robes', slug: 'robes', icon: 'Shirt', description: 'Robes élégantes pour toutes les occasions' },
  { name: 'Pantalons', slug: 'pantalons', icon: 'Square', description: 'Pantalons confortables et stylés' },
  { name: 'Compléments alimentaires', slug: 'complements-alimentaires', icon: 'Pill', description: 'Compléments alimentaires pour votre bien-être' },
  { name: 'Chaussures', slug: 'chaussures', icon: 'Footprints', description: 'Chaussures tendance et confortables' },
  { name: 'Les hauts', slug: 'hauts', icon: 'Shirt', description: 'Tops, t-shirts et chemises' },
  { name: 'Perles', slug: 'perles', icon: 'Gem', description: 'Bijoux en perles artisanaux' },
  { name: 'Sacs à main', slug: 'sacs-a-main', icon: 'ShoppingBag', description: 'Sacs à main élégants et pratiques' }
]

// Types de produits pour votre entreprise
export const PRODUCT_TYPES = [
  { name: 'Robes', slug: 'robes', category: 'vetements' },
  { name: 'Pantalons', slug: 'pantalons', category: 'vetements' },
  { name: 'Compléments alimentaires', slug: 'complements-alimentaires', category: 'sante' },
  { name: 'Chaussures', slug: 'chaussures', category: 'chaussures' },
  { name: 'Hauts', slug: 'hauts', category: 'vetements' },
  { name: 'Perles', slug: 'perles', category: 'bijoux' },
  { name: 'Sacs à main', slug: 'sacs-a-main', category: 'accessoires' }
]

// Tailles standards pour vos produits
export const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
export const SHOE_SIZES = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']
export const BRA_SIZES = ['70A', '70B', '70C', '75A', '75B', '75C', '80A', '80B', '80C', '85A', '85B', '85C']

// Tailles spécifiques par catégorie
export const SIZE_GUIDES = {
  robes: {
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    measurements: ['Tour de poitrine', 'Tour de taille', 'Tour de hanches', 'Longueur']
  },
  pantalons: {
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    measurements: ['Tour de taille', 'Tour de hanches', 'Longueur intérieure', 'Longueur extérieure']
  },
  chaussures: {
    sizes: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
    measurements: ['Pointure FR', 'Pointure EU', 'Pointure US', 'Pointure UK']
  },
  hauts: {
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    measurements: ['Tour de poitrine', 'Tour de taille', 'Longueur']
  },
  'sacs-a-main': {
    sizes: ['Petit', 'Moyen', 'Grand'],
    measurements: ['Longueur', 'Hauteur', 'Profondeur', 'Longueur de bandoulière']
  },
  perles: {
    sizes: ['Unique'],
    measurements: ['Diamètre', 'Longueur', 'Couleur']
  },
  'complements-alimentaires': {
    sizes: ['30 gélules', '60 gélules', '90 gélules', '120 gélules'],
    measurements: ['Poids net', 'Nombre de gélules', 'Durée de traitement']
  }
}

// Couleurs populaires
export const COLORS = [
  { name: 'Noir', hex: '#000000', slug: 'noir' },
  { name: 'Blanc', hex: '#FFFFFF', slug: 'blanc' },
  { name: 'Rouge', hex: '#FF0000', slug: 'rouge' },
  { name: 'Bleu', hex: '#0000FF', slug: 'bleu' },
  { name: 'Vert', hex: '#008000', slug: 'vert' },
  { name: 'Jaune', hex: '#FFFF00', slug: 'jaune' },
  { name: 'Rose', hex: '#FFC0CB', slug: 'rose' },
  { name: 'Gris', hex: '#808080', slug: 'gris' },
  { name: 'Marron', hex: '#A52A2A', slug: 'marron' },
  { name: 'Beige', hex: '#F5F5DC', slug: 'beige' },
  { name: 'Violet', hex: '#800080', slug: 'violet' },
  { name: 'Orange', hex: '#FFA500', slug: 'orange' }
]

// Matériaux
export const MATERIALS = [
  'Coton',
  'Polyester',
  'Laine',
  'Soie',
  'Lin',
  'Cuir',
  'Denim',
  'Cachemire',
  'Viscose',
  'Élasthanne',
  'Nylon',
  'Acrylique'
]

// Styles/Occasions
export const OCCASIONS = [
  'Casual',
  'Formel',
  'Sport',
  'Soirée',
  'Travail',
  'Vacances',
  'Mariage',
  'Été',
  'Hiver',
  'Printemps',
  'Automne'
]

// Méthodes de paiement
export const PAYMENT_METHODS = [
  { name: 'Carte bancaire', value: 'card', icon: '💳' },
  { name: 'PayPal', value: 'paypal', icon: '🅿️' },
  { name: 'Apple Pay', value: 'apple_pay', icon: '🍎' },
  { name: 'Google Pay', value: 'google_pay', icon: '🔍' },
  { name: 'Virement bancaire', value: 'bank_transfer', icon: '🏦' }
]

// Méthodes de livraison
export const SHIPPING_METHODS = [
  { name: 'Livraison standard', value: 'standard', days: '3-5 jours', price: 4.99 },
  { name: 'Livraison express', value: 'express', days: '1-2 jours', price: 9.99 },
  { name: 'Livraison gratuite', value: 'free', days: '5-7 jours', price: 0, minOrder: 50 }
]

// Limites et seuils
export const LIMITS = {
  MAX_CART_ITEMS: 50,
  MAX_WISHLIST_ITEMS: 100,
  MAX_COMPARE_ITEMS: 4,
  FREE_SHIPPING_THRESHOLD: 50,
  LOW_STOCK_THRESHOLD: 5
}

// URLs et routes
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  BRANDS: '/brands',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ACCOUNT: '/account',
  LOGIN: '/login',
  REGISTER: '/register',
  SEARCH: '/search',
  WISHLIST: '/wishlist',
  COMPARE: '/compare'
}

// Configuration API
export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  CATEGORIES: '/api/categories',
  CART: '/api/cart',
  ORDERS: '/api/orders',
  USERS: '/api/users',
  AUTH: '/api/auth',
  UPLOAD: '/api/upload'
}

// Messages d'erreur
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Ce champ est obligatoire',
  INVALID_EMAIL: 'Adresse email invalide',
  PASSWORD_TOO_SHORT: 'Le mot de passe doit contenir au moins 8 caractères',
  PASSWORDS_DONT_MATCH: 'Les mots de passe ne correspondent pas',
  PRODUCT_NOT_FOUND: 'Produit introuvable',
  OUT_OF_STOCK: 'Produit en rupture de stock',
  CART_EMPTY: 'Votre panier est vide',
  PAYMENT_FAILED: 'Le paiement a échoué',
  NETWORK_ERROR: 'Erreur de connexion'
}

// Messages de succès
export const SUCCESS_MESSAGES = {
  ACCOUNT_CREATED: 'Compte créé avec succès',
  LOGIN_SUCCESS: 'Connexion réussie',
  PRODUCT_ADDED_TO_CART: 'Produit ajouté au panier',
  PRODUCT_ADDED_TO_WISHLIST: 'Produit ajouté à la wishlist',
  ORDER_PLACED: 'Commande passée avec succès',
  PAYMENT_SUCCESS: 'Paiement effectué avec succès',
  PROFILE_UPDATED: 'Profil mis à jour',
  PASSWORD_CHANGED: 'Mot de passe modifié'
}
