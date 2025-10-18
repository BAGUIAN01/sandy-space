import Link from 'next/link'
import Image from 'next/image'
import { FASHION_CATEGORIES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HeroCarousel } from '@/components/layout/hero-carousel'
import { RobesSection } from '@/components/fashion/robes-section'
import { BentoRobesGrid } from '@/components/fashion/bento-robes-grid'
import { ArrowRight, Star, Truck, Shield, RotateCcw, Crown, Sparkles, Shirt, Square, Pill, Footprints, Gem, ShoppingBag } from 'lucide-react'

// Mapping des icônes
const iconMap = {
  Shirt: Shirt,
  Square: Square,
  Pill: Pill,
  Footprints: Footprints,
  Gem: Gem,
  ShoppingBag: ShoppingBag
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Section Bento Grid Robes */}
      <BentoRobesGrid />

      {/* Section Robes */}
      <RobesSection />

      {/* Catégories épurées */}
      <section className="py-16 px-4 bg-gray-50/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-primary-bold text-gray-900 mb-4">
              Nos Collections
            </h2>
            <p className="text-lg text-gray-600 font-primary">
              Explorez nos catégories soigneusement sélectionnées
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {FASHION_CATEGORIES.map((category) => (
              <Card key={category.slug} className="group hover:shadow-md transition-all duration-200 border-0 shadow-sm">
                <CardContent className="p-6">
                  <Link href={`/products/category/${category.slug}`} className="block">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                        {(() => {
                          const IconComponent = iconMap[category.icon]
                          return IconComponent ? <IconComponent className="h-8 w-8 text-gray-600" /> : null
                        })()}
                      </div>
                      <h3 className="text-lg font-primary-semibold text-gray-900 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 font-primary">
                        {category.description}
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Découvrir
                      </Button>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages épurés */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-primary-bold text-gray-900 mb-4">
              Pourquoi choisir Sandy Space ?
            </h2>
            <p className="text-lg text-gray-600 font-primary">
              Des avantages exclusifs pour votre shopping
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Truck className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-primary-semibold text-gray-900 mb-2">
                Livraison gratuite
              </h3>
              <p className="text-gray-600 font-primary">
                Livraison gratuite dès 50€ d&apos;achat
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-luxury text-gray-900 mb-2">
                Paiement sécurisé
              </h3>
              <p className="text-gray-600 font-body">
                Vos données sont protégées
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-luxury text-gray-900 mb-2">
                Retour facile
              </h3>
              <p className="text-gray-600 font-body">
                30 jours pour changer d&apos;avis
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-luxury text-gray-900 mb-2">
                Qualité garantie
              </h3>
              <p className="text-gray-600 font-body">
                Produits sélectionnés avec soin
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter épurée */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-luxury-bold text-white mb-4">
            Restez informé(e)
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto font-body">
            Recevez nos dernières nouveautés et offres exclusives directement dans votre boîte mail
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input 
              type="email" 
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900"
            />
            <Button className="px-6 py-3">
              S&apos;abonner
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}