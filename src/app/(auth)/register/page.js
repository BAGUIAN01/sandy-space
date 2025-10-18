import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import RegisterForm from '@/components/auth/register-form'

export const metadata = {
  title: 'Inscription - Sandy Space',
  description: 'Créez votre compte Sandy Space'
}

export default async function RegisterPage() {
  const session = await getServerSession()
  
  if (session) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header avec logo et titre */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-orange-600 to-amber-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Rejoignez-nous
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Créez votre compte Sandy Space
          </p>
        </div>

        {/* Formulaire */}
        <Suspense fallback={
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <div className="animate-pulse space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        }>
          <RegisterForm />
        </Suspense>

        {/* Footer avec lien de connexion */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Déjà un compte ?{' '}
            <a
              href="/login"
              className="font-semibold text-orange-600 hover:text-orange-500 transition-colors duration-200"
            >
              Connectez-vous
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
