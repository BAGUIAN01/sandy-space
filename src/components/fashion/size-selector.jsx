"use client"

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function SizeSelector({ 
  sizes, 
  selectedSize, 
  onSizeSelect, 
  className,
  variant = 'default'
}) {
  const variants = {
    default: 'grid grid-cols-4 gap-2',
    compact: 'flex flex-wrap gap-1',
    list: 'space-y-2'
  }

  return (
    <div className={cn('size-selector', variants[variant], className)}>
      <div className="col-span-full mb-2">
        <span className="text-sm font-medium">Taille :</span>
        {selectedSize && (
          <span className="ml-2 text-sm text-gray-600">{selectedSize}</span>
        )}
      </div>
      
      <div className={cn('grid gap-2', variant === 'default' ? 'grid-cols-4' : 'grid-cols-2')}>
        {sizes.map((size) => (
          <Button
            key={size.value}
            variant={selectedSize === size.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSizeSelect(size.value)}
            disabled={!size.inStock}
            className={cn(
              'relative',
              !size.inStock && 'opacity-50 cursor-not-allowed'
            )}
          >
            {size.label}
            {!size.inStock && (
              <span className="absolute -top-1 -right-1 text-xs text-red-500">✕</span>
            )}
          </Button>
        ))}
      </div>
      
      {selectedSize && (
        <div className="col-span-full mt-2">
          <button className="text-xs text-blue-600 hover:underline">
            Guide des tailles
          </button>
        </div>
      )}
    </div>
  )
}

export function ColorPicker({ 
  colors, 
  selectedColor, 
  onColorSelect, 
  className 
}) {
  return (
    <div className={cn('color-picker', className)}>
      <div className="mb-2">
        <span className="text-sm font-medium">Couleur :</span>
        {selectedColor && (
          <span className="ml-2 text-sm text-gray-600">{selectedColor.name}</span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onColorSelect(color)}
            className={cn(
              'w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110',
              selectedColor?.value === color.value 
                ? 'border-gray-800 ring-2 ring-gray-300' 
                : 'border-gray-300 hover:border-gray-400'
            )}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  )
}

export function QuantitySelector({ 
  value, 
  onChange, 
  min = 1, 
  max = 99, 
  className 
}) {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  return (
    <div className={cn('quantity-selector flex items-center gap-2', className)}>
      <span className="text-sm font-medium">Quantité :</span>
      
      <div className="flex items-center border rounded-md">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDecrement}
          disabled={value <= min}
          className="h-8 w-8 p-0"
        >
          -
        </Button>
        
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const newValue = parseInt(e.target.value)
            if (newValue >= min && newValue <= max) {
              onChange(newValue)
            }
          }}
          min={min}
          max={max}
          className="w-12 text-center border-0 focus:outline-none"
        />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleIncrement}
          disabled={value >= max}
          className="h-8 w-8 p-0"
        >
          +
        </Button>
      </div>
    </div>
  )
}
