import Link from 'next/link'
import { Suspense } from 'react'

export const metadata = {
  title: 'Erreur d\'authentification - Sandy Space',
  description: 'Une erreur est survenue lors de l\'authentification'
}

export default function AuthErrorPage({ searchParams }) {
  const error = searchParams?.error

  const getErrorMessage = (error) => {
    switch (error) {
      case 'CredentialsSignin':
        return 'Nom d\'utilisateur ou mot de passe incorrect'
      case 'Configuration':
        return 'Erreur de configuration du serveur'
      case 'AccessDenied':
        return 'Accès refusé'
      case 'Verification':
        return 'Le lien de vérification a expiré ou a déjà été utilisé'
      default:
        return 'Une erreur inattendue s\'est produite'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Erreur d'authentification
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {error ? getErrorMessage(error) : 'Une erreur inattendue s\'est produite'}
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <Link
            href="/auth/login"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Réessayer la connexion
          </Link>
          
          <Link
            href="/"
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
