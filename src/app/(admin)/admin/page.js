import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, ShoppingBag, Package, TrendingUp, DollarSign } from 'lucide-react'

export const metadata = {
  title: 'Administration - Sandy Space',
  description: 'Panneau d\'administration Sandy Space'
}

export default async function AdminPage() {
  const session = await getServerSession()
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/login')
  }

  // Récupérer les statistiques
  const [
    totalUsers,
    totalOrders,
    totalProducts,
    recentOrders,
    recentUsers
  ] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
  ])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
          <p className="mt-2 text-gray-600">Panneau de contrôle Sandy Space</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Utilisateurs</p>
                <p className="text-2xl font-semibold text-gray-900">{totalUsers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingBag className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Commandes</p>
                <p className="text-2xl font-semibold text-gray-900">{totalOrders}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Produits</p>
                <p className="text-2xl font-semibold text-gray-900">{totalProducts}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">CA Total</p>
                <p className="text-2xl font-semibold text-gray-900">€0</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Commandes récentes */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Commandes Récentes</h3>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">#{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{order.user.name}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">€{order.total}</p>
                      <Badge variant="outline">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Aucune commande récente</p>
            )}
          </Card>

          {/* Utilisateurs récents */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilisateurs Récents</h3>
            {recentUsers.length > 0 ? (
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Aucun utilisateur récent</p>
            )}
          </Card>
        </div>

        {/* Actions rapides */}
        <Card className="p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
              <h4 className="font-medium text-blue-900">Gérer les Produits</h4>
              <p className="text-sm text-blue-700 mt-1">Ajouter, modifier ou supprimer des produits</p>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
              <h4 className="font-medium text-green-900">Gérer les Commandes</h4>
              <p className="text-sm text-green-700 mt-1">Suivre et traiter les commandes</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
              <h4 className="font-medium text-purple-900">Gérer les Utilisateurs</h4>
              <p className="text-sm text-purple-700 mt-1">Modérer les comptes utilisateurs</p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
