'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'

// Imagens da pasta public/images — atualizar conforme arquivos disponíveis
const SLIDES = [
  '/images/hero-bg.jpeg',
  '/images/04.jpeg',
  '/images/05.jpeg',
  '/images/render-07.jpeg',
]

const SLIDE_INTERVAL = 5000 // 5 segundos por slide

const HEADLINE_LINES = [
  ['PROJETOS', 'QUE'],
  ['VENDEM', 'ANTES'],
  ['DE', 'SEREM', 'CONSTRUÍDOS.'],
]

const SUBHEADLINE =
  'Arquitetura, BIM e visualização 3D para escritórios e incorporadoras que precisam apresentar projetos com o nível de qualidade que os clientes exigem.'

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([])
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ─── Slider: avança automaticamente ──────────────────────────
  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
    // Reinicia o intervalo ao clicar em um dot
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, SLIDE_INTERVAL)
  }, [])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, SLIDE_INTERVAL)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // ─── Animação de entrada (word mask + subtitle) ───────────────
  useEffect(() => {
    const subtitle = subtitleRef.current
    const scroll = scrollRef.current

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (subtitle) subtitle.style.opacity = '1'
      if (scroll) {
        scroll.style.opacity = '1'
        scroll.style.transform = 'translateY(0)'
      }
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
        if (subtitle) subtitle.style.opacity = '0'
        if (scroll) {
          scroll.style.opacity = '0'
          scroll.style.transform = 'translateY(8px)'
        }

        createTimeline({ defaults: { ease: 'outExpo' } })
          .add(words, {
            translateY: ['110%', '0%'],
            duration: 600,
            delay: stagger(80),
          }, 400)
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
        if (subtitle) subtitle.style.opacity = '1'
        if (scroll) {
          scroll.style.opacity = '1'
          scroll.style.transform = 'translateY(0)'
        }
      }
    }

    run()
    return () => { cancelled = true }
  }, [])

  // ─── Parallax GSAP na imagem de fundo ─────────────────────────
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ctx: { revert?: () => void } = {}

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const bgImages = sectionRef.current?.querySelectorAll<HTMLElement>('.hero-bg-image')
      if (!bgImages?.length) return

      ctx = gsap.context(() => {
        gsap.to(bgImages, {
          yPercent: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
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
      {/* ─── Slider de imagens ─────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        {SLIDES.map((src, index) => (
          <div
            key={src}
            className="absolute inset-0 hero-bg-image"
            style={{
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 1200ms cubic-bezier(.16,1,.3,1)',
              zIndex: index === currentSlide ? 1 : 0,
            }}
            aria-hidden={index !== currentSlide}
          >
            <Image
              src={src}
              alt={`Render arquitetônico ${index + 1}`}
              fill
              priority={index === 0}
              quality={88}
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
        ))}

        {/* Overlay escuro sobre todas as imagens */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.52)', zIndex: 2 }}
          aria-hidden="true"
        />
      </div>

      {/* ─── Conteúdo — ancorado no fundo-esquerdo ───────────────── */}
      <div className="relative z-10 flex flex-col justify-end flex-1 px-6 lg:px-12 pb-16 lg:pb-20">

        {/* Headline — word mask */}
        <div
          className="mb-6 md:mb-8"
          aria-label={HEADLINE_LINES.map((l) => l.join(' ')).join(' ')}
        >
          {HEADLINE_LINES.map((lineWords, lineIndex) => (
            <div
              key={lineIndex}
              className="flex leading-none"
              style={{ gap: '0.28em' }}
            >
              {lineWords.map((word) => {
                const idx = wordIndex++
                return (
                  <div key={`${word}-${idx}`} className="overflow-hidden">
                    <span
                      ref={(el) => { wordsRef.current[idx] = el }}
                      aria-hidden="true"
                      className="block font-display text-white"
                      style={{ fontSize: 'clamp(48px, 8vw, 140px)', lineHeight: 0.92 }}
                    >
                      {word}
                    </span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Subheadline */}
        <p
          ref={subtitleRef}
          className="font-body text-white/75 leading-relaxed text-base lg:text-lg"
          style={{ maxWidth: '480px' }}
        >
          {SUBHEADLINE}
        </p>
      </div>

      {/* ─── Rodapé: SCROLL + dots de navegação ──────────────────── */}
      <div
        ref={scrollRef}
        className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5 border-t border-white/[0.12]"
      >
        {/* Scroll indicator */}
        <div className="flex items-center gap-3" aria-hidden="true">
          <div className="scroll-indicator-line" />
          <span className="font-body text-white/40 text-xs tracking-[0.2em] uppercase">
            SCROLL
          </span>
        </div>

        {/* Dots de navegação */}
        <div className="flex items-center gap-2" role="tablist" aria-label="Navegação do slider">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === currentSlide}
              aria-label={`Imagem ${i + 1} de ${SLIDES.length}`}
              onClick={() => goToSlide(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === currentSlide ? '20px' : '6px',
                height: '6px',
                background: i === currentSlide
                  ? 'rgba(255,255,255,0.85)'
                  : 'rgba(255,255,255,0.25)',
                borderRadius: '3px',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
