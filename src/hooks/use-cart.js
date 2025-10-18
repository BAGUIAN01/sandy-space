import { useState, useEffect, useCallback } from 'react'

export function useCart() {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  // Charger le panier depuis le localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  // Sauvegarder le panier dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addToCart = useCallback((product, variant = null, quantity = 1) => {
    const cartItem = {
      id: variant ? `${product.id}-${variant.id}` : product.id,
      productId: product.id,
      variantId: variant?.id,
      name: product.name,
      variant: variant ? `${variant.attributes?.map(a => a.value).join(', ')}` : null,
      price: variant ? variant.price : product.basePrice,
      image: product.images?.[0]?.url || '/placeholder.jpg',
      quantity,
      addedAt: new Date().toISOString()
    }

    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === cartItem.id)
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      
      return [...prevItems, cartItem]
    })
  }, [])

  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }, [removeFromCart])

  const removeFromCart = useCallback((itemId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }, [items])

  const getSubtotal = useCallback(() => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }, [items])

  const openCart = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeCart = useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    items,
    isOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getSubtotal,
    openCart,
    closeCart
  }
}

export function useWishlist() {
  const [items, setItems] = useState([])

  // Charger la wishlist depuis le localStorage au montage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      setItems(JSON.parse(savedWishlist))
    }
  }, [])

  // Sauvegarder la wishlist dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items))
  }, [items])

  const addToWishlist = useCallback((product, variant = null) => {
    const wishlistItem = {
      id: variant ? `${product.id}-${variant.id}` : product.id,
      productId: product.id,
      variantId: variant?.id,
      name: product.name,
      variant: variant ? `${variant.attributes?.map(a => a.value).join(', ')}` : null,
      price: variant ? variant.price : product.basePrice,
      image: product.images?.[0]?.url || '/placeholder.jpg',
      addedAt: new Date().toISOString()
    }

    setItems(prevItems => {
      const exists = prevItems.some(item => item.id === wishlistItem.id)
      if (exists) return prevItems
      return [...prevItems, wishlistItem]
    })
  }, [])

  const removeFromWishlist = useCallback((itemId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId))
  }, [])

  const isInWishlist = useCallback((productId, variantId = null) => {
    const itemId = variantId ? `${productId}-${variantId}` : productId
    return items.some(item => item.id === itemId)
  }, [items])

  const clearWishlist = useCallback(() => {
    setItems([])
  }, [])

  return {
    items,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist
  }
}

export function useCompare() {
  const [items, setItems] = useState([])
  const MAX_COMPARE_ITEMS = 4

  // Charger la liste de comparaison depuis le localStorage au montage
  useEffect(() => {
    const savedCompare = localStorage.getItem('compare')
    if (savedCompare) {
      setItems(JSON.parse(savedCompare))
    }
  }, [])

  // Sauvegarder la liste de comparaison dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('compare', JSON.stringify(items))
  }, [items])

  const addToCompare = useCallback((product) => {
    if (items.length >= MAX_COMPARE_ITEMS) {
      return { success: false, message: `Maximum ${MAX_COMPARE_ITEMS} produits à comparer` }
    }

    const exists = items.some(item => item.id === product.id)
    if (exists) {
      return { success: false, message: 'Produit déjà dans la comparaison' }
    }

    const compareItem = {
      id: product.id,
      name: product.name,
      price: product.basePrice,
      image: product.images?.[0]?.url || '/placeholder.jpg',
      brand: product.brand?.name,
      category: product.category?.name,
      addedAt: new Date().toISOString()
    }

    setItems(prevItems => [...prevItems, compareItem])
    return { success: true, message: 'Produit ajouté à la comparaison' }
  }, [items])

  const removeFromCompare = useCallback((productId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId))
  }, [])

  const isInCompare = useCallback((productId) => {
    return items.some(item => item.id === productId)
  }, [items])

  const clearCompare = useCallback(() => {
    setItems([])
  }, [])

  return {
    items,
    addToCompare,
    removeFromCompare,
    isInCompare,
    clearCompare,
    maxItems: MAX_COMPARE_ITEMS
  }
}
