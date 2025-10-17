"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Ruler, 
  Palette, 
  AlertCircle, 
  CheckCircle,
  Info,
  Grid
} from 'lucide-react'

export function ProductVariants({ 
  product, 
  variants = [], 
  selectedVariant, 
  onVariantChange,
  className = ""
}) {
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [availableVariants, setAvailableVariants] = useState(variants)

  // Grouper les variantes par attribut
  const groupedVariants = variants.reduce((acc, variant) => {
    variant.attributes.forEach(attr => {
      const attrName = attr.attribute.name
      if (!acc[attrName]) {
        acc[attrName] = new Set()
      }
      acc[attrName].add(attr.value)
    })
    return acc
  }, {})

  // Convertir les Sets en Arrays
  Object.keys(groupedVariants).forEach(key => {
    groupedVariants[key] = Array.from(groupedVariants[key])
  })

  // Filtrer les variantes disponibles selon les sélections
  useEffect(() => {
    let filtered = variants

    if (selectedColor) {
      filtered = filtered.filter(variant =>
        variant.attributes.some(attr => 
          attr.attribute.name === 'Couleur' && attr.value === selectedColor
        )
      )
    }

    if (selectedSize) {
      filtered = filtered.filter(variant =>
        variant.attributes.some(attr => 
          attr.attribute.name === 'Taille' && attr.value === selectedSize
        )
      )
    }

    setAvailableVariants(filtered)

    // Mettre à jour la variante sélectionnée
    if (filtered.length > 0) {
      const newSelectedVariant = filtered.find(v => v.stock > 0) || filtered[0]
      if (newSelectedVariant && newSelectedVariant.id !== selectedVariant?.id) {
        onVariantChange?.(newSelectedVariant)
      }
    }
  }, [selectedColor, selectedSize, variants, selectedVariant, onVariantChange])

  // Initialiser les sélections si une variante est déjà sélectionnée
  useEffect(() => {
    if (selectedVariant) {
      selectedVariant.attributes.forEach(attr => {
        if (attr.attribute.name === 'Couleur' && !selectedColor) {
          setSelectedColor(attr.value)
        }
        if (attr.attribute.name === 'Taille' && !selectedSize) {
          setSelectedSize(attr.value)
        }
      })
    }
  }, [selectedVariant, selectedColor, selectedSize])

  // Gestion du changement de couleur
  const handleColorChange = (color) => {
    setSelectedColor(color)
    setSelectedSize('') // Reset size when color changes
  }

  // Gestion du changement de taille
  const handleSizeChange = (size) => {
    setSelectedSize(size)
  }

  // Gestion de la quantité
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (selectedVariant?.stock || 10)) {
      setQuantity(newQuantity)
    }
  }

  // Vérifier si une combinaison est disponible
  const isCombinationAvailable = (color, size) => {
    return variants.some(variant =>
      variant.attributes.some(attr => 
        attr.attribute.name === 'Couleur' && attr.value === color
      ) &&
      variant.attributes.some(attr => 
        attr.attribute.name === 'Taille' && attr.value === size
      ) &&
      variant.stock > 0
    )
  }

  // Récupérer les couleurs disponibles
  const availableColors = groupedVariants['Couleur'] || []
  const availableSizes = groupedVariants['Taille'] || []

  // Si pas de variantes, ne pas afficher le composant
  if (variants.length === 0) {
    return null
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Titre */}
      <div className="flex items-center gap-2">
        <Grid className="h-5 w-5 text-gray-600" />
        <h3 className="text-xl font-semibold text-gray-900">Options disponibles</h3>
      </div>

      {/* Sélecteurs d'attributs */}
      {Object.entries(groupedVariants).map(([attrName, attrValues]) => (
        <div key={attrName} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-lg font-medium text-gray-900 flex items-center gap-2">
              {attrName === 'Couleur' ? (
                <>
                  <Palette className="h-5 w-5 text-gray-600" />
                  Couleur
                </>
              ) : attrName === 'Taille' ? (
                <>
                  <Ruler className="h-5 w-5 text-gray-600" />
                  Taille
                </>
              ) : (
                attrName
              )}
            </label>
            
            {attrName === 'Taille' && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {/* TODO: Ouvrir le guide des tailles */}}
              >
                Guide des tailles
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {attrValues.map((value) => {
              const isSelected = attrName === 'Couleur' ? selectedColor === value : selectedSize === value
              const isAvailable = attrName === 'Couleur' 
                ? true // Les couleurs sont toujours disponibles
                : selectedColor 
                  ? isCombinationAvailable(selectedColor, value)
                  : true

              return (
                <button
                  key={value}
                  onClick={() => {
                    if (attrName === 'Couleur') {
                      handleColorChange(value)
                    } else {
                      handleSizeChange(value)
                    }
                  }}
                  disabled={!isAvailable}
                  className={`
                    relative px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all duration-200
                    ${isSelected 
                      ? 'border-gray-900 bg-gray-900 text-white shadow-lg' 
                      : isAvailable
                        ? 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    }
                    ${attrName === 'Couleur' ? 'min-w-[60px]' : ''}
                  `}
                >
                  {attrName === 'Couleur' ? (
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ 
                          backgroundColor: value.toLowerCase() === 'noir' ? '#000000' :
                                          value.toLowerCase() === 'blanc' ? '#FFFFFF' :
                                          value.toLowerCase() === 'rouge' ? '#FF0000' :
                                          value.toLowerCase() === 'bleu' ? '#0000FF' :
                                          value.toLowerCase() === 'vert' ? '#008000' :
                                          value.toLowerCase() === 'jaune' ? '#FFFF00' :
                                          value.toLowerCase() === 'rose' ? '#FFC0CB' :
                                          value.toLowerCase() === 'gris' ? '#808080' :
                                          '#CCCCCC'
                        }}
                      />
                      <span>{value}</span>
                    </div>
                  ) : (
                    value
                  )}
                  
                  {isSelected && (
                    <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-white bg-gray-900 rounded-full" />
                  )}
                  
                  {!isAvailable && attrName !== 'Couleur' && (
                    <AlertCircle className="absolute -top-1 -right-1 h-4 w-4 text-gray-400" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Message d'aide pour la sélection */}
          {attrName === 'Couleur' && selectedColor && (
            <p className="text-sm text-gray-600">
              Couleur sélectionnée : <span className="font-medium text-gray-900">{selectedColor}</span>
            </p>
          )}
          
          {attrName === 'Taille' && selectedColor && (
            <p className="text-sm text-gray-600">
              Tailles disponibles pour {selectedColor} : 
              <span className="font-medium text-gray-900 ml-1">
                {attrValues.filter(size => isCombinationAvailable(selectedColor, size)).join(', ')}
              </span>
            </p>
          )}
        </div>
      ))}

      {/* Sélecteur de quantité */}
      {selectedVariant && (
        <div className="space-y-4">
          <label className="text-lg font-medium text-gray-900">Quantité</label>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                -
              </button>
              
              <span className="px-4 py-2 text-lg font-medium text-gray-900 min-w-[60px] text-center">
                {quantity}
              </span>
              
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= selectedVariant.stock}
                className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>

            <div className="text-sm text-gray-600">
              {selectedVariant.stock > 0 ? (
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  {selectedVariant.stock} disponibles
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  Rupture de stock
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Résumé de la sélection */}
      {(selectedColor || selectedSize) && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Sélection actuelle</h4>
          <div className="flex flex-wrap gap-2">
            {selectedColor && (
              <Badge className="bg-blue-100 text-blue-800">
                Couleur: {selectedColor}
              </Badge>
            )}
            {selectedSize && (
              <Badge className="bg-green-100 text-green-800">
                Taille: {selectedSize}
              </Badge>
            )}
            <Badge className="bg-gray-100 text-gray-800">
              Quantité: {quantity}
            </Badge>
          </div>
        </div>
      )}

      {/* Avertissement si pas de variante disponible */}
      {availableVariants.length === 0 && (selectedColor || selectedSize) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-sm text-red-800">
              Cette combinaison n'est pas disponible pour le moment.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}