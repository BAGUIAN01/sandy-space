import { Badge } from './badge'
import { formatPriceWithIndicators } from '@/lib/price-utils'
import { Zap, TrendingDown, Crown, Star } from 'lucide-react'

export function PriceBadge({ 
  price, 
  originalPrice = null, 
  size = "default",
  showSavings = true,
  showDiscount = true,
  variant = "default"
}) {
  const priceInfo = formatPriceWithIndicators(price, originalPrice)
  
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    default: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2"
  }
  
  const iconSizes = {
    sm: "h-3 w-3",
    default: "h-4 w-4", 
    lg: "h-5 w-5"
  }

  if (!priceInfo.hasDiscount) {
    return null
  }

  const getVariantStyles = () => {
    if (priceInfo.isGreatDeal) {
      return {
        className: "bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg",
        icon: <Crown className={iconSizes[size]} />,
        text: `-${priceInfo.discountPercentage}%`
      }
    } else if (priceInfo.isGoodDeal) {
      return {
        className: "bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg",
        icon: <Zap className={iconSizes[size]} />,
        text: `-${priceInfo.discountPercentage}%`
      }
    } else {
      return {
        className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg",
        icon: <TrendingDown className={iconSizes[size]} />,
        text: `-${priceInfo.discountPercentage}%`
      }
    }
  }

  const variantStyles = getVariantStyles()

  return (
    <div className="flex flex-col gap-1">
      <Badge className={`${variantStyles.className} ${sizeClasses[size]} flex items-center gap-1 font-semibold`}>
        {variantStyles.icon}
        {variantStyles.text}
      </Badge>
      
      {showSavings && priceInfo.formattedSavings && (
        <div className="text-xs text-green-600 font-medium animate-pulse">
          Économisez {priceInfo.formattedSavings}
        </div>
      )}
    </div>
  )
}

export function PriceDisplay({ 
  price, 
  originalPrice = null, 
  size = "default",
  showSavings = true,
  className = ""
}) {
  const priceInfo = formatPriceWithIndicators(price, originalPrice)

  console.log("priceInfo", priceInfo)
  
  const sizeClasses = {
    sm: "text-lg",
    default: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl"
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-baseline gap-2">
        <span className={`${sizeClasses[size]} font-bold text-gray-900`}>
          {priceInfo.formattedPrice}
          {priceInfo.hasDiscount && <span className="text-lg"> 🔥</span>}
        </span>
        
        {priceInfo.formattedOriginalPrice && (
          <span className="text-lg text-gray-400 line-through">
            {priceInfo.formattedOriginalPrice}
          </span>
        )}
      </div>
      
      {showSavings && priceInfo.promotionMessage && (
        <div className="text-sm text-green-600 font-medium">
          {priceInfo.promotionMessage}
        </div>
      )}
    </div>
  )
}
