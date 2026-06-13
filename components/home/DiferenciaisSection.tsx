'use client'

import { useEffect, useRef } from 'react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import CounterNumber from '@/components/ui/CounterNumber'
import { Container } from '@/components/ui/Container'

const DIFERENCIAIS = [
  {
    title: 'RIGOR TÉCNICO EM TODAS AS ETAPAS',
    body: 'Cada projeto passa por revisão técnica completa antes da entrega. Documentação que não volta do município.',
  },
  {
    title: 'BIM COMO PADRÃO, NÃO OPÇÃO',
    body: 'Todos os projetos são modelados em BIM desde o anteprojeto, garantindo compatibilização e redução de erros em obra.',
  },
  {
    title: 'ATENDIMENTO DIRETO POR PROJETO',
    body: 'Sem terceirizar, sem template. Cada cliente tem atendimento direto com Laert Costa do briefing à entrega final.',
  },
]

const CONTADORES = [
  { target: 10,  prefix: '+', suffix: '',  label: 'anos de experiência' },
  { target: 50,  prefix: '+', suffix: '',  label: 'projetos entregues' },
  { target: 100, prefix: '',  suffix: '%', label: 'taxa de aprovação' },
  { target: 2,   prefix: '',  suffix: '',  label: 'pós-graduações' },
]

const TITLE_WORDS = ['TÉCNICA,', 'PRECISÃO', 'E', 'ENTREGA', 'SEM', 'INTERMEDIÁRIOS.']

export default function DiferenciaisSection() {
  const titleContainerRef = useRef<HTMLHeadingElement>(null)
  const titleWordsRef = useRef<(HTMLSpanElement | null)[]>([])
  const linesContainerRef = useRef<HTMLDivElement>(null)
  const linesRef = useRef<(HTMLDivElement | null)[]>([])
  const countersContainerRef = useRef<HTMLDivElement>(null)
  const countersRef = useRef<(HTMLDivElement | null)[]>([])

  // ─── Reveal: título (word mask), linhas e contadores ──────────
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ctx: { revert?: () => void } = {}

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        // Título — word mask translateY 110% → 0
        const words = titleWordsRef.current.filter((el): el is HTMLSpanElement => el !== null)
        if (words.length) {
          gsap.set(words, { yPercent: 110 })
          gsap.to(words, {
            yPercent: 0,
            duration: 0.7,
            ease: 'power4.out',
            stagger: 0.06,
            scrollTrigger: {
              trigger: titleContainerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          })
        }

        // Linhas dos diferenciais — desenham da esquerda pra direita
        const lines = linesRef.current.filter((el): el is HTMLDivElement => el !== null)
        if (lines.length) {
          gsap.set(lines, { scaleX: 0 })
          gsap.to(lines, {
            scaleX: 1,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: linesContainerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          })
        }

        // Contadores — pop de escala
        const counters = countersRef.current.filter((el): el is HTMLDivElement => el !== null)
        if (counters.length) {
          gsap.set(counters, { scale: 0.9 })
          gsap.to(counters, {
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.7)',
            stagger: 0.08,
            scrollTrigger: {
              trigger: countersContainerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          })
        }
      })
    }

    init()
    return () => ctx.revert?.()
  }, [])

  // Índice global de palavras para o array de refs
  let wordIndex = 0

  return (
    <section
      id="diferenciais"
      className="bg-white border-t border-black/10 py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)]"
    >
      <Container>

        {/* Numeração editorial */}
        <AnimatedSection>
          <div className="flex items-center justify-between mb-6">
            <span className="editorial-label text-black/40">/ 03 — DIFERENCIAIS</span>
            <span className="editorial-label text-black/40">P. 003 / 06</span>
          </div>
        </AnimatedSection>

        {/* Label / eyebrow */}
        <AnimatedSection>
          <p
            className="font-body uppercase"
            style={{
              fontSize: '12px',
              letterSpacing: '0.18em',
              color: 'rgba(0,0,0,0.55)',
              marginBottom: '24px',
            }}
          >
            — POR QUE ESCOLHER O STUDIO
          </p>
        </AnimatedSection>

        {/* Título principal — word mask reveal */}
        <h2
          ref={titleContainerRef}
          className="font-display text-black leading-none tracking-[-0.01em] text-[32px] md:text-[64px]"
          style={{
            maxWidth: '700px',
            marginBottom: '64px',
          }}
        >
          {TITLE_WORDS.map((word) => {
            const idx = wordIndex++
            return (
              <span key={`${word}-${idx}`} className="inline-block overflow-hidden" style={{ marginRight: '0.28em' }}>
                <span
                  ref={(el) => { titleWordsRef.current[idx] = el }}
                  className="inline-block"
                >
                  {word}
                </span>
              </span>
            )
          })}
        </h2>

        {/* Três colunas de diferenciais */}
        <div ref={linesContainerRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DIFERENCIAIS.map((item, index) => (
            <AnimatedSection key={item.title} delay={index * 80}>
              <div style={{ position: 'relative', paddingTop: '32px' }}>
                <div
                  ref={(el) => { linesRef.current[index] = el }}
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: '#000',
                    transformOrigin: 'left center',
                  }}
                />
                <h3
                  className="font-body uppercase"
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    color: '#000',
                    marginBottom: '16px',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="font-body"
                  style={{
                    fontSize: '16px',
                    fontWeight: 400,
                    color: 'rgba(0,0,0,0.65)',
                    lineHeight: 1.7,
                  }}
                >
                  {item.body}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Contadores */}
        <div
          ref={countersContainerRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          style={{
            borderTop: '1px solid rgba(0,0,0,0.20)',
            paddingTop: '32px',
            marginTop: '80px',
          }}
        >
          {CONTADORES.map((counter, index) => (
            <div
              key={counter.label}
              ref={(el) => { countersRef.current[index] = el }}
              style={{ transformOrigin: 'left center' }}
            >
              <CounterNumber
                target={counter.target}
                prefix={counter.prefix}
                suffix={counter.suffix}
                className="font-display text-black leading-none block text-[36px] md:text-[56px]"
              />
              <span
                className="font-body block mt-2"
                style={{
                  fontSize: '13px',
                  color: 'rgba(0,0,0,0.50)',
                  letterSpacing: '0.12em',
                  textTransform: 'lowercase',
                }}
              >
                {counter.label}
              </span>
            </div>
          ))}
        </div>

      </Container>
    </section>
  )
}
