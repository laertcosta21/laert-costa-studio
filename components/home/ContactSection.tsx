'use client'

import { useState, useEffect, useRef } from 'react'

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5567993248550'

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')

  // GSAP ScrollTrigger — parallax sticky + reveal
  useEffect(() => {
    const el = sectionRef.current
    const title = titleRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ctx: { revert?: () => void } = {}

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        // Parallax suave — seção sobe levemente ao ser coberta pelo footer
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

        // Reveal das linhas do título
        if (title) {
          const lines = title.querySelectorAll('[data-line]')
          gsap.fromTo(
            lines,
            { y: '100%', opacity: 0 },
            {
              y: '0%',
              opacity: 1,
              duration: 0.7,
              ease: 'power2.out',
              stagger: 0.1,
              scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            }
          )
        }

        // Reveal dos outros blocos
        const reveals = el.querySelectorAll('[data-reveal]')
        gsap.fromTo(
          reveals,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.12,
            delay: 0.3,
            scrollTrigger: {
              trigger: el,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        )
      }, el)
    }

    init()
    return () => ctx.revert?.()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = encodeURIComponent(
      `Olá Laert, meu nome é ${nome}.\n\nEmail: ${email}\n\n${mensagem || 'Gostaria de conversar sobre um projeto.'}`
    )
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank')
  }

  const inputClass =
    'w-full border-b border-black/20 bg-transparent py-4 font-body text-black placeholder-black/30 focus:outline-none focus:border-black transition-colors mb-6'

  return (
    <section
      ref={sectionRef}
      id="contato"
      className="sticky top-0 z-20 will-change-transform"
      style={{ background: '#F5F5F4' }}
    >
      <div
        className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 2xl:px-24"
        style={{ paddingTop: '96px', paddingBottom: '128px' }}
      >

        {/* Linha 1 — label + título massivo */}
        <div className="grid grid-cols-12 gap-6 mb-16 lg:mb-20">

          {/* Label */}
          <div className="col-span-12 lg:col-span-1 lg:pt-4">
            <span
              className="font-body text-black/40 tracking-widest block"
              style={{ fontSize: '12px' }}
            >
              — CONTATO
            </span>
          </div>

          {/* Título */}
          <div ref={titleRef} className="col-span-12 lg:col-span-11 overflow-hidden">
            {['Vamos', 'trabalhar', 'juntos?'].map((word) => (
              <div key={word} style={{ overflow: 'hidden' }}>
                <span
                  data-line
                  className="font-display text-black leading-none block"
                  style={{ fontSize: 'clamp(56px, 8vw, 130px)', display: 'block' }}
                >
                  {word}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Linha 2 — subtítulo + formulário */}
        <div className="grid grid-cols-12 gap-6 lg:gap-12">

          {/* Coluna esquerda — texto + contatos */}
          <div className="col-span-12 lg:col-span-5" data-reveal>
            <p
              className="font-body text-black/50 leading-relaxed"
              style={{ fontSize: '18px', maxWidth: '420px' }}
            >
              Quer fazer parte de um projeto com atendimento direto e resultado
              técnico de alto nível? Entre em contato.
            </p>

            <div style={{ marginTop: '32px' }}>
              <a
                href="mailto:laert.14@gmail.com"
                className="font-body text-black font-medium block"
                style={{
                  fontSize: '16px',
                  borderBottom: '1px solid rgba(0,0,0,0.2)',
                  paddingBottom: '4px',
                  display: 'inline-block',
                  textDecoration: 'none',
                }}
              >
                laert.14@gmail.com
              </a>
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-black font-medium block"
                style={{
                  fontSize: '16px',
                  borderBottom: '1px solid rgba(0,0,0,0.2)',
                  paddingBottom: '4px',
                  marginTop: '12px',
                  display: 'inline-block',
                  textDecoration: 'none',
                }}
              >
                +55 (67) 99324-8550
              </a>
            </div>
          </div>

          {/* Coluna direita — formulário */}
          <div className="col-span-12 lg:col-span-6 lg:col-start-7 mt-12 lg:mt-0" data-reveal>
            <form onSubmit={handleSubmit} noValidate>
              <input
                type="text"
                placeholder="Nome *"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={inputClass}
                style={{ fontSize: '16px' }}
              />
              <input
                type="email"
                placeholder="Email *"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                style={{ fontSize: '16px' }}
              />
              <textarea
                placeholder="Mensagem"
                rows={4}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                className={`${inputClass} resize-none`}
                style={{ fontSize: '16px' }}
              />
              <button
                type="submit"
                className="font-body bg-black text-white hover:bg-black/80 transition-colors"
                style={{
                  marginTop: '16px',
                  fontSize: '13px',
                  letterSpacing: '0.14em',
                  padding: '16px 32px',
                  borderRadius: 0,
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                ENVIAR MENSAGEM →
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}
