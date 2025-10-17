import { mutate } from 'swr'
import { useState } from 'react'

// Hook générique pour les mutations
export function useMutation(url, options = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const trigger = async (data, config = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(url, {
        method: options.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
          ...config.headers
        },
        body: data ? JSON.stringify(data) : undefined,
        ...config
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'An error occurred')
      }

      const result = await response.json()

      // Revalider les données SWR si nécessaire
      if (options.revalidate) {
        await mutate(options.revalidate)
      }

      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    trigger,
    isLoading,
    error,
    reset: () => setError(null)
  }
}

// Hook pour ajouter un produit au panier
export function useAddToCart() {
  return useMutation('/api/cart/add', {
    method: 'POST',
    revalidate: '/api/cart'
  })
}

// Hook pour mettre à jour la quantité dans le panier
export function useUpdateCartQuantity() {
  return useMutation('/api/cart/update', {
    method: 'PUT',
    revalidate: '/api/cart'
  })
}

// Hook pour supprimer un produit du panier
export function useRemoveFromCart() {
  return useMutation('/api/cart/remove', {
    method: 'DELETE',
    revalidate: '/api/cart'
  })
}

// Hook pour ajouter/retirer de la wishlist
export function useToggleWishlist() {
  return useMutation('/api/wishlist/toggle', {
    method: 'POST',
    revalidate: '/api/wishlist'
  })
}

// Hook pour ajouter un avis
export function useAddReview() {
  return useMutation('/api/reviews', {
    method: 'POST',
    revalidate: (key) => key.startsWith('/api/products/') && key.includes('/reviews')
  })
}
