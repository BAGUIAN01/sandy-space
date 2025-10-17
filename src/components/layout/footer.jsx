import Link from 'next/link'
import Image from 'next/image'
import { FASHION_CATEGORIES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Truck,
  Shield,
  RotateCcw,
  CreditCard,
  Heart,
  Star,
  Shirt,
  Square,
  Pill,
  Footprints,
  Gem,
  ShoppingBag
} from 'lucide-react'

// Mapping des icônes (même que dans le header)
const iconMap = {
  Shirt: Shirt,
  Square: Square,
  Pill: Pill,
  Footprints: Footprints,
  Gem: Gem,
  ShoppingBag: ShoppingBag
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Section principale */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informations entreprise */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center group">
              <div className="w-10 h-10 rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Sandy Space Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="ml-3 text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Sandy Space</span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Votre destination mode, beauté et bien-être.
            </p>
            
            {/* Réseaux sociaux */}
            <div className="flex gap-2">
              <Link 
                href="https://instagram.com/sandyspace" 
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-pink-600 hover:scale-110 transition-all duration-300 ease-out"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-4 w-4 text-gray-600 hover:text-white transition-colors duration-300" />
              </Link>
              <Link 
                href="https://facebook.com/sandyspace" 
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300 ease-out"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-4 w-4 text-gray-600 hover:text-white transition-colors duration-300" />
              </Link>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-gray-900">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200">
                  Livraison
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200">
                  Retours
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-gray-900">Newsletter</h3>
            <p className="text-gray-600 text-sm mb-3">
              Recevez nos offres exclusives
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 ease-out">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Section avantages simplifiée */}
      <div className="bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-center">
              <Truck className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-600">Livraison gratuite</span>
            </div>
            <div className="flex items-center gap-2 text-center">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-2 text-center">
              <RotateCcw className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-gray-600">Retour gratuit</span>
            </div>
            <div className="flex items-center gap-2 text-center">
              <Heart className="h-5 w-5 text-red-600" />
              <span className="text-sm text-gray-600">Service client</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright simplifié */}
      <div className="bg-gray-100 border-t border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-gray-600 text-sm">
              © {currentYear} Sandy Space. Tous droits réservés.
            </p>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200">
                Confidentialité
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200">
                CGV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
