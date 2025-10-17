import useSWR from 'swr'

// Fetcher générique pour SWR
const fetcher = async (url) => {
  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch (parseError) {
        errorData = { error: `Failed to parse error response: ${parseError.message}` }
      }
      
      const error = new Error(`HTTP ${response.status}: ${errorData.error || 'Request failed'}`)
      error.info = errorData
      error.status = response.status
      error.url = url
      
      console.error('SWR Fetch Error:', { 
        url, 
        status: response.status, 
        statusText: response.statusText,
        error: errorData,
        headers: Object.fromEntries(response.headers.entries())
      })
      throw error
    }
    
    return response.json()
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      // Erreur de réseau
      const networkError = new Error('Network error: Unable to connect to server')
      networkError.url = url
      networkError.status = 0
      throw networkError
    }
    throw error
  }
}

// Hook pour récupérer un produit par slug
export function useProduct(slug) {
  // Validation du slug
  const isValidSlug = slug && typeof slug === 'string' && slug.length > 0
  
  const { data, error, isLoading, mutate } = useSWR(
    isValidSlug ? `/api/products/${slug}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // Cache pendant 1 minute
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onError: (error) => {
        console.warn('useProduct error:', {
          slug,
          error: error.message,
          url: `/api/products/${slug}`
        })
      }
    }
  )

  return {
    product: data?.success ? data.data : null,
    isLoading,
    isError: error,
    error: error?.info?.error || error?.message,
    mutate
  }
}

// Hook pour récupérer les produits similaires
export function useSimilarProducts(productId, limit = 4) {
  // Validation des paramètres
  const isValidId = productId && (typeof productId === 'string' || typeof productId === 'number')
  const isValidLimit = limit && limit > 0 && limit <= 20
  
  const { data, error, isLoading, mutate } = useSWR(
    isValidId && isValidLimit ? `/api/products/${productId}/similar?limit=${limit}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // Cache pendant 5 minutes
      errorRetryCount: 2,
      errorRetryInterval: 5000,
      onError: (error) => {
        console.warn('useSimilarProducts error:', {
          productId,
          limit,
          error: error.message,
          url: `/api/products/${productId}/similar?limit=${limit}`
        })
      }
    }
  )

  return {
    products: data?.success ? data.data : [],
    isLoading,
    isError: error,
    error: error?.info?.error || error?.message,
    mutate
  }
}

// Hook pour récupérer les produits featured
export function useFeaturedProducts(params = {}) {
  const { limit = 6, categorySlug, sortBy = 'newest', page = 1 } = params
  
  // Validation des paramètres
  const isValidLimit = limit && limit > 0 && limit <= 100
  const isValidPage = page && page > 0
  const isValidSortBy = sortBy && ['popular', 'newest', 'price-low', 'price-high', 'rating'].includes(sortBy)
  
  const searchParams = new URLSearchParams({
    limit: Math.min(limit, 100).toString(),
    page: Math.max(page, 1).toString(),
    sortBy: isValidSortBy ? sortBy : 'newest'
  })
  
  if (categorySlug && typeof categorySlug === 'string') {
    searchParams.append('category', categorySlug)
  }
  
  const { data, error, isLoading, mutate } = useSWR(
    isValidLimit && isValidPage ? `/api/products/featured?${searchParams.toString()}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // Cache pendant 5 minutes
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onError: (error) => {
        console.warn('useFeaturedProducts error:', {
          params,
          error: error.message,
          url: `/api/products/featured?${searchParams.toString()}`
        })
      }
    }
  )

  return {
    products: data?.success ? data.data : [],
    pagination: data?.success ? {
      total: data.total,
      page: data.page,
      totalPages: data.totalPages,
      hasNextPage: data.hasNextPage,
      hasPrevPage: data.hasPrevPage
    } : null,
    isLoading,
    isError: error,
    error: error?.info?.error || error?.message,
    mutate
  }
}

// Hook pour récupérer les catégories
export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/categories',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 600000, // Cache pendant 10 minutes
      errorRetryCount: 3,
      errorRetryInterval: 5000
    }
  )

  return {
    categories: data?.success ? data.data : [],
    isLoading,
    isError: error,
    error: error?.info?.error || error?.message,
    mutate
  }
}

// Hook pour récupérer les produits de la page robes
export function useRobesProducts(params = {}) {
  return useFeaturedProducts({
    ...params,
    categorySlug: 'robes'
  })
}
