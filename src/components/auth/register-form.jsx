'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'

const registerSchema = z.object({
  username: z.string()
    .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .max(20, 'Le nom d\'utilisateur ne peut pas dépasser 20 caractères')
    .regex(/^[a-zA-Z0-9_]+$/, 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'),
  email: z.string()
    .email('Adresse email invalide'),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l\'inscription')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)

    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Compte créé avec succès !
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Vous allez être redirigé vers la page de connexion...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="firstName"
                type="text"
                {...register('firstName')}
                className="pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl text-gray-900 placeholder:text-gray-500"
                placeholder="Votre prénom"
              />
            </div>
            {errors.firstName && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.firstName.message}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="lastName"
                type="text"
                {...register('lastName')}
                className="pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl text-gray-900 placeholder:text-gray-500"
                placeholder="Votre nom"
              />
            </div>
            {errors.lastName && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.lastName.message}</span>
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Nom d'utilisateur
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="username"
              type="text"
              {...register('username')}
              className="pl-10 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
              placeholder="Choisissez un nom d'utilisateur"
            />
          </div>
          {errors.username && (
            <p className="text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.username.message}</span>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Adresse email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="pl-10 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
              placeholder="votre@email.com"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className="pl-10 pr-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl text-gray-900 placeholder:text-gray-500"
              placeholder="Choisissez un mot de passe sécurisé"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.password.message}</span>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              className="pl-10 pr-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl text-gray-900 placeholder:text-gray-500"
              placeholder="Confirmez votre mot de passe"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.confirmPassword.message}</span>
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Création du compte...</span>
            </div>
          ) : (
            'Créer mon compte'
          )}
        </Button>
      </form>
    </Card>
  )
}
