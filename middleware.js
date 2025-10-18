import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth/')
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin')
    const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard')

    // Rediriger les utilisateurs connectés depuis les pages d'auth
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Protéger les routes admin
    if (isAdminPage && (!isAuth || token.role !== 'ADMIN')) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    // Protéger les routes dashboard
    if (isDashboardPage && !isAuth) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthPage = req.nextUrl.pathname.startsWith('/auth/')
        const isAdminPage = req.nextUrl.pathname.startsWith('/admin')
        const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard')

        // Autoriser l'accès aux pages d'auth
        if (isAuthPage) {
          return true
        }

        // Vérifier l'authentification pour les pages protégées
        if (isAdminPage || isDashboardPage) {
          return !!token
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/auth/:path*'
  ]
}
