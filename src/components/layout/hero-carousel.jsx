"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  Crown,
  Sparkles,
  Star,
  Heart,
  ShoppingBag
} from 'lucide-react'

const heroSlides = [
  {
    id: 1,
    title: "Nouvelle Collection",
    subtitle: "Mode & Style",
    description: "Découvrez notre nouvelle collection automne-hiver avec des pièces uniques qui sublimeront votre garde-robe.",
    image: "/images/slider1.png",
    cta: "Découvrir la collection",
    ctaLink: "/products",
    badge: "Nouveau",
    badgeColor: "bg-blue-500",
    overlay: "from-blue-900/20 to-purple-900/20"
  },
  {
    id: 2,
    title: "Robes Élégantes",
    subtitle: "Féminité & Style",
    description: "Explorez notre sélection de robes élégantes pour toutes les occasions, du quotidien aux événements spéciaux.",
    image: "/images/robes/image142-1_1-png202504140235061.png",
    cta: "Voir les robes",
    ctaLink: "/products/category/robes",
    badge: "Populaire",
    badgeColor: "bg-pink-500",
    overlay: "from-pink-900/20 to-rose-900/20"
  },
  {
    id: 3,
    title: "Sacs à Main",
    subtitle: "Accessoires Tendances",
    description: "Découvrez notre collection de sacs à main tendance pour compléter parfaitement votre look.",
    image: "/images/sac-a-main/image1-1_2-png202504140247341.png",
    cta: "Voir les sacs",
    ctaLink: "/products/category/sac-a-main",
    badge: "Tendance",
    badgeColor: "bg-purple-500",
    overlay: "from-purple-900/20 to-indigo-900/20"
  },
  {
    id: 4,
    title: "Offres Spéciales",
    subtitle: "Jusqu'à -50%",
    description: "Profitez de nos offres exceptionnelles sur une sélection de produits soigneusement choisis.",
    image: "/images/slider2.png",
    cta: "Voir les offres",
    ctaLink: "/products?sale=true",
    badge: "Promo",
    badgeColor: "bg-red-500",
    overlay: "from-red-900/20 to-orange-900/20"
  }
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isPlaying])

  const goToSlide = (index) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide(index)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? 'opacity-100 scale-100'
                : index === (currentSlide - 1 + heroSlides.length) % heroSlides.length
                ? 'opacity-0 scale-105 -translate-x-full'
                : index === (currentSlide + 1) % heroSlides.length
                ? 'opacity-0 scale-105 translate-x-full'
                : 'opacity-0 scale-105'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />
            </div>

            {/* Content - Only show for non-slider images */}
            {!slide.image.includes('slider') && (
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl">
                    {/* Badge */}
                    <Badge className={`${slide.badgeColor} text-white mb-4 px-3 py-1 text-sm font-medium`}>
                      {slide.badge}
                    </Badge>

                    {/* Subtitle */}
                    <p className="text-lg text-white/90 mb-2 font-body-medium tracking-wide">
                      {slide.subtitle}
                    </p>

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-luxury-display text-white mb-6 leading-tight">
                      {slide.title}
                    </h1>

                    {/* Description */}
                    <p className="text-xl text-white/80 mb-8 leading-relaxed max-w-lg">
                      {slide.description}
                    </p>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        size="lg" 
                        className="px-8 py-4 bg-white text-gray-900 hover:bg-white/90 transition-all duration-300 group"
                        asChild
                      >
                        <Link href={slide.ctaLink}>
                          {slide.cta}
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="px-8 py-4 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                      >
                        En savoir plus
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center gap-4 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
          {/* Play/Pause */}
          <button
            onClick={togglePlayPause}
            className="p-2 text-white hover:text-white/80 transition-colors duration-200"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Arrow Controls */}
          <button
            onClick={prevSlide}
            className="p-2 text-white hover:text-white/80 transition-colors duration-200"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 text-white hover:text-white/80 transition-colors duration-200"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20 z-20">
        <div 
          className={`h-full bg-white transition-all duration-100 ease-linear ${
            isPlaying ? 'animate-progress' : ''
          }`}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 z-10 hidden lg:block">
        <div className="animate-float">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Crown className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      <div className="absolute top-40 left-20 z-10 hidden lg:block">
        <div className="animate-float-delayed">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-40 right-32 z-10 hidden lg:block">
        <div className="animate-float-slow">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Star className="h-7 w-7 text-white" />
          </div>
        </div>
      </div>
    </section>
  )
}
