"use client"

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  Maximize2, 
  X, 
  Share2,
  Heart,
  Download
} from 'lucide-react'

export function ProductGallery({ 
  images = [], 
  showThumbnails = true, 
  showZoom = true, 
  showFullscreen = true,
  onImageChange = () => {},
  className = ""
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [imageErrors, setImageErrors] = useState({})
  
  const containerRef = useRef(null)
  const imageRef = useRef(null)

  // Gérer les erreurs d'image
  const handleImageError = (imageIndex) => {
    setImageErrors(prev => ({
      ...prev,
      [imageIndex]: true
    }))
  }

  // Obtenir l'URL de l'image avec fallback
  const getImageUrl = (image, index) => {
    if (!image) return ''
    if (imageErrors[index] && image.fallbackUrl) {
      return image.fallbackUrl
    }
    return image.url
  }

  // Gérer le changement d'image
  const goToSlide = (index) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index)
      setZoomLevel(1)
      setOffset({ x: 0, y: 0 })
      onImageChange(index)
    }
  }

  // Navigation avec les flèches
  const goToPrevious = () => {
    goToSlide(currentIndex - 1)
  }

  const goToNext = () => {
    goToSlide(currentIndex + 1)
  }

  // Gestion du zoom
  const handleZoom = (direction) => {
    const newZoom = direction === 'in' 
      ? Math.min(zoomLevel * 1.5, 3)
      : Math.max(zoomLevel / 1.5, 1)
    
    setZoomLevel(newZoom)
    
    // Recentrer si on dézoom
    if (newZoom === 1) {
      setOffset({ x: 0, y: 0 })
    }
  }

  // Gestion du drag
  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      const newOffset = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }
      setOffset(newOffset)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Gestion de la molette pour le zoom
  const handleWheel = (e) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      handleZoom('in')
    } else {
      handleZoom('out')
    }
  }

  // Gestion du plein écran
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    if (!isFullscreen) {
      setZoomLevel(1)
      setOffset({ x: 0, y: 0 })
    }
  }

  // Gestion du partage
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Découvrez ce produit',
          text: 'Regardez cette image magnifique',
          url: window.location.href
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        // TODO: Afficher une notification
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error)
    }
  }

  // Navigation au clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFullscreen) {
        switch (e.key) {
          case 'ArrowLeft':
            goToPrevious()
            break
          case 'ArrowRight':
            goToNext()
            break
          case 'Escape':
            setIsFullscreen(false)
            break
          case '+':
          case '=':
            handleZoom('in')
            break
          case '-':
            handleZoom('out')
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, currentIndex])

  // Prévenir le scroll sur le body quand en plein écran
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isFullscreen])

  if (!images || images.length === 0) {
    return (
      <div className={`w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-gray-500">Aucune image disponible</p>
      </div>
    )
  }

  const currentImage = images[currentIndex]
  const image_url = getImageUrl(currentImage, currentIndex)

  // Ajout de l'état pour l'affichage de l'image en full screen/zoom
  const shouldShowImageFull = isFullscreen || zoomLevel > 1

  return (
    <>
      {/* Galerie principale */}
      <div className={`space-y-4 ${className}`}>
        {/* Image principale */}
        <div 
          ref={containerRef}
          className="relative w-full h-96 md:h-[500px] lg:h-[600px] bg-white rounded-lg overflow-hidden group cursor-zoom-in"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {image_url ? (
            <Image
              ref={imageRef}
              src={image_url}
              alt={currentImage?.alt || `Image ${currentIndex + 1}`}
              fill
              className="object-cover transition-transform duration-300 bg-white"
              style={{
                transform: `scale(${zoomLevel}) translate(${offset.x / zoomLevel}px, ${offset.y / zoomLevel}px)`,
                cursor: zoomLevel > 1 ? 'grabbing' : 'grab',
                backgroundColor: 'white',
                zIndex: 1
              }}
              onError={() => handleImageError(currentIndex)}
              priority
              sizes="(max-width: 1024px) 100vw, 800px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400">Image indisponible</span>
            </div>
          )}

          {/* Overlay avec contrôles */}
          <div className="absolute inset-0 bg-transparent group-hover:bg-black/5 transition-all duration-300 pointer-events-none">
            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  disabled={currentIndex === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto z-10"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  onClick={goToNext}
                  disabled={currentIndex === images.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto z-10"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Contrôles en haut à droite */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-auto z-10">
              {showZoom && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleZoom('in')}
                  className="bg-white/90 hover:bg-white border-gray-300"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              )}

              {showFullscreen && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="bg-white/90 hover:bg-white border-gray-300"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="bg-white/90 hover:bg-white border-gray-300"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Indicateur de zoom */}
            {zoomLevel > 1 && (
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {Math.round(zoomLevel * 100)}%
              </div>
            )}
          </div>

          {/* Compteur d'images */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Miniatures */}
        {showThumbnails && images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => {
              const thumbUrl = getImageUrl(image, index)
              return (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex 
                      ? 'border-gray-900 ring-2 ring-gray-300' 
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {thumbUrl ? (
                    <Image
                      src={thumbUrl}
                      alt={image.alt || `Miniature ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(index)}
                      sizes="80px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-400">-</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Mode plein écran ET aussi si zoom > 1 */}
      {shouldShowImageFull && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Bouton de fermeture */}
          <button
            onClick={() => setIsFullscreen(false) || setZoomLevel(1)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200 z-10"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Image en plein écran */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            style={{ cursor: zoomLevel > 1 ? 'grabbing' : 'grab' }}
          >
            {image_url ? (
              <Image
                src={image_url}
                alt={currentImage.alt || `Image ${currentIndex + 1}`}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
                onError={() => handleImageError(currentIndex)}
                style={{
                  transform: `scale(${zoomLevel}) translate(${offset.x / zoomLevel}px, ${offset.y / zoomLevel}px)`,
                  transition: "transform 0.3s"
                }}
                sizes="(max-width: 1024px) 100vw, 1200px"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <span className="text-gray-400 text-lg">Image indisponible</span>
              </div>
            )}
          </div>
          
          {/* Navigation en plein écran */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={goToNext}
                disabled={currentIndex === images.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Contrôles en bas */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleZoom('out')}
              className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
              disabled={zoomLevel <= 1}
            >
              <ZoomIn className="h-4 w-4 rotate-180" />
            </Button>

            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleZoom('in')}
              className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
              disabled={zoomLevel >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}