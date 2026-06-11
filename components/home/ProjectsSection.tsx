'use client'

import { useState, useEffect, useRef } from 'react'
import AnimatedSection from '@/components/ui/AnimatedSection'
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

  return (
    <section
      id="projetos"
      className="bg-white border-t border-black/10 py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)]"
    >
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-10 lg:px-12 2xl:px-24">

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
                className="font-display text-black leading-none flex-shrink-0"
                style={{ fontSize: 'clamp(64px, 10vw, 140px)' }}
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

        {/* Filtros — cores para fundo branco */}
        <AnimatedSection delay={100}>
          <div className="mb-10 md:mb-14 border-t border-black/10 pt-8 overflow-x-auto pb-2 md:pb-0 md:overflow-visible">
            <div className="flex-nowrap md:flex-wrap min-w-max md:min-w-0">
              <ProjectFilters active={activeFilter} onChange={handleFilterChange} />
            </div>
          </div>
        </AnimatedSection>

        {/* Grid de cards — altura uniforme, sem offset */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch"
        >
          {filtered.length > 0 ? (
            filtered.map((project) => (
              <div
                key={project.id}
                className="project-card-wrapper"
              >
                <ProjectCard project={project} />
              </div>
            ))
          ) : (
            <p className="col-span-full font-body text-black/20 text-center py-24 tracking-widest uppercase text-xs">
              Projetos em breve.
            </p>
          )}
        </div>

      </div>
    </section>
  )
}
