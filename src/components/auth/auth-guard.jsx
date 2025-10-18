'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthGuard({ children, requireAuth = true, requireRole = null }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (requireAuth && !session) {
      router.push('/auth/login')
      return
    }

    if (requireRole && session?.user?.role !== requireRole) {
      router.push('/')
      return
    }

    if (!requireAuth && session) {
      router.push('/')
      return
    }
  }, [session, status, router, requireAuth, requireRole])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (requireAuth && !session) {
    return null
  }

  if (requireRole && session?.user?.role !== requireRole) {
    return null
  }

  if (!requireAuth && session) {
    return null
  }

  return children
}
