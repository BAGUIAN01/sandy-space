"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  Eye,
  Download,
  ArrowLeft,
  Calendar,
  MapPin
} from 'lucide-react'

const statusConfig = {
  pending: { 
    label: 'En attente', 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: Clock 
  },
  confirmed: { 
    label: 'Confirmée', 
    color: 'bg-blue-100 text-blue-800', 
    icon: CheckCircle 
  },
  shipped: { 
    label: 'Expédiée', 
    color: 'bg-purple-100 text-purple-800', 
    icon: Truck 
  },
  delivered: { 
    label: 'Livrée', 
    color: 'bg-green-100 text-green-800', 
    icon: CheckCircle 
  },
  cancelled: { 
    label: 'Annulée', 
    color: 'bg-red-100 text-red-800', 
    icon: XCircle 
  }
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    // Simuler la récupération des commandes
    const fetchOrders = async () => {
      setIsLoading(true)
      
      // Simulation d'un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Données simulées des commandes
      setOrders([
        {
          id: 'CMD-001',
          status: 'delivered',
          orderDate: '2024-01-15',
          deliveryDate: '2024-01-18',
          total: 121000,
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
            city: 'Abidjan'
          }
        },
        {
          id: 'CMD-002',
          status: 'shipped',
          orderDate: '2024-01-20',
          deliveryDate: null,
          total: 85000,
          items: [
            {
              id: '3',
              name: 'Robe Cocktail Dorée',
              quantity: 1,
              price: 85000,
              image: '/images/robes/cmgvjs1sf003uzt8oycat2fva.jpg'
            }
          ],
          shipping: {
            firstName: 'Marie',
            lastName: 'Koné',
            city: 'Abidjan'
          }
        },
        {
          id: 'CMD-003',
          status: 'confirmed',
          orderDate: '2024-01-22',
          deliveryDate: null,
          total: 156000,
          items: [
            {
              id: '4',
              name: 'Robe de Mariée',
              quantity: 1,
              price: 156000,
              image: '/images/robes/cmgv8dgen002oztb8tx4ypkxq.png'
            }
          ],
          shipping: {
            firstName: 'Marie',
            lastName: 'Koné',
            city: 'Abidjan'
          }
        }
      ])
      
      setIsLoading(false)
    }

    fetchOrders()
  }, [])

  const formatPriceFCFA = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter)

  const handleViewOrder = (orderId) => {
    router.push(`/confirmation?orderId=${orderId}`)
  }

  const handleDownloadInvoice = (orderId) => {
    console.log(`Téléchargement de la facture pour la commande ${orderId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos commandes...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Mes commandes</h1>
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l&apos;accueil
            </Button>
          </div>

          {/* Filtres */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              Toutes ({orders.length})
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilter('pending')}
              size="sm"
            >
              En attente ({orders.filter(o => o.status === 'pending').length})
            </Button>
            <Button
              variant={filter === 'shipped' ? 'default' : 'outline'}
              onClick={() => setFilter('shipped')}
              size="sm"
            >
              Expédiées ({orders.filter(o => o.status === 'shipped').length})
            </Button>
            <Button
              variant={filter === 'delivered' ? 'default' : 'outline'}
              onClick={() => setFilter('delivered')}
              size="sm"
            >
              Livrées ({orders.filter(o => o.status === 'delivered').length})
            </Button>
          </div>
        </div>

        {/* Liste des commandes */}
        {filteredOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucune commande</h2>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Vous n&apos;avez pas encore passé de commande.'
                : `Aucune commande avec le statut "${statusConfig[filter]?.label}".`
              }
            </p>
            <Button onClick={() => router.push('/products')}>
              Découvrir nos produits
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon
              return (
                <Card key={order.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">Commande #{order.id}</h3>
                        <Badge className={statusConfig[order.status].color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[order.status].label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Commandée le {formatDate(order.orderDate)}</span>
                        </div>
                        {order.deliveryDate && (
                          <div className="flex items-center gap-1">
                            <Truck className="h-4 w-4" />
                            <span>Livrée le {formatDate(order.deliveryDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatPriceFCFA(order.total)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} article{order.items.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Articles */}
                  <div className="mb-4">
                    <div className="flex gap-4 overflow-x-auto">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 min-w-0 flex-shrink-0">
                          <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0">
                            <Image 
                              src={item.image} 
                              alt={item.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Quantité: {item.quantity}
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatPriceFCFA(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Adresse de livraison */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>
                        Livré à {order.shipping.firstName} {order.shipping.lastName}, {order.shipping.city}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewOrder(order.id)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Voir les détails
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadInvoice(order.id)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Facture
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
