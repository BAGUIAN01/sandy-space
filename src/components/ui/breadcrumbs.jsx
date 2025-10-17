import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <nav className="flex items-center space-x-1 text-sm" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const Icon = item.icon

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
              )}
              
              {isLast ? (
                <span className="flex items-center text-gray-900 font-medium">
                  {Icon && <Icon className="h-4 w-4 mr-1" />}
                  {item.label}
                </span>
              ) : (
                <Link 
                  href={item.href} 
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  {Icon && <Icon className="h-4 w-4 mr-1" />}
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
