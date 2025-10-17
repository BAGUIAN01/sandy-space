"use client"

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { SIZE_GUIDES } from '@/lib/constants'

export function SizeGuide({ category, className }) {
  const [isOpen, setIsOpen] = useState(false)
  
  const sizeGuide = SIZE_GUIDES[category]
  
  if (!sizeGuide) {
    return null
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`text-xs text-blue-600 hover:underline ${className}`}
      >
        Guide des tailles
      </button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Guide des tailles - ${category.charAt(0).toUpperCase() + category.slice(1)}`}
        size="lg"
      >
        <div className="space-y-6">
          {/* Tailles disponibles */}
          <div>
            <h3 className="font-semibold mb-3">Tailles disponibles</h3>
            <div className="flex flex-wrap gap-2">
              {sizeGuide.sizes.map((size) => (
                <span
                  key={size}
                  className="px-3 py-1 bg-gray-100 rounded-md text-sm font-medium"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          {/* Mesures */}
          <div>
            <h3 className="font-semibold mb-3">Mesures</h3>
            <div className="space-y-2">
              {sizeGuide.measurements.map((measurement) => (
                <div key={measurement} className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-sm text-gray-600">{measurement}</span>
                  <span className="text-sm font-medium">cm</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Comment mesurer</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Utilisez un mètre ruban souple</li>
              <li>• Mesurez sur sous-vêtements</li>
              <li>• Gardez le mètre bien droit</li>
              <li>• Ne serrez pas trop</li>
            </ul>
          </div>

          {/* Tableau de correspondance pour les chaussures */}
          {category === 'chaussures' && (
            <div>
              <h3 className="font-semibold mb-3">Correspondance des pointures</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">FR</th>
                      <th className="text-left py-2">EU</th>
                      <th className="text-left py-2">US</th>
                      <th className="text-left py-2">UK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { fr: '35', eu: '35', us: '5', uk: '3' },
                      { fr: '36', eu: '36', us: '6', uk: '4' },
                      { fr: '37', eu: '37', us: '7', uk: '5' },
                      { fr: '38', eu: '38', us: '8', uk: '6' },
                      { fr: '39', eu: '39', us: '9', uk: '7' },
                      { fr: '40', eu: '40', us: '10', uk: '8' },
                      { fr: '41', eu: '41', us: '11', uk: '9' },
                      { fr: '42', eu: '42', us: '12', uk: '10' },
                    ].map((row) => (
                      <tr key={row.fr} className="border-b">
                        <td className="py-2">{row.fr}</td>
                        <td className="py-2">{row.eu}</td>
                        <td className="py-2">{row.us}</td>
                        <td className="py-2">{row.uk}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Informations spéciales pour les compléments alimentaires */}
          {category === 'complements-alimentaires' && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Informations importantes</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Respectez la posologie indiquée</li>
                <li>• Consultez votre médecin si nécessaire</li>
                <li>• Conservez dans un endroit frais et sec</li>
                <li>• Tenir hors de portée des enfants</li>
              </ul>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}

// Composant pour afficher les informations spécifiques par catégorie
export function CategoryInfo({ category, className }) {
  const categoryInfo = {
    robes: {
      title: "Robes",
      description: "Découvrez notre collection de robes élégantes pour toutes les occasions",
      features: ["Tissus de qualité", "Coupes modernes", "Entretien facile"]
    },
    pantalons: {
      title: "Pantalons",
      description: "Pantalons confortables et stylés pour votre garde-robe",
      features: ["Confort optimal", "Styles variés", "Tissus durables"]
    },
    chaussures: {
      title: "Chaussures",
      description: "Chaussures tendance et confortables pour tous vos déplacements",
      features: ["Confort toute la journée", "Matériaux de qualité", "Styles tendance"]
    },
    hauts: {
      title: "Les hauts",
      description: "Tops, t-shirts et chemises pour compléter votre look",
      features: ["Matériaux doux", "Coupes flatteuses", "Faciles à assortir"]
    },
    perles: {
      title: "Perles",
      description: "Bijoux en perles artisanaux pour sublimer votre style",
      features: ["Perles naturelles", "Artisanat local", "Designs uniques"]
    },
    'sacs-a-main': {
      title: "Sacs à main",
      description: "Sacs à main élégants et pratiques pour accompagner votre quotidien",
      features: ["Compartiments pratiques", "Matériaux nobles", "Designs intemporels"]
    },
    'complements-alimentaires': {
      title: "Compléments alimentaires",
      description: "Compléments alimentaires naturels pour votre bien-être",
      features: ["Ingrédients naturels", "Fabriqués en France", "Certifications qualité"]
    }
  }

  const info = categoryInfo[category]
  
  if (!info) return null

  return (
    <div className={`category-info ${className}`}>
      <h2 className="text-2xl font-bold mb-2">{info.title}</h2>
      <p className="text-gray-600 mb-4">{info.description}</p>
      
      <div className="flex flex-wrap gap-2">
        {info.features.map((feature, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
          >
            {feature}
          </span>
        ))}
      </div>
    </div>
  )
}
