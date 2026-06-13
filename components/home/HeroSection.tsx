'use client'

import { useEffect, useRef } from 'react'
import { Container } from '@/components/ui/Container'

const LOGO_LINES = [
  { words: ['STUDIO'], size: 'clamp(40px, 9vw, 160px)' },
  { words: ['LAERT', 'COSTA'], size: 'clamp(64px, 16vw, 280px)' },
]

const TAGLINE = 'PROJETOS QUE VENDEM ANTES DE SEREM CONSTRUÍDOS.'

const SUBHEADLINE =
  'Arquitetura, BIM e visualização 3D para escritórios e incorporadoras que precisam apresentar projetos com o nível de qualidade que os clientes exigem.'

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([])
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const topBarRef = useRef<HTMLDivElement>(null)

  // ─── Animação de entrada (word mask + textos + barras) ────────
  useEffect(() => {
    const tagline = taglineRef.current
    const subtitle = subtitleRef.current
    const scroll = scrollRef.current
    const topBar = topBarRef.current

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (tagline) tagline.style.opacity = '1'
      if (subtitle) subtitle.style.opacity = '1'
      if (scroll) {
        scroll.style.opacity = '1'
        scroll.style.transform = 'translateY(0)'
      }
      if (topBar) topBar.style.opacity = '1'
      return
    }

    const words = wordsRef.current.filter((el): el is HTMLSpanElement => el !== null)
    if (words.length === 0) return

    let cancelled = false

    const run = async () => {
      try {
        const { createTimeline, stagger } = await import('animejs')
        if (cancelled) return

        words.forEach((w) => { w.style.transform = 'translateY(110%)' })
        if (tagline) tagline.style.opacity = '0'
        if (subtitle) subtitle.style.opacity = '0'
        if (scroll) {
          scroll.style.opacity = '0'
          scroll.style.transform = 'translateY(8px)'
        }
        if (topBar) topBar.style.opacity = '0'

        createTimeline({ defaults: { ease: 'outExpo' } })
          .add(topBar ? [topBar] : [], {
            opacity: [0, 1],
            duration: 500,
          }, 0)
          .add(words, {
            translateY: ['110%', '0%'],
            duration: 700,
            delay: stagger(90),
          }, 200)
          .add(tagline ? [tagline] : [], {
            opacity: [0, 1],
            duration: 400,
          }, '-=300')
          .add(subtitle ? [subtitle] : [], {
            opacity: [0, 1],
            duration: 400,
          }, '-=200')
          .add(scroll ? [scroll] : [], {
            opacity: [0, 1],
            translateY: [8, 0],
            duration: 400,
          }, '-=200')
      } catch {
        words.forEach((w) => { w.style.transform = 'translateY(0)' })
        if (tagline) tagline.style.opacity = '1'
        if (subtitle) subtitle.style.opacity = '1'
        if (scroll) {
          scroll.style.opacity = '1'
          scroll.style.transform = 'translateY(0)'
        }
        if (topBar) topBar.style.opacity = '1'
      }
    }

    run()
    return () => { cancelled = true }
  }, [])

  // ─── Transição de saída: texto cresce e dá fade out ao rolar ──
  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    if (!section || !content) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ctx: { revert?: () => void } = {}

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        gsap.fromTo(
          content,
          { scale: 1, opacity: 1 },
          {
            scale: 1.18,
            opacity: 0,
            ease: 'none',
            transformOrigin: 'left center',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      })
    }

    init()
    return () => ctx.revert?.()
  }, [])

  // Índice global de palavras para o array de refs
  let wordIndex = 0

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex flex-col justify-between min-h-[100dvh] overflow-hidden bg-black"
    >
      {/* ─── Cabeçalho editorial: labels de canto ────────────────── */}
      <div ref={topBarRef} className="relative z-10 border-b border-white/[0.12] mt-16 md:mt-20">
        <Container className="flex items-center justify-between py-5">
          <span className="editorial-label text-white/40">
            ARQUITETURA — BIM — 3D
          </span>
          <span className="editorial-label text-white/40">
            CAMPO GRANDE, MS
          </span>
        </Container>
      </div>

      {/* ─── Conteúdo central — logo gigante ─────────────────────── */}
      <div ref={contentRef} className="relative z-10 flex flex-col justify-center flex-1 py-16 md:py-20">
        <Container>

          {/* Logo gigante — word mask */}
          <div
            className="mb-8 md:mb-10"
            aria-label="Laert Costa Studio"
          >
            {LOGO_LINES.map((line, lineIndex) => (
              <div
                key={lineIndex}
                className="flex flex-wrap"
                style={{ gap: '0.28em' }}
              >
                {line.words.map((word) => {
                  const idx = wordIndex++
                  return (
                    <div key={`${word}-${idx}`} className="overflow-hidden">
                      <span
                        ref={(el) => { wordsRef.current[idx] = el }}
                        aria-hidden="true"
                        className="block font-display text-white leading-[0.92] tracking-[-0.02em]"
                        style={{ fontSize: line.size }}
                      >
                        {word}
                      </span>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Tagline — substitui a antiga headline */}
          <p
            ref={taglineRef}
            className="editorial-label text-white/70 mb-3"
            style={{ fontSize: '13px', letterSpacing: '0.16em' }}
          >
            / {TAGLINE}
          </p>

          {/* Subheadline */}
          <p
            ref={subtitleRef}
            className="font-body text-white/55 leading-relaxed text-base lg:text-lg max-w-lg"
          >
            {SUBHEADLINE}
          </p>
        </Container>
      </div>

      {/* ─── Rodapé editorial: scroll + numeração ─────────────────── */}
      <div ref={scrollRef} className="relative z-10 border-t border-white/[0.12]">
        <Container className="flex items-center justify-between py-5">
          {/* Scroll indicator */}
          <div className="flex items-center gap-3" aria-hidden="true">
            <div className="scroll-indicator-line" />
            <span className="editorial-label text-white/40">
              SCROLL
            </span>
          </div>

          {/* Numeração editorial */}
          <span className="editorial-label text-white/40">
            P. 001 / 06
          </span>
        </Container>
      </div>
    </section>
  )
}
