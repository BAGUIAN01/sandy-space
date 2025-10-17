import { cn } from '@/lib/utils'

export function Badge({ 
  variant = 'default', 
  size = 'default', 
  className, 
  ...props 
}) {
  const baseStyles = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
  
  const variants = {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-foreground',
    success: 'border-transparent bg-green-500 text-white hover:bg-green-600',
    warning: 'border-transparent bg-yellow-500 text-white hover:bg-yellow-600',
    info: 'border-transparent bg-blue-500 text-white hover:bg-blue-600'
  }
  
  const sizes = {
    default: 'px-2.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  }
  
  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
}

// Badge spécialisé pour les réductions
export function DiscountBadge({ discount, className, ...props }) {
  return (
    <Badge 
      variant="destructive" 
      className={cn('absolute top-2 right-2 z-10', className)}
      {...props}
    >
      -{discount}%
    </Badge>
  )
}

// Badge pour le statut des produits
export function StatusBadge({ status, className, ...props }) {
  const statusConfig = {
    NEW: { variant: 'success', text: 'Nouveau' },
    SALE: { variant: 'destructive', text: 'Promo' },
    OUT_OF_STOCK: { variant: 'secondary', text: 'Rupture' },
    LIMITED: { variant: 'warning', text: 'Stock limité' }
  }
  
  const config = statusConfig[status] || { variant: 'default', text: status }
  
  return (
    <Badge 
      variant={config.variant} 
      className={cn('absolute top-2 left-2 z-10', className)}
      {...props}
    >
      {config.text}
    </Badge>
  )
}
