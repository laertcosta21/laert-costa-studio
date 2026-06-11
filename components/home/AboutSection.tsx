'use client'

import { useEffect, useRef } from 'react'

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const watermarkRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ctx: { revert?: () => void } = {}

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        // Efeito parallax suave — a seção desliza levemente ao ser coberta
        gsap.fromTo(
          el,
          { yPercent: 0 },
          {
            yPercent: -8,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          }
        )

        // Watermark — parallax mais acentuado, cria profundidade atrás do texto
        if (watermarkRef.current) {
          gsap.fromTo(
            watermarkRef.current,
            { yPercent: 0 },
            {
              yPercent: -30,
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
              },
            }
          )
        }

        // Animação de entrada dos textos
        const textBlocks = el.querySelectorAll('[data-reveal]')
        textBlocks.forEach((block, i) => {
          gsap.fromTo(
            block,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay: i * 0.15,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: block,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            }
          )
        })
      }, el)
    }

    init()
    return () => ctx.revert?.()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="sobre"
      className="relative sticky top-0 z-10 overflow-hidden will-change-transform"
      style={{ background: '#F5F5F4' }}
    >
      {/* Watermark — texto gigante de fundo, parallax próprio */}
      <div
        ref={watermarkRef}
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ zIndex: 0 }}
      >
        <span
          className="font-display text-black leading-none whitespace-nowrap"
          style={{ fontSize: 'clamp(120px, 22vw, 380px)', opacity: 0.04 }}
        >
          LAERT COSTA
        </span>
      </div>

      <div
        className="relative max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 2xl:px-24"
        style={{ paddingTop: '96px', paddingBottom: '128px', zIndex: 1 }}
      >

        {/* Linha 1 — label + título */}
        <div className="grid grid-cols-12 gap-6">

          {/* Label vertical */}
          <div className="col-span-2 lg:col-span-1 pt-2" data-reveal>
            <span
              className="font-body uppercase block"
              style={{ fontSize: '12px', letterSpacing: '0.18em', color: 'rgba(0,0,0,0.55)' }}
            >
              — SOBRE
            </span>
          </div>

          {/* Título massivo */}
          <div className="col-span-10 lg:col-span-5" data-reveal>
            <h2
              className="font-display text-black leading-none"
              style={{ fontSize: 'clamp(64px, 8vw, 120px)' }}
            >
              Sobre.
            </h2>
          </div>
        </div>

        {/* Linha 2 — textos */}
        <div
          className="grid grid-cols-12 gap-6"
          style={{ marginTop: 'clamp(64px, 8vw, 80px)' }}
        >

          {/* Coluna vazia esquerda */}
          <div className="hidden md:block md:col-span-1" />

          {/* Texto principal — 5 colunas */}
          <div className="col-span-12 md:col-span-5" data-reveal>
            <p
              className="font-body text-black leading-snug mb-4"
              style={{ fontSize: 'clamp(18px, 1.6vw, 22px)', fontWeight: 600 }}
            >
              Mais de 10 anos dedicados a projetos que precisam funcionar antes de serem bonitos.
            </p>
            <p
              className="font-body text-black/60 leading-relaxed"
              style={{ fontSize: 'clamp(16px, 1.4vw, 20px)', fontWeight: 400 }}
            >
              Residências, edifícios comerciais e lançamentos imobiliários entregues com documentação
              técnica completa, modelagem BIM e visualização 3D que fecha negócio.
            </p>
          </div>

          {/* Espaço */}
          <div className="hidden md:block md:col-span-2" />

          {/* Texto de apoio — 4 colunas */}
          <div className="col-span-12 md:col-span-4 mt-8 md:mt-0" data-reveal>
            <p
              className="font-body text-black/60 leading-relaxed"
              style={{ fontSize: '14px' }}
            >
              Cada projeto tem atendimento direto. Sem intermediários, sem terceirização.
              Do briefing inicial à entrega dos arquivos finais, você fala com quem faz.
            </p>

            {/* Especialidades */}
            <div style={{ marginTop: '32px' }}>
              {[
                'Projetos residenciais e comerciais',
                'Compatibilização BIM',
                'Render & Visualização 3D',
                'Registro de Incorporação / NBR 12721',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 font-body text-black/60"
                  style={{ fontSize: '13px', marginBottom: '10px' }}
                >
                  <span className="w-4 h-px bg-black/30 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
