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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion à votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <a
              href="/auth/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              créez un nouveau compte
            </a>
          </p>
        </div>
        <Suspense fallback={<div>Chargement...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
