"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  ArrowLeft,
  Download,
  Share2
} from 'lucide-react'

function ConfirmationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const orderId = searchParams.get('orderId')

  useEffect(() => {
    // Simuler la récupération des détails de la commande
    const fetchOrderDetails = async () => {
      setIsLoading(true)
      
      // Simulation d'un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Données simulées de la commande
      setOrderDetails({
        id: orderId || 'CMD-' + Date.now(),
        status: 'confirmed',
        orderDate: new Date().toLocaleDateString('fr-FR'),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
        items: [
          {
            id: '1',
            name: 'Robe Élégante Noire',
            quantity: 1,
            price: 45000,
            image: '/images/robes/cmgv89opa0028ztywhjo2g2pl.png'
          },
          {
            id: '2',
            name: 'Robe Business Marine',
            quantity: 2,
            price: 38000,
            image: '/images/robes/cmgvjs1ji003qzt8ogmqiecg4.jpg'
          }
        ],
        shipping: {
          firstName: 'Marie',
          lastName: 'Koné',
          email: 'marie.kone@email.com',
          phone: '+225 07 12 34 56 78',
          address: 'Cocody, Riviera 3',
          city: 'Abidjan',
          postalCode: '00225',
          country: 'Côte d\'Ivoire'
        },
        payment: {
          method: 'Carte bancaire',
          lastFour: '1234',
          amount: 121000
        }
      })
      
      setIsLoading(false)
    }

    fetchOrderDetails()
  }, [orderId])

  const formatPriceFCFA = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleDownloadInvoice = () => {
    // Simuler le téléchargement de la facture
    console.log('Téléchargement de la facture...')
  }

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Ma commande Sandy Space',
        text: `J'ai passé une commande sur Sandy Space ! Commande #${orderDetails?.id}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // TODO: Afficher une notification
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre commande...</p>
        </div>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Commande introuvable</h2>
          <p className="text-gray-600 mb-6">Cette commande n&apos;existe pas ou a été supprimée.</p>
          <Button onClick={() => router.push('/')}>
            Retour à l&apos;accueil
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Confirmation de commande</h1>
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l&apos;accueil
            </Button>
          </div>

          {/* Statut de la commande */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <h2 className="text-xl font-semibold text-green-800">
                  Commande confirmée !
                </h2>
                <p className="text-green-700">
                  Votre commande #{orderDetails.id} a été confirmée et sera traitée sous peu.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Détails de la commande */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations de livraison */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold">Informations de livraison</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="font-medium">{orderDetails.shipping.firstName} {orderDetails.shipping.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">{orderDetails.shipping.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium">{orderDetails.shipping.address}</p>
                  <p className="text-gray-600">{orderDetails.shipping.postalCode} {orderDetails.shipping.city}</p>
                  <p className="text-gray-600">{orderDetails.shipping.country}</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <div className="flex items-center gap-2 text-blue-800">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Livraison estimée</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  {orderDetails.estimatedDelivery} (3-5 jours ouvrés)
                </p>
              </div>
            </Card>

            {/* Articles commandés */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold">Articles commandés</h3>
              </div>
              
              <div className="space-y-4">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-white rounded-md flex-shrink-0">
                      <Image 
                        src={item.image} 
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPriceFCFA(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Informations de paiement */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold">Informations de paiement</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Méthode de paiement</p>
                  <p className="font-medium">{orderDetails.payment.method}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Montant total</p>
                  <p className="font-semibold text-lg">{formatPriceFCFA(orderDetails.payment.amount)}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Actions et informations */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleDownloadInvoice}
                  className="w-full flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Télécharger la facture
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleShareOrder}
                  className="w-full flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Partager la commande
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => router.push('/orders')}
                  className="w-full"
                >
                  Voir toutes mes commandes
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-gray-900 mb-3">Besoin d&apos;aide ?</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>+225 20 30 40 50</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>support@sandyspace.ci</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}
