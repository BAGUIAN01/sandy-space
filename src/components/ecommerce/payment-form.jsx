"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  CreditCard, 
  Lock, 
  Shield, 
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export function PaymentForm({ onSubmit, isLoading = false }) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    saveCard: false
  })

  const [errors, setErrors] = useState({})

  const formatCardNumber = (value) => {
    // Supprimer tous les espaces et caractères non numériques
    const cleaned = value.replace(/\D/g, '')
    // Ajouter des espaces tous les 4 chiffres
    return cleaned.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiryDate = (value) => {
    // Supprimer tous les caractères non numériques
    const cleaned = value.replace(/\D/g, '')
    // Ajouter un slash après 2 chiffres
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4)
    }
    return cleaned
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Le nom sur la carte est requis'
    }

    if (!formData.cardNumber.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Le numéro de carte est requis'
    } else if (formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Le numéro de carte doit contenir 16 chiffres'
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'La date d\'expiration est requise'
    } else {
      const [month, year] = formData.expiryDate.split('/')
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear() % 100
      const currentMonth = currentDate.getMonth() + 1

      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Mois invalide'
      } else if (parseInt(year) < currentYear || 
                 (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'La carte a expiré'
      }
    }

    if (!formData.cvv) {
      newErrors.cvv = 'Le CVV est requis'
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'Le CVV doit contenir au moins 3 chiffres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field, value) => {
    let formattedValue = value

    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value)
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value)
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4)
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }))
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="h-5 w-5 text-blue-500" />
        <h2 className="text-xl font-semibold">Informations de paiement</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom sur la carte */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom sur la carte *
          </label>
          <input
            type="text"
            value={formData.cardName}
            onChange={(e) => handleInputChange('cardName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.cardName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nom tel qu&apos;affiché sur la carte"
          />
          {errors.cardName && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.cardName}
            </p>
          )}
        </div>

        {/* Numéro de carte */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de carte *
          </label>
          <input
            type="text"
            value={formData.cardNumber}
            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.cardNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
          />
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.cardNumber}
            </p>
          )}
        </div>

        {/* Date d'expiration et CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date d&apos;expiration *
            </label>
            <input
              type="text"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.expiryDate ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="MM/AA"
              maxLength={5}
            />
            {errors.expiryDate && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.expiryDate}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVV *
            </label>
            <input
              type="text"
              value={formData.cvv}
              onChange={(e) => handleInputChange('cvv', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.cvv ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="123"
              maxLength={4}
            />
            {errors.cvv && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.cvv}
              </p>
            )}
          </div>
        </div>

        {/* Sauvegarder la carte */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="saveCard"
            checked={formData.saveCard}
            onChange={(e) => setFormData(prev => ({ ...prev, saveCard: e.target.checked }))}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
            Sauvegarder cette carte pour les prochains achats
          </label>
        </div>

        {/* Informations de sécurité */}
        <div className="bg-blue-50 p-4 rounded-md">
          <div className="flex items-center gap-2 text-blue-800 mb-2">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-medium">Paiement sécurisé</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-blue-700">
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span>Chiffrement SSL</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span>PCI DSS</span>
            </div>
          </div>
          <p className="text-sm text-blue-700 mt-2">
            Vos informations de paiement sont cryptées et sécurisées. 
            Nous ne stockons jamais vos données de carte bancaire.
          </p>
        </div>

        {/* Bouton de soumission */}
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Traitement...' : 'Confirmer la commande'}
        </Button>
      </form>
    </Card>
  )
}
