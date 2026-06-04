'use client'

import { useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Database } from '@/lib/supabase/types'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectCardProps {
  project: Project
}

const CATEGORY_LABELS: Record<string, string> = {
  residential: 'Residencial',
  commercial: 'Comercial',
  render: 'Render 3D',
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const resettingRef = useRef(false)

  // ─── Animação de entrada com GSAP ScrollTrigger ───────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ctx: { revert?: () => void } = {}

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.94, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }

    init()
    return () => ctx.revert?.()
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current
    if (!card || resettingRef.current) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    card.style.transition = 'none'
    card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    resettingRef.current = true
    card.style.transition = 'transform 500ms ease'
    card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)'
    const cleanup = () => {
      resettingRef.current = false
      card.removeEventListener('transitionend', cleanup)
    }
    card.addEventListener('transitionend', cleanup)
  }, [])

  return (
    // Link ocupa 100% da célula do grid
    <Link
      ref={cardRef}
      href={`/projetos/${project.slug}`}
      className="project-card-link block w-full h-full"
      style={{ willChange: 'transform' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={`Ver projeto: ${project.title}`}
    >
      {/* Container único — aspect-ratio menor no desktop para harmonizar grid 3 colunas */}
      <div
        ref={containerRef}
        className="group relative w-full overflow-hidden bg-black/[0.06] aspect-square"
      >
        {/* Imagem de capa */}
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={90}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)' }}
          />
        ) : (
          /* Placeholder quando não há imagem */
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              aria-hidden="true"
              className="font-display leading-none select-none"
              style={{
                fontSize: 'clamp(64px, 10vw, 120px)',
                color: 'rgba(0,0,0,0.06)',
              }}
            >
              {CATEGORY_LABELS[project.category]?.[0] ?? '?'}
            </span>
          </div>
        )}

        {/* Overlay — sempre visível com opacidade reduzida, plena no hover */}
        <div
          className="project-card-overlay absolute inset-x-0 bottom-0 p-4 flex flex-col gap-1"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
            opacity: 0.6,
            transition: 'opacity 350ms ease',
          }}
        >
          <span
            className="font-body uppercase tracking-widest mb-2"
            style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}
          >
            {CATEGORY_LABELS[project.category] ?? project.category}
            {project.year ? ` · ${project.year}` : ''}
          </span>
          <h3
            className="font-display text-white leading-tight"
            style={{ fontSize: 'clamp(16px, 2vw, 24px)' }}
          >
            {project.title}
          </h3>
        </div>
      </div>
    </Link>
  )
}
