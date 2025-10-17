import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Formatage des prix
export function formatPrice(price, currency = 'EUR') {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
  }).format(price)
}

// Génération de slug
export function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
}

// Validation email
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Formatage des tailles
export function formatSize(size, type = 'clothing') {
  const sizeMap = {
    clothing: {
      'XS': 'Extra Small',
      'S': 'Small', 
      'M': 'Medium',
      'L': 'Large',
      'XL': 'Extra Large',
      'XXL': 'Double Extra Large'
    },
    shoes: {
      '35': '35',
      '36': '36',
      '37': '37',
      '38': '38',
      '39': '39',
      '40': '40',
      '41': '41',
      '42': '42',
      '43': '43',
      '44': '44',
      '45': '45'
    }
  }
  
  return sizeMap[type]?.[size] || size
}

// Calcul de la réduction
export function calculateDiscount(originalPrice, salePrice) {
  if (!originalPrice || !salePrice) return 0
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

// Formatage des dates
export function formatDate(date, locale = 'fr-FR') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

// Debounce function
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
