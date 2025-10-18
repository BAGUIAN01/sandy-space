import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import LoginForm from '@/components/auth/login-form'

export const metadata = {
  title: 'Connexion - Sandy Space',
  description: 'Connectez-vous à votre compte Sandy Space'
}

export default async function LoginPage() {
  const session = await getServerSession()
  
  if (session) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header avec logo et titre */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Bienvenue
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Connectez-vous à votre compte Sandy Space
          </p>
        </div>

        {/* Formulaire */}
        <Suspense fallback={
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        }>
          <LoginForm />
        </Suspense>

        {/* Footer avec lien d'inscription */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <a
              href="/auth/register"
              className="font-semibold text-amber-600 hover:text-amber-500 transition-colors duration-200"
            >
              Créez votre compte
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
