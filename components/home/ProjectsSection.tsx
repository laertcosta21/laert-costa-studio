'use client'

import { useState, useEffect, useRef } from 'react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { Container } from '@/components/ui/Container'
import ProjectCard from '@/components/projects/ProjectCard'
import ProjectFilters from '@/components/projects/ProjectFilters'
import type { Database, ProjectCategory } from '@/lib/supabase/types'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectsSectionProps {
  projects: Project[]
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | ProjectCategory>('all')
  const [animating, setAnimating] = useState(false)
  const cardsRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const titlesRef = useRef<(HTMLDivElement | null)[]>([])

  const filtered =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.category === activeFilter)

  const handleFilterChange = async (newFilter: 'all' | ProjectCategory) => {
    if (newFilter === activeFilter || animating) return
    const cards = cardsRef.current
    if (!cards) { setActiveFilter(newFilter); return }

    setAnimating(true)

    const exitTargets = cards.querySelectorAll<HTMLElement>('.project-card-wrapper')
    if (exitTargets.length > 0) {
      const { animate } = await import('animejs')
      // Spec: saída com opacity + scale (não translateY)
      await animate(exitTargets, {
        opacity: [1, 0],
        scale: [1, 0.95],
        duration: 250,
        ease: 'inQuad',
      })
    }

    setActiveFilter(newFilter)
    setAnimating(false)
  }

  useEffect(() => {
    const cards = cardsRef.current
    if (!cards || animating) return
    const elements = cards.querySelectorAll<HTMLElement>('.project-card-wrapper')
    if (elements.length === 0) return

    const run = async () => {
      const { animate, stagger } = await import('animejs')
      // Spec: entrada com opacity + scale (não translateY)
      animate(elements, {
        opacity: [0, 1],
        scale: [0.95, 1],
        duration: 400,
        delay: stagger(40),
        ease: 'outExpo',
      })
    }
    run()
  }, [activeFilter, animating])

  // ─── Scroll horizontal pinado (desktop) + texto "surgindo" ─────
  useEffect(() => {
    const wrapper = wrapperRef.current
    const track = trackRef.current
    if (!wrapper || !track) return
    if (animating) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(min-width: 768px)').matches) return

    let ctx: { revert?: () => void } = {}

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        wrapper.style.overflow = 'hidden'

        const getDistance = () => Math.max(track.scrollWidth - wrapper.offsetWidth, 0)

        const titles = titlesRef.current.filter((t): t is HTMLDivElement => t !== null)
        gsap.set(titles, { opacity: 0, y: 24 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            scrub: true,
            pin: true,
            invalidateOnRefresh: true,
          },
        })

        tl.to(track, { x: () => -getDistance(), ease: 'none' }, 0)

        titles.forEach((title, i) => {
          const at = Math.min(i * (0.85 / Math.max(titles.length, 1)), 0.88)
          tl.to(title, { opacity: 1, y: 0, ease: 'none', duration: 0.12 }, at)
        })
      })

      ScrollTrigger.refresh()
    }

    init()
    return () => {
      wrapper.style.overflow = ''
      ctx.revert?.()
    }
  }, [filtered, animating])

  return (
    <section
      id="projetos"
      className="bg-white border-t border-black/10 py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)]"
    >
      <Container>

        {/* Numeração editorial */}
        <AnimatedSection>
          <div className="flex items-center justify-between mb-6">
            <span className="editorial-label text-black/40">/ 04 — PROJETOS</span>
            <span className="editorial-label text-black/40">P. 004 / 06</span>
          </div>
        </AnimatedSection>

        {/* Cabeçalho bipartido */}
        <AnimatedSection>
          <div className="mb-10 md:mb-14">
            <span
              className="block font-body uppercase mb-6"
              style={{ fontSize: '12px', letterSpacing: '0.18em', color: 'rgba(0,0,0,0.55)' }}
            >
              — CASOS
            </span>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-12">
              <h2
                className="font-display text-black leading-none tracking-[-0.01em] flex-shrink-0 text-[56px] md:text-[108px]"
              >
                Projetos.
              </h2>
              <p
                className="font-body text-black/40 max-w-xs md:max-w-sm pb-2"
                style={{ fontSize: 'clamp(13px, 1.2vw, 15px)', lineHeight: '1.7' }}
              >
                Residências, espaços comerciais e visualizações 3D desenvolvidos com rigor técnico e atenção à identidade de cada cliente.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Filtros */}
        <AnimatedSection delay={100}>
          <div className="mb-10 md:mb-14 border-t border-black/10 pt-8 overflow-x-auto pb-2 md:pb-0 md:overflow-visible">
            <div className="flex-nowrap md:flex-wrap min-w-max md:min-w-0">
              <ProjectFilters active={activeFilter} onChange={handleFilterChange} />
            </div>
          </div>
        </AnimatedSection>
      </Container>

      {/* ─── Track horizontal — pinado no desktop, swipe no mobile ── */}
      <div ref={wrapperRef} className="relative w-full projects-horizontal-wrapper">
        <div
          ref={(el) => { cardsRef.current = el; trackRef.current = el }}
          className="projects-horizontal-track flex gap-6 md:gap-10 px-5 md:px-9"
        >
          {filtered.length > 0 ? (
            filtered.map((project, index) => (
              <div
                key={project.id}
                className="project-card-wrapper projects-horizontal-card"
              >
                <ProjectCard project={project} />
                <div
                  ref={(el) => { titlesRef.current[index] = el }}
                  className="projects-horizontal-title mt-4"
                >
                  <span className="editorial-label text-black/40 block mb-1">
                    {String(index + 1).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-black leading-none text-2xl md:text-4xl tracking-[-0.01em]">
                    {project.title}
                  </h3>
                </div>
              </div>
            ))
          ) : (
            <p className="font-body text-black/20 text-center py-24 tracking-widest uppercase text-xs w-full">
              Projetos em breve.
            </p>
          )}
        </div>
      </div>

    </section>
  )
}
