"use client"

import { useRouter } from 'next/navigation'
import { useCartStore } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { ShoppingCart, ArrowRight } from 'lucide-react'

export function CheckoutButton({ className = "" }) {
  const router = useRouter()
  const { items, getTotal } = useCartStore()

  const handleCheckout = () => {
    if (items.length === 0) {
      return
    }
    router.push('/checkout')
  }

  if (items.length === 0) {
    return null
  }

  return (
    <Button 
      onClick={handleCheckout}
      className={`w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl ${className}`}
    >
      <div className="flex items-center justify-center gap-3">
        <ShoppingCart className="h-5 w-5" />
        <span>Commander ({items.length})</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </Button>
  )
}
