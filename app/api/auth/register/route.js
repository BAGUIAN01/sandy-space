import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const registerSchema = z.object({
  username: z.string()
    .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .max(20, 'Le nom d\'utilisateur ne peut pas dépasser 20 caractères')
    .regex(/^[a-zA-Z0-9_]+$/, 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'),
  email: z.string().email('Adresse email invalide'),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis')
})

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validation des données
    const validatedData = registerSchema.parse(body)
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: validatedData.username },
          { email: validatedData.email }
        ]
      }
    })

    if (existingUser) {
      if (existingUser.username === validatedData.username) {
        return NextResponse.json(
          { error: 'Ce nom d\'utilisateur est déjà utilisé' },
          { status: 400 }
        )
      }
      if (existingUser.email === validatedData.email) {
        return NextResponse.json(
          { error: 'Cette adresse email est déjà utilisée' },
          { status: 400 }
        )
      }
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        password: hashedPassword,
        name: `${validatedData.firstName} ${validatedData.lastName}`,
        role: 'CUSTOMER',
        isActive: true
      }
    })

    // Créer un panier pour l'utilisateur
    await prisma.cart.create({
      data: {
        userId: user.id
      }
    })

    return NextResponse.json(
      { 
        message: 'Compte créé avec succès',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
