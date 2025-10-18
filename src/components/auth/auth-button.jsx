'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'

export default function AuthButton() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="animate-pulse">
        <div className="h-10 w-20 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-700">
          Bonjour, {session.user.name || session.user.username}
        </span>
        <Button
          onClick={handleSignOut}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          {isLoading ? 'Déconnexion...' : 'Déconnexion'}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Link href="/login">
        <Button variant="outline" size="sm">
          Connexion
        </Button>
      </Link>
      <Link href="/register">
        <Button size="sm">
          Inscription
        </Button>
      </Link>
    </div>
  )
}
