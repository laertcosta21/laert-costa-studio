'use client'

import { useEffect, useRef } from 'react'

const HEADLINE_LINES = [
  ['PROJETOS', 'QUE'],
  ['VENDEM', 'ANTES'],
  ['DE', 'SEREM', 'CONSTRUÍDOS.'],
]

const SUBHEADLINE =
  'Arquitetura, BIM e visualização 3D para escritórios e incorporadoras que precisam apresentar projetos com o nível de qualidade que os clientes exigem.'

export default function HeroSection() {
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([])
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

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

  // ─── Parallax de scroll no vídeo de fundo ─────────────────────
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ctx: { revert?: () => void } = {}

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const video = videoRef.current
      if (!video) return

      ctx = gsap.context(() => {
        gsap.to(video, {
          yPercent: 15,
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

  // ─── Interação do vídeo com o cursor (parallax + zoom) ────────
  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    let raf: number

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      target.x = (e.clientX - rect.left) / rect.width - 0.5
      target.y = (e.clientY - rect.top) / rect.height - 0.5
    }

    const handleMouseLeave = () => {
      target.x = 0
      target.y = 0
    }

    const tick = () => {
      current.x += (target.x - current.x) * 0.06
      current.y += (target.y - current.y) * 0.06

      const translateX = current.x * -40
      const translateY = current.y * -40

      video.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(1.08)`

      raf = requestAnimationFrame(tick)
    }

    section.addEventListener('mousemove', handleMouseMove)
    section.addEventListener('mouseleave', handleMouseLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      section.removeEventListener('mousemove', handleMouseMove)
      section.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Índice global de palavras para o array de refs
  let wordIndex = 0

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex flex-col justify-between min-h-[100dvh] overflow-hidden bg-black"
    >
      {/* ─── Vídeo de fundo ─────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover object-center"
          src="/images/video.mp4"
          poster="/images/01.jpeg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          style={{ willChange: 'transform', transform: 'scale(1.08)' }}
        />

        {/* Overlay escuro sobre o vídeo */}
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

      {/* ─── Rodapé: SCROLL ────────────────────────────────────────── */}
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
      </div>
    </section>
  )
}
