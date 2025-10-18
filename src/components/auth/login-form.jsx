'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'

const loginSchema = z.object({
  username: z.string().min(1, 'Le nom d\'utilisateur est requis'),
  password: z.string().min(1, 'Le mot de passe est requis')
})

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false
      })

      if (result?.error) {
        setError('Nom d\'utilisateur ou mot de passe incorrect')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
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

        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Nom d'utilisateur ou Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="username"
              type="text"
              {...register('username')}
              className="pl-10 h-12 border-gray-200 focus:border-amber-500 focus:ring-amber-500 rounded-xl text-gray-900 placeholder:text-gray-500"
              placeholder="Entrez votre nom d'utilisateur ou email"
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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className="pl-10 pr-10 h-12 border-gray-200 focus:border-amber-500 focus:ring-amber-500 rounded-xl text-gray-900 placeholder:text-gray-500"
              placeholder="Entrez votre mot de passe"
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

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <a href="/auth/forgot-password" className="font-medium text-amber-600 hover:text-amber-500 transition-colors">
              Mot de passe oublié ?
            </a>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Connexion...</span>
            </div>
          ) : (
            'Se connecter'
          )}
        </Button>
      </form>
    </Card>
  )
}
