'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import AnimatedSection from '@/components/ui/AnimatedSection'

interface ServiceItem {
  number: string
  title: string
  description: string
  deliverables: string[]
}

const SERVICES: ServiceItem[] = [
  {
    number: '01',
    title: 'Projetos Residenciais',
    description:
      'Do anteprojeto ao executivo completo para residências unifamiliares e condomínios. Documentação completa para aprovação municipal e execução em obra.',
    deliverables: [
      'Estudo preliminar e anteprojeto',
      'Projeto arquitetônico executivo',
      'Documentação para aprovação municipal',
      'Memorial descritivo e quantitativos',
    ],
  },
  {
    number: '02',
    title: 'Projetos Comerciais',
    description:
      'Lojas, escritórios, restaurantes e edifícios corporativos com aprovação garantida. Experiência em projetos que cumprem NBR, vigilância sanitária e corpo de bombeiros.',
    deliverables: [
      'Levantamento e programa de necessidades',
      'Projeto arquitetônico e layout',
      'Aprovação em órgãos competentes',
      'Compatibilização com instalações',
    ],
  },
  {
    number: '03',
    title: 'Render & Visualização 3D',
    description:
      'Perspectivas fotorrealistas para lançamentos imobiliários, aprovação de projetos e material de marketing. Imagens que vendem antes da obra começar.',
    deliverables: [
      'Modelagem 3D arquitetônica',
      'Renders externos e internos',
      'Vistas aéreas e perspectivas de implantação',
      'Revisões inclusas no escopo',
    ],
  },
  {
    number: '04',
    title: 'Vídeos Arquitetônicos',
    description:
      'Animações e tours virtuais para lançamentos de empreendimentos. Material de marketing em vídeo para corretoras, incorporadoras e redes sociais.',
    deliverables: [
      'Animação walk-through',
      'Tour virtual 360°',
      'Drone virtual sobre implantação',
      'Entrega em múltiplos formatos',
    ],
  },
  {
    number: '05',
    title: 'Compatibilização BIM',
    description:
      'Coordenação e compatibilização de projetos de múltiplas disciplinas via Revit e Navisworks. Redução de conflitos e retrabalho na fase de obra.',
    deliverables: [
      'Modelagem BIM em Revit',
      'Clash detection no Navisworks',
      'Relatório de interferências',
      'Reuniões de coordenação',
    ],
  },
  {
    number: '06',
    title: 'Registro de Incorporação / NBR 12721',
    description:
      'Elaboração de toda documentação exigida para registro de incorporação imobiliária: quadros da NBR 12721, memorial de incorporação e plantas aprovadas.',
    deliverables: [
      'Quadros A a I da NBR 12721',
      'Memorial descritivo do empreendimento',
      'Fração ideal e áreas privativas',
      'Acompanhamento no cartório',
    ],
  },
]

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5567993248550'

interface AccordionItemProps {
  service: ServiceItem
  index: number
  isOpen: boolean
  onToggle: (index: number) => void
}

function AccordionItem({ service, index, isOpen, onToggle }: AccordionItemProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const panelId = `svc-panel-${service.number}`
  const triggerId = `svc-trigger-${service.number}`

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    if (isOpen) {
      panel.style.maxHeight = `${panel.scrollHeight}px`
      panel.style.opacity = '1'
    } else {
      panel.style.maxHeight = '0px'
      panel.style.opacity = '0'
    }
  }, [isOpen])

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Olá, Laert! Tenho interesse em ${service.title}. Pode me dar mais informações?`
  )}`

  return (
    <div className="border-b border-white/10">
      {/* Trigger — grid: número + nome + ícone */}
      <button
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => onToggle(index)}
        type="button"
        className="w-full py-6 lg:py-8 text-left group"
        style={{ minHeight: '80px', cursor: 'pointer' }}
      >
        <div className="flex items-center">
          {/* Col 1 — número */}
          <span
            className="font-body flex-shrink-0"
            style={{
              width: '4rem',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.30)',
              lineHeight: 1,
            }}
          >
            {service.number}
          </span>

          {/* Col 2 — nome do serviço */}
          <span
            className="font-display uppercase leading-none flex-1 transition-colors duration-200"
            style={{
              fontSize: 'clamp(20px, 2.8vw, 40px)',
              color: isOpen ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,1)',
            }}
          >
            {service.title}
          </span>

          {/* Col 3 — ícone +/− */}
          <span
            className="ml-auto flex-shrink-0 font-body transition-colors duration-200"
            style={{
              fontSize: '24px',
              color: 'rgba(255,255,255,0.50)',
              lineHeight: 1,
              width: '24px',
              textAlign: 'center',
            }}
            aria-hidden="true"
          >
            {isOpen ? '−' : '+'}
          </span>
        </div>
      </button>

      {/* Painel expandível */}
      <div
        ref={panelRef}
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        style={{
          maxHeight: index === 0 ? undefined : '0px',
          opacity: index === 0 ? 1 : 0,
          overflow: 'hidden',
          transition:
            'max-height 450ms cubic-bezier(.16,1,.3,1), opacity 380ms cubic-bezier(.16,1,.3,1)',
        }}
      >
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3 pl-0 md:pl-16"
          style={{ paddingTop: '24px', paddingBottom: '32px' }}
        >
          {/* Entregáveis */}
          {service.deliverables.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3"
              style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px' }}
            >
              <span
                className="flex-shrink-0 font-body"
                style={{ color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}
                aria-hidden="true"
              >
                —
              </span>
              <span className="font-body" style={{ lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}

          {/* Botão WhatsApp — ocupa toda a largura em sm */}
          <div className="sm:col-span-2" style={{ marginTop: '32px' }}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center font-body uppercase transition-colors"
              style={{
                fontSize: '13px',
                letterSpacing: '0.14em',
                padding: '12px 24px',
                border: '1px solid rgba(255,255,255,0.30)',
                background: 'transparent',
                color: 'rgba(255,255,255,0.90)',
                borderRadius: '0',
                transition: 'background 250ms ease, color 250ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fff'
                e.currentTarget.style.color = '#000'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'rgba(255,255,255,0.90)'
              }}
            >
              SOLICITAR ORÇAMENTO
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ServicesSection() {
  const [openIndex, setOpenIndex] = useState<number>(0)

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index))
  }, [])

  // ─── Animação do título com GSAP ──────────────────────────────
  useEffect(() => {
    const el = document.querySelector<HTMLElement>('.services-title')
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
          { opacity: 0, y: 60, skewY: 3 },
          {
            opacity: 1,
            y: 0,
            skewY: 0,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }

    init()
    return () => ctx.revert?.()
  }, [])

  return (
    <section
      id="servicos"
      className="bg-black border-t border-white/10 py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)]"
    >
      <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-12">

        {/* Cabeçalho — grid 2 colunas: título esquerda, descrição direita */}
        <AnimatedSection>
          <div className="flex flex-col gap-4 md:grid md:grid-cols-[1fr_auto] md:items-end md:gap-8 mb-16">
            {/* Esquerda — título */}
            <h2
              className="services-title font-display text-white leading-none"
              style={{ fontSize: 'clamp(40px, 6vw, 100px)' }}
            >
              SERVIÇOS.
            </h2>

            {/* Direita — descrição */}
            <p
              className="font-body text-right hidden md:block"
              style={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.50)',
                maxWidth: '320px',
                lineHeight: 1.65,
                paddingBottom: '6px',
              }}
            >
              Arquitetura executiva, visualização 3D e BIM para escritórios e
              incorporadoras que exigem precisão técnica.
            </p>
          </div>
        </AnimatedSection>

        {/* Lista de serviços em accordion */}
        <div
          className="border-t border-white/10"
          role="list"
          aria-label="Lista de serviços"
        >
          {SERVICES.map((service, i) => (
            <AnimatedSection key={service.number} delay={i * 30}>
              <div role="listitem">
                <AccordionItem
                  service={service}
                  index={i}
                  isOpen={openIndex === i}
                  onToggle={handleToggle}
                />
              </div>
            </AnimatedSection>
          ))}
        </div>

      </div>
    </section>
  )
}
