"use client"

import { useCartStore } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { MessageCircle, ShoppingCart, ArrowRight } from 'lucide-react'

export function WhatsAppButton({ className = "" }) {
  const { items, getSubtotal } = useCartStore()

  const formatPriceFCFA = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return

    // Créer le message WhatsApp
    let message = `🛍️ *Commande Sandy Space*\n\n`
    message += `Bonjour, je souhaite passer une commande :\n\n`
    
    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`
      message += `   Quantité: ${item.quantity}\n`
      message += `   Prix: ${formatPriceFCFA(item.price * item.quantity)}\n\n`
    })
    
    const subtotal = getSubtotal()
    const shipping = subtotal > 50000 ? 0 : 3275
    const total = subtotal + shipping
    
    message += `💰 *Résumé de la commande:*\n`
    message += `Sous-total: ${formatPriceFCFA(subtotal)}\n`
    message += `Livraison: ${shipping === 0 ? 'Gratuite' : formatPriceFCFA(shipping)}\n`
    message += `*Total: ${formatPriceFCFA(total)}*\n\n`
    message += `Merci de me confirmer la disponibilité et les modalités de livraison.`

    // Numéro WhatsApp (remplacez par votre numéro)
    const phoneNumber = '2250700000000' // Format international sans +
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    
    // Ouvrir WhatsApp
    window.open(whatsappUrl, '_blank')
  }

  if (items.length === 0) {
    return null
  }

  return (
    <Button 
      onClick={handleWhatsAppOrder}
      className={`w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl ${className}`}
    >
      <div className="flex items-center justify-center gap-3">
        <MessageCircle className="h-5 w-5" />
        <span>Commander via WhatsApp</span>
      </div>
    </Button>
  )
}
