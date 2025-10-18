import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Heart, Trash2, Plus, Minus } from 'lucide-react'

// Fonction utilitaire pour formater les prix en FCFA
const formatPriceFCFA = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price).replace('XOF', 'FCFA')
}

export function CartDrawer({ 
  isOpen, 
  onClose, 
  items = [], 
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  className 
}) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 50000 ? 0 : 3275 // 5€ = 3275 FCFA
  const total = subtotal + shipping

  return (
    <div className={cn(
      'fixed inset-0 z-50 flex',
      isOpen ? 'visible' : 'invisible'
    )}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={cn(
        'relative bg-white shadow-lg flex flex-col w-80 h-full ml-auto transform transition-transform duration-300',
        isOpen ? 'translate-x-0' : 'translate-x-full',
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            Panier ({items.length})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingCart className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium mb-2">Votre panier est vide</p>
              <p className="text-sm text-center">
                Découvrez nos produits et ajoutez-les à votre panier
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="p-3">
                  <div className="flex gap-3">
                    {/* Image */}
                    <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || '/images/robes/image13-1_2-png202504140234401.png'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/images/robes/image13-1_2-png202504140234401.png'
                        }}
                      />
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2 mb-1">
                        {item.name}
                      </h3>
                      
                      {item.variant && (
                        <p className="text-xs text-gray-500 mb-1">
                          {item.variant}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">
                          {formatPriceFCFA(item.price)}
                        </span>
                        
                        {/* Quantity controls */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-6 w-6 p-0 cursor-pointer"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="text-sm font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 p-0 cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Remove button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-3">
            {/* Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{formatPriceFCFA(subtotal)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Livraison</span>
                <span>
                  {shipping === 0 ? (
                    <Badge variant="success">Gratuite</Badge>
                  ) : (
                    formatPriceFCFA(shipping)
                  )}
                </span>
              </div>
              
              <div className="flex justify-between font-semibold text-base border-t pt-2">
                <span>Total</span>
                <span>{formatPriceFCFA(total)}</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full cursor-pointer">
                Commander ({formatPriceFCFA(total)})
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full cursor-pointer"
                onClick={onClearCart}
              >
                Vider le panier
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function CartButton({ 
  itemCount = 0, 
  onClick,
  className 
}) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className={cn('relative', className)}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </Badge>
      )}
    </Button>
  )
}
