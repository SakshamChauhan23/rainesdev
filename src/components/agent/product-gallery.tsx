'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  thumbnailUrl: string | null
  demoVideoUrl: string | null
  title: string
}

export function ProductGallery({ thumbnailUrl, demoVideoUrl, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(false)

  // Create gallery items - thumbnail + video preview
  const galleryItems = [
    { type: 'image' as const, url: thumbnailUrl },
    ...(demoVideoUrl ? [{ type: 'video' as const, url: demoVideoUrl }] : []),
  ]

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.includes('v=') ? url.split('v=')[1]?.split('&')[0] : url.split('/').pop()
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('v=') ? url.split('v=')[1]?.split('&')[0] : url.split('/').pop()
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`
    }
    return url
  }

  const currentItem = galleryItems[selectedIndex]

  return (
    <div className="flex flex-col gap-4">
      {/* Main Display */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
        {showVideo && currentItem?.type === 'video' && currentItem.url ? (
          <iframe
            src={getEmbedUrl(currentItem.url)}
            title="Agent Demo Video"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            {currentItem?.type === 'video' && currentItem.url ? (
              <div className="relative h-full w-full">
                <Image
                  src={getYouTubeThumbnail(currentItem.url)}
                  alt={`${title} video preview`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <button
                  onClick={() => setShowVideo(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-110">
                    <Play className="h-10 w-10 fill-gray-900 text-gray-900" />
                  </div>
                </button>
              </div>
            ) : thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="mx-auto mb-2 h-16 w-16 rounded-full bg-gray-200" />
                  <p>No preview available</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Navigation Arrows */}
        {galleryItems.length > 1 && (
          <>
            <button
              onClick={() => {
                setShowVideo(false)
                setSelectedIndex(prev => (prev === 0 ? galleryItems.length - 1 : prev - 1))
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition-all hover:bg-white hover:shadow-lg"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={() => {
                setShowVideo(false)
                setSelectedIndex(prev => (prev === galleryItems.length - 1 ? 0 : prev + 1))
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition-all hover:bg-white hover:shadow-lg"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {galleryItems.length > 1 && (
        <div className="flex justify-center gap-3">
          {galleryItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setShowVideo(false)
                setSelectedIndex(index)
              }}
              className={cn(
                'relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-all',
                selectedIndex === index
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              {item.type === 'video' && item.url ? (
                <div className="relative h-full w-full">
                  <Image
                    src={getYouTubeThumbnail(item.url)}
                    alt="Video thumbnail"
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="h-4 w-4 fill-white text-white" />
                  </div>
                </div>
              ) : item.url ? (
                <Image
                  src={item.url}
                  alt={`${title} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="h-full w-full bg-gray-100" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
