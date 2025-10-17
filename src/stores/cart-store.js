import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Store pour le panier
export const useCartStore = create(
  persist(
    (set, get) => ({
      // État
      items: [],
      isOpen: false,
      isLoading: false,
      lastAddedItem: null,

      // Actions
      addToCart: (product, variant = null, quantity = 1) => {
        const itemId = variant ? `${product.id}-${variant.id}` : product.id
        
        const cartItem = {
          id: itemId,
          productId: product.id,
          variantId: variant?.id,
          name: product.name,
          slug: product.slug,
          variant: variant ? variant.attributes?.map(a => `${a.name}: ${a.value}`).join(', ') : null,
          price: variant ? variant.price : product.basePrice,
          originalPrice: variant ? variant.compareAtPrice : product.compareAtPrice,
          image: product.images?.[0]?.url || '/images/placeholder-product.jpg',
          quantity,
          stock: variant ? variant.stock : null,
          addedAt: new Date().toISOString(),
          // Métadonnées pour l'affichage
          brand: product.brand?.name,
          category: product.category?.name,
          sku: variant ? variant.sku : product.sku
        }

        set((state) => {
          const existingItemIndex = state.items.findIndex(item => item.id === itemId)

          if (existingItemIndex >= 0) {
            // Mettre à jour la quantité de l'item existant
            const updatedItems = [...state.items]
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + quantity,
              addedAt: new Date().toISOString()
            }
            return {
              ...state,
              items: updatedItems,
              lastAddedItem: cartItem
            }
          } else {
            // Ajouter un nouvel item
            return {
              ...state,
              items: [...state.items, cartItem],
              lastAddedItem: cartItem
            }
          }
        })

        // Ouvrir automatiquement le panier après ajout
        setTimeout(() => {
          set((state) => ({ ...state, isOpen: true }))
        }, 300)
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              ...state,
              items: state.items.filter(item => item.id !== itemId)
            }
          }

          const itemIndex = state.items.findIndex(item => item.id === itemId)
          if (itemIndex >= 0) {
            const updatedItems = [...state.items]
            updatedItems[itemIndex] = {
              ...updatedItems[itemIndex],
              quantity,
              updatedAt: new Date().toISOString()
            }
            return { ...state, items: updatedItems }
          }
          return state
        })
      },

      removeFromCart: (itemId) => {
        set((state) => ({
          ...state,
          items: state.items.filter(item => item.id !== itemId)
        }))
      },

      clearCart: () => {
        set((state) => ({
          ...state,
          items: [],
          lastAddedItem: null
        }))
      },

      setCartOpen: (isOpen) => {
        set((state) => ({ ...state, isOpen }))
      },

      // Sélecteurs calculés
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },

      getTotalSavings: () => {
        return get().items.reduce((total, item) => {
          if (item.originalPrice && item.originalPrice > item.price) {
            return total + ((item.originalPrice - item.price) * item.quantity)
          }
          return total
        }, 0)
      },

      getCartSummary: () => {
        const state = get()
        return {
          itemCount: state.getTotalItems(),
          subtotal: state.getSubtotal(),
          savings: state.getTotalSavings(),
          items: state.items
        }
      },

      // Vérifier si un produit est dans le panier
      isInCart: (productId, variantId = null) => {
        const itemId = variantId ? `${productId}-${variantId}` : productId
        return get().items.some(item => item.id === itemId)
      },

      // Obtenir la quantité d'un produit dans le panier
      getItemQuantity: (productId, variantId = null) => {
        const itemId = variantId ? `${productId}-${variantId}` : productId
        const item = get().items.find(item => item.id === itemId)
        return item ? item.quantity : 0
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, lastAddedItem: state.lastAddedItem }),
    }
  )
)

// Store pour la wishlist
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      // État
      items: [],

      // Actions
      addToWishlist: (product, variant = null) => {
        const itemId = variant ? `${product.id}-${variant.id}` : product.id
        
        set((state) => {
          const exists = state.items.some(item => item.id === itemId)
          
          if (exists) return state

          const wishlistItem = {
            id: itemId,
            productId: product.id,
            variantId: variant?.id,
            name: product.name,
            slug: product.slug,
            variant: variant ? variant.attributes?.map(a => `${a.name}: ${a.value}`).join(', ') : null,
            price: variant ? variant.price : product.basePrice,
            originalPrice: variant ? variant.compareAtPrice : product.compareAtPrice,
            image: product.images?.[0]?.url || '/images/placeholder-product.jpg',
            addedAt: new Date().toISOString(),
            // Métadonnées
            brand: product.brand?.name,
            category: product.category?.name,
            sku: variant ? variant.sku : product.sku
          }

          return { ...state, items: [...state.items, wishlistItem] }
        })
      },

      removeFromWishlist: (itemId) => {
        set((state) => ({
          ...state,
          items: state.items.filter(item => item.id !== itemId)
        }))
      },

      clearWishlist: () => {
        set((state) => ({ ...state, items: [] }))
      },

      // Vérifier si un produit est dans la wishlist
      isInWishlist: (productId, variantId = null) => {
        const itemId = variantId ? `${productId}-${variantId}` : productId
        return get().items.some(item => item.id === itemId)
      },

      // Toggle wishlist (ajouter/supprimer)
      toggleWishlist: (product, variant = null) => {
        const itemId = variant ? `${product.id}-${variant.id}` : product.id
        const isInWishlist = get().isInWishlist(product.id, variant?.id)
        
        if (isInWishlist) {
          get().removeFromWishlist(itemId)
        } else {
          get().addToWishlist(product, variant)
        }
      }
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Store pour la comparaison de produits
export const useCompareStore = create(
  persist(
    (set, get) => ({
      // État
      items: [],
      maxItems: 4,

      // Actions
      addToCompare: (product) => {
        const state = get()
        
        if (state.items.length >= state.maxItems) {
          return { success: false, message: `Maximum ${state.maxItems} produits à comparer` }
        }

        const exists = state.items.some(item => item.id === product.id)
        if (exists) {
          return { success: false, message: 'Produit déjà dans la comparaison' }
        }

        const compareItem = {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.basePrice,
          originalPrice: product.compareAtPrice,
          image: product.images?.[0]?.url || '/images/placeholder-product.jpg',
          brand: product.brand?.name,
          category: product.category?.name,
          sku: product.sku,
          addedAt: new Date().toISOString(),
          // Attributs pour la comparaison
          weight: product.weight,
          dimensions: product.dimensions,
          description: product.description
        }

        set((state) => ({
          ...state,
          items: [...state.items, compareItem]
        }))
        
        return { success: true, message: 'Produit ajouté à la comparaison' }
      },

      removeFromCompare: (productId) => {
        set((state) => ({
          ...state,
          items: state.items.filter(item => item.id !== productId)
        }))
      },

      clearCompare: () => {
        set((state) => ({ ...state, items: [] }))
      },

      // Vérifier si un produit est dans la comparaison
      isInCompare: (productId) => {
        return get().items.some(item => item.id === productId)
      },

      // Toggle comparaison
      toggleCompare: (product) => {
        const isInCompare = get().isInCompare(product.id)
        
        if (isInCompare) {
          get().removeFromCompare(product.id)
        } else {
          return get().addToCompare(product)
        }
      }
    }),
    {
      name: 'compare-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Store pour les notifications
export const useNotificationStore = create((set) => ({
  notifications: [],
  
  addNotification: (notification) => {
    const id = Date.now()
    set((state) => ({
      notifications: [...state.notifications, { id, ...notification }]
    }))
    
    // Auto-supprimer après 5 secondes
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      }))
    }, 5000)
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }))
  },

  clearNotifications: () => {
    set({ notifications: [] })
  }
}))

// Hook personnalisé pour les actions du panier
export const useCartActions = () => {
  const cartStore = useCartStore()
  const wishlistStore = useWishlistStore()
  const notificationStore = useNotificationStore()

  const addToCartWithNotification = (product, variant = null, quantity = 1) => {
    cartStore.addToCart(product, variant, quantity)
    
    notificationStore.addNotification({
      type: 'success',
      title: 'Produit ajouté',
      message: `${product.name} a été ajouté à votre panier`,
      duration: 3000
    })
  }

  const toggleWishlistWithNotification = (product, variant = null) => {
    const isInWishlist = wishlistStore.isInWishlist(product.id, variant?.id)
    wishlistStore.toggleWishlist(product, variant)
    
    notificationStore.addNotification({
      type: isInWishlist ? 'info' : 'success',
      title: isInWishlist ? 'Retiré de la wishlist' : 'Ajouté à la wishlist',
      message: `${product.name} ${isInWishlist ? 'retiré de' : 'ajouté à'} votre liste de souhaits`,
      duration: 3000
    })
  }

  return {
    addToCartWithNotification,
    toggleWishlistWithNotification,
    cartStore,
    wishlistStore,
    notificationStore
  }
}
