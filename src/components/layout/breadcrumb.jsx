import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export function Breadcrumb({ items = [], className = '' }) {
  if (!items || items.length === 0) return null

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      {/* Accueil */}
      <Link 
        href="/" 
        className="text-gray-500 hover:text-gray-700 transition-colors flex items-center"
      >
        <Home className="h-4 w-4" />
      </Link>

      {/* Items du breadcrumb */}
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {item.href ? (
            <Link 
              href={item.href} 
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}

// Hook pour générer automatiquement les breadcrumbs
export function useBreadcrumb(pathname, productName = null) {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs = []

  // Ajouter les segments de navigation
  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // Formater le label
    let label = segment
    if (segment === 'products') {
      label = 'Produits'
    } else if (segment === 'category') {
      label = 'Catégories'
    } else if (segment === 'cart') {
      label = 'Panier'
    } else if (segment === 'checkout') {
      label = 'Commande'
    } else if (segment === 'account') {
      label = 'Mon compte'
    } else if (segment === 'orders') {
      label = 'Mes commandes'
    } else if (segment === 'wishlist') {
      label = 'Ma wishlist'
    } else if (segment === 'contact') {
      label = 'Contact'
    } else if (segment === 'about') {
      label = 'À propos'
    } else if (segment === 'collections') {
      label = 'Collections'
    } else if (segment === 'brands') {
      label = 'Marques'
    } else if (segment === 'search') {
      label = 'Recherche'
    } else {
      // Capitaliser et remplacer les tirets
      label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }

    // Dernier segment = pas de lien
    const isLast = index === segments.length - 1
    const href = isLast ? null : currentPath

    breadcrumbs.push({
      label: productName && isLast ? productName : label,
      href
    })
  })

  return breadcrumbs
}
