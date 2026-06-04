'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import type { Database } from '@/lib/supabase/types'

type ProjectImage = Database['public']['Tables']['project_images']['Row']

interface ProjectGalleryProps {
  images: ProjectImage[]
  projectTitle: string
}

export default function ProjectGallery({ images, projectTitle }: ProjectGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const overlayRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)

  const [heroImg, ...restImgs] = images

  // ─── Abertura do lightbox ───────────────────────────────────────────
  const openGallery = useCallback(async (index: number) => {
    setActiveIndex(index)
    setIsOpen(true)
  }, [])

  // Anima a abertura após o overlay ser montado no DOM
  useEffect(() => {
    if (!isOpen || !overlayRef.current) return
    const el = overlayRef.current

    const run = async () => {
      const { animate } = await import('animejs')
      animate(el, {
        clipPath: ['inset(100% 0 0 0)', 'inset(0% 0 0 0)'],
        translateY: [40, 0],
        opacity: [0, 1],
        duration: 500,
        ease: 'outExpo',
      })
    }
    run()
  }, [isOpen])

  // ─── Fechamento ─────────────────────────────────────────────────────
  const closeGallery = useCallback(async () => {
    if (!overlayRef.current) {
      setIsOpen(false)
      return
    }
    const el = overlayRef.current
    const { animate } = await import('animejs')
    animate(el, {
      opacity: [1, 0],
      translateY: [0, 20],
      duration: 300,
      ease: 'inQuad',
      onComplete: () => setIsOpen(false),
    })
  }, [])

  // ─── Navegação ──────────────────────────────────────────────────────
  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + images.length) % images.length)
  }, [images.length])

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % images.length)
  }, [images.length])

  // Teclado
  useEffect(() => {
    if (!isOpen) return
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') closeGallery()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [isOpen, prev, next, closeGallery])

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Swipe mobile
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
  }

  // ─── Grid da galeria ────────────────────────────────────────────────
  return (
    <>
      <div>
        {/* Primeira imagem — largura total, 16:9 */}
        {heroImg && (
          <button
            className="relative w-full block overflow-hidden"
            style={{ aspectRatio: '16/9' }}
            onClick={() => openGallery(0)}
            aria-label={`Abrir imagem 1 — ${projectTitle}`}
            type="button"
          >
            {heroImg.url ? (
              <Image
                src={heroImg.url}
                alt={heroImg.alt_text ?? project_alt(projectTitle, 1)}
                fill
                priority
                quality={90}
                className="object-cover hover:scale-[1.02] transition-transform duration-700"
                sizes="100vw"
                style={{ transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)' }}
              />
            ) : (
              <Placeholder index={1} />
            )}
          </button>
        )}

        {/* Demais imagens — grid 2 colunas, 4:3 */}
        {restImgs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {restImgs.map((img, i) => (
              <button
                key={img.id}
                className="relative w-full block overflow-hidden"
                style={{ aspectRatio: '4/3' }}
                onClick={() => openGallery(i + 1)}
                aria-label={`Abrir imagem ${i + 2} — ${projectTitle}`}
                type="button"
              >
                {img.url ? (
                  <Image
                    src={img.url}
                    alt={img.alt_text ?? project_alt(projectTitle, i + 2)}
                    fill
                    quality={85}
                    className="object-cover hover:scale-[1.02] transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)' }}
                  />
                ) : (
                  <Placeholder index={i + 2} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── Lightbox ─────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          ref={overlayRef}
          className="gallery-overlay fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: 'rgba(0,0,0,0.95)',
            opacity: 0,
            willChange: 'transform, opacity, clip-path',
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label={`Galeria — ${projectTitle}`}
        >
          {/* Fechar */}
          <button
            onClick={closeGallery}
            className="absolute top-6 right-8 font-body text-xs tracking-widest uppercase transition-colors duration-200 z-10"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            aria-label="Fechar galeria (ESC)"
            type="button"
          >
            FECHAR ✕
          </button>

          {/* Contador */}
          <span
            className="absolute top-6 left-8 font-body text-xs tracking-widest"
            style={{ color: 'rgba(255,255,255,0.3)' }}
            aria-live="polite"
          >
            {activeIndex + 1} / {images.length}
          </span>

          {/* Imagem ativa */}
          <div className="relative w-full h-full flex items-center justify-center px-16 py-16">
            {images[activeIndex]?.url ? (
              <div className="relative w-full h-full" style={{ maxWidth: '1200px', maxHeight: '85vh' }}>
                <Image
                  src={images[activeIndex].url!}
                  alt={images[activeIndex].alt_text ?? project_alt(projectTitle, activeIndex + 1)}
                  fill
                  quality={95}
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            ) : (
              <Placeholder index={activeIndex + 1} large />
            )}
          </div>

          {/* Setas (apenas quando há mais de 1 imagem) */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-2xl px-3 py-5 transition-colors duration-200"
                style={{ color: 'rgba(255,255,255,0.35)' }}
                aria-label="Imagem anterior"
                type="button"
              >
                ←
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 font-body text-2xl px-3 py-5 transition-colors duration-200"
                style={{ color: 'rgba(255,255,255,0.35)' }}
                aria-label="Próxima imagem"
                type="button"
              >
                →
              </button>
            </>
          )}

          {/* Clique fora fecha */}
          <div
            className="absolute inset-0 -z-10"
            onClick={closeGallery}
            aria-hidden="true"
          />
        </div>
      )}
    </>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────
function project_alt(title: string, index: number) {
  return `${title} — imagem ${index}`
}

function Placeholder({ index, large = false }: { index: number; large?: boolean }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      <span
        className="font-display leading-none select-none"
        style={{
          fontSize: large ? '64px' : 'clamp(32px, 5vw, 56px)',
          color: 'rgba(255,255,255,0.06)',
        }}
      >
        {String(index).padStart(2, '0')}
      </span>
    </div>
  )
}
