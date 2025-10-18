"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCartStore } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input, Label, Textarea, Select } from '@/components/ui/input-enhanced'
import { 
  ShoppingCart, 
  Truck, 
  CreditCard, 
  CheckCircle,
  ArrowLeft,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard as CreditCardIcon,
  Lock
} from 'lucide-react'

const steps = [
  { id: 1, name: 'Panier', icon: ShoppingCart, status: 'completed' },
  { id: 2, name: 'Livraison', icon: Truck, status: 'current' },
  { id: 3, name: 'Paiement', icon: CreditCard, status: 'upcoming' },
  { id: 4, name: 'Confirmation', icon: CheckCircle, status: 'upcoming' }
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalItems, getSubtotal, clearCart } = useCartStore()
  const [currentStep, setCurrentStep] = useState(2)
  const [isLoading, setIsLoading] = useState(false)

  // État du formulaire de livraison
  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Côte d\'Ivoire',
    deliveryInstructions: ''
  })

  // État du formulaire de paiement
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    saveCard: false
  })

  // Rediriger si le panier est vide
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items.length, router])

  const handleShippingSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simuler la validation
    setTimeout(() => {
      setCurrentStep(3)
      setIsLoading(false)
    }, 1000)
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simuler le traitement du paiement
    setTimeout(() => {
      setCurrentStep(4)
      setIsLoading(false)
    }, 2000)
  }

  const handleOrderComplete = () => {
    clearCart()
    router.push('/')
  }

  const formatPriceFCFA = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  // Calculer le total avec livraison
  const calculateTotal = () => {
    const subtotal = getSubtotal()
    const shipping = subtotal > 50000 ? 0 : 3275
    return subtotal + shipping
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Panier vide</h2>
          <p className="text-gray-600 mb-6">Votre panier est vide. Ajoutez des produits pour continuer.</p>
          <Button onClick={() => router.push('/products')}>
            Continuer mes achats
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête avec étapes */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Finaliser votre commande
              </h1>
              <p className="text-slate-600 mt-2">Remplissez vos informations pour compléter votre achat</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </div>

          {/* Barre de progression */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    step.status === 'completed' 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
                      : step.status === 'current'
                      ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/25'
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}>
                    <step.icon className="h-6 w-6" />
                  </div>
                  <span className={`ml-3 text-sm font-semibold transition-colors duration-300 ${
                    step.status === 'completed' || step.status === 'current'
                      ? 'text-slate-900'
                      : 'text-slate-400'
                  }`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-20 h-1 mx-6 rounded-full transition-colors duration-300 ${
                      step.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {currentStep === 2 && (
              <Card className="p-8 bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Truck className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Informations de livraison</h2>
                    <p className="text-slate-600">Où souhaitez-vous recevoir votre commande ?</p>
                  </div>
                </div>

                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Prénom *</Label>
                      <Input
                        type="text"
                        required
                        value={shippingForm.firstName}
                        onChange={(e) => setShippingForm(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div>
                      <Label>Nom *</Label>
                      <Input
                        type="text"
                        required
                        value={shippingForm.lastName}
                        onChange={(e) => setShippingForm(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        required
                        value={shippingForm.email}
                        onChange={(e) => setShippingForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div>
                      <Label>Téléphone *</Label>
                      <Input
                        type="tel"
                        required
                        value={shippingForm.phone}
                        onChange={(e) => setShippingForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+225 XX XX XX XX"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Adresse *</Label>
                    <Input
                      type="text"
                      required
                      value={shippingForm.address}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Rue, numéro, quartier"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label>Ville *</Label>
                      <Input
                        type="text"
                        required
                        value={shippingForm.city}
                        onChange={(e) => setShippingForm(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="Abidjan"
                      />
                    </div>
                    <div>
                      <Label>Code postal</Label>
                      <Input
                        type="text"
                        value={shippingForm.postalCode}
                        onChange={(e) => setShippingForm(prev => ({ ...prev, postalCode: e.target.value }))}
                        placeholder="00225"
                      />
                    </div>
                    <div>
                      <Label>Pays *</Label>
                      <Select
                        required
                        value={shippingForm.country}
                        onChange={(e) => setShippingForm(prev => ({ ...prev, country: e.target.value }))}
                      >
                        <option value="Côte d'Ivoire">Côte d&apos;Ivoire</option>
                        <option value="Sénégal">Sénégal</option>
                        <option value="Mali">Mali</option>
                        <option value="Burkina Faso">Burkina Faso</option>
                        <option value="Ghana">Ghana</option>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Instructions de livraison</Label>
                    <Textarea
                      value={shippingForm.deliveryInstructions}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, deliveryInstructions: e.target.value }))}
                      placeholder="Instructions spéciales pour la livraison..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Validation...' : 'Continuer vers le paiement'}
                  </Button>
                </form>
              </Card>
            )}

            {currentStep === 3 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCardIcon className="h-5 w-5 text-blue-500" />
                  <h2 className="text-xl font-semibold">Informations de paiement</h2>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom sur la carte *
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentForm.cardName}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, cardName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nom tel qu&apos;affiché sur la carte"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de carte *
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentForm.cardNumber}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date d&apos;expiration *
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentForm.expiryDate}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="MM/AA"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentForm.cvv}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, cvv: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="saveCard"
                      checked={paymentForm.saveCard}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, saveCard: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
                      Sauvegarder cette carte pour les prochains achats
                    </label>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="flex items-center gap-2 text-blue-800">
                      <Lock className="h-4 w-4" />
                      <span className="text-sm font-medium">Paiement sécurisé</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Vos informations de paiement sont cryptées et sécurisées.
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Traitement...' : 'Confirmer la commande'}
                  </Button>
                </form>
              </Card>
            )}

            {currentStep === 4 && (
              <Card className="p-6">
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Commande confirmée !</h2>
                  <p className="text-gray-600 mb-6">
                    Merci pour votre commande. Vous recevrez un email de confirmation sous peu.
                  </p>
                  <div className="space-y-2">
                    <Button 
                      onClick={handleOrderComplete} 
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold"
                    >
                      Retour à l&apos;accueil
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/orders')} className="w-full">
                      Voir mes commandes
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Résumé de la commande */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4 bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Résumé de la commande</h3>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                    <div className="w-16 h-16 bg-white rounded-xl flex-shrink-0 shadow-sm">
                      <Image 
                        src={item.image} 
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-slate-500">
                        Quantité: {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-slate-900">
                        {formatPriceFCFA(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Sous-total</span>
                  <span className="font-semibold text-slate-900">{formatPriceFCFA(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Livraison</span>
                  <span className="font-semibold text-slate-900">
                    {getSubtotal() > 50000 ? (
                      <Badge className="bg-emerald-100 text-emerald-800">Gratuite</Badge>
                    ) : (
                      formatPriceFCFA(3275)
                    )}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-slate-900">Total</span>
                  <span className="text-slate-900">{formatPriceFCFA(calculateTotal())}</span>
                </div>
              </div>

              {getSubtotal() > 50000 && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-800">
                      Livraison gratuite !
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700 mt-1">
                    Pour toute commande supérieure à 50 000 FCFA
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
