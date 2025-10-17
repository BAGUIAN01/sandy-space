"use client"

import { SWRConfig } from 'swr'

// Configuration globale SWR
const swrConfig = {
  // Fetcher par défaut
  fetcher: async (url) => {
    const response = await fetch(url)
    
    if (!response.ok) {
      const error = new Error('An error occurred while fetching the data.')
      error.info = await response.json().catch(() => ({}))
      error.status = response.status
      throw error
    }
    
    return response.json()
  },
  
  // Configuration de revalidation
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  
  // Configuration d'erreur
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  
  // Configuration de cache
  dedupingInterval: 60000, // 1 minute
  
  // Callbacks
  onError: (error, key) => {
    console.error('SWR Error:', error, 'Key:', key)
  },
  
  onSuccess: (data, key) => {
    console.log('SWR Success:', key)
  }
}

export function SWRProvider({ children }) {
  return (
    <SWRConfig value={swrConfig}>
      {children}
    </SWRConfig>
  )
}
