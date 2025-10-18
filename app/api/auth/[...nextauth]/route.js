import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Nom d'utilisateur", type: "text" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          // Rechercher l'utilisateur par username ou email
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { username: credentials.username },
                { email: credentials.username }
              ],
              isActive: true
            }
          })

          if (!user || !user.password) {
            return null
          }

          // Vérifier le mot de passe
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          // Mettre à jour la dernière connexion
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
          })

          return {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            image: user.image,
            role: user.role
          }
        } catch (error) {
          console.error("Erreur d'authentification:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
        session.user.username = token.username
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/register",
    error: "/auth/error"
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
