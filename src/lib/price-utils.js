/**
 * Utilitaires pour le formatage des prix
 */

/**
 * Formate un prix en FCFA de manière user-friendly
 * @param {number} price - Prix en EUR
 * @param {number} originalPrice - Prix original (optionnel)
 * @returns {object} - { formattedPrice, priceInFCFA, discountPercentage, savings }
 */
export function formatPrice(price, originalPrice = null) {
  const priceInFCFA = Math.round(price * 655)
  
  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(priceInFCFA).replace('XOF', 'FCFA')
  
  // Calcul du pourcentage de réduction
  const discountPercentage = originalPrice && originalPrice > price
    ? Math.round((1 - price / originalPrice) * 100)
    : 0
  
  // Calcul des économies
  const savings = originalPrice && originalPrice > price
    ? Math.round((originalPrice - price) * 655)
    : 0
  
  const formattedSavings = savings > 0 
    ? new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(savings).replace('XOF', 'FCFA')
    : null
  
  // Prix original formaté
  const formattedOriginalPrice = originalPrice && originalPrice > price
    ? new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(Math.round(originalPrice * 655)).replace('XOF', 'FCFA')
    : null
  
  return {
    formattedPrice,
    priceInFCFA,
    discountPercentage,
    savings,
    formattedSavings,
    formattedOriginalPrice,
    hasDiscount: discountPercentage > 0
  }
}

/**
 * Formate un prix pour l'affichage court (ex: "25K FCFA")
 * @param {number} price - Prix en EUR
 * @returns {string} - Prix formaté court
 */
export function formatPriceShort(price) {
  const priceInFCFA = Math.round(price * 655)
  
  if (priceInFCFA >= 1000000) {
    return `${Math.round(priceInFCFA / 1000000)}M FCFA`
  } else if (priceInFCFA >= 1000) {
    return `${Math.round(priceInFCFA / 1000)}K FCFA`
  } else {
    return `${priceInFCFA} FCFA`
  }
}

/**
 * Formate un prix pour l'affichage de comparaison
 * @param {number} price - Prix actuel
 * @param {number} originalPrice - Prix original
 * @returns {object} - Informations de comparaison formatées
 */
export function formatPriceComparison(price, originalPrice) {
  const current = formatPrice(price)
  const original = formatPrice(originalPrice)
  
  return {
    current: current.formattedPrice,
    original: original.formattedPrice,
    discountPercentage: current.discountPercentage,
    savings: current.formattedSavings,
    hasDiscount: current.hasDiscount
  }
}

/**
 * Formate un prix avec des indicateurs visuels
 * @param {number} price - Prix en EUR
 * @param {number} originalPrice - Prix original (optionnel)
 * @returns {object} - Prix avec indicateurs
 */
export function formatPriceWithIndicators(price, originalPrice = null) {
  const base = formatPrice(price, originalPrice)
  
  return {
    ...base,
    // Indicateur de prix attractif
    isGoodDeal: base.discountPercentage >= 20,
    isGreatDeal: base.discountPercentage >= 50,
    // Niveau de prix
    priceLevel: price < 50 ? 'budget' : price < 150 ? 'mid' : 'premium',
    // Affichage avec emoji
    displayWithEmoji: `${base.formattedPrice} ${base.hasDiscount ? '🔥' : ''}`,
    // Message de promotion
    promotionMessage: base.hasDiscount 
      ? `Économisez ${base.formattedSavings} !`
      : null
  }
}
