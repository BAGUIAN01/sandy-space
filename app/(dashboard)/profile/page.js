import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Calendar, Shield, MapPin, Phone } from 'lucide-react'

export const metadata = {
  title: 'Mon Profil - Sandy Space',
  description: 'Gérez votre profil et vos informations personnelles'
}

export default async function ProfilePage() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/auth/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      addresses: true,
      orders: {
        take: 5,
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="mt-2 text-gray-600">Gérez vos informations personnelles et vos préférences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations personnelles */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'secondary'}>
                      {user.role === 'ADMIN' ? 'Administrateur' : 'Client'}
                    </Badge>
                    {user.isActive && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Actif
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  {user.username && (
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Nom d&apos;utilisateur</p>
                        <p className="font-medium">{user.username}</p>
                      </div>
                    </div>
                  )}

                  {user.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Membre depuis</p>
                      <p className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  {user.lastLoginAt && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Dernière connexion</p>
                        <p className="font-medium">
                          {new Date(user.lastLoginAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <Button variant="outline">
                  Modifier mes informations
                </Button>
              </div>
            </Card>

            {/* Adresses */}
            {user.addresses.length > 0 && (
              <Card className="p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mes Adresses</h3>
                <div className="space-y-4">
                  {user.addresses.map((address) => (
                    <div key={address.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{address.label}</p>
                          {address.isDefault && (
                            <Badge variant="outline" className="text-xs">Par défaut</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {address.firstName} {address.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.address1}
                          {address.address2 && `, ${address.address2}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.postalCode} {address.city}
                        </p>
                        <p className="text-sm text-gray-600">{address.country}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Commandes récentes */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Commandes Récentes</h3>
              {user.orders.length > 0 ? (
                <div className="space-y-3">
                  {user.orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">#{order.orderNumber}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Aucune commande récente</p>
              )}
            </Card>

            {/* Actions rapides */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Mes Commandes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Ma Liste de Souhaits
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Mes Adresses
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Changer le Mot de Passe
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
