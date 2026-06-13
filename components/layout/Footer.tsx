import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { Container } from '@/components/ui/Container'

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5567993248550'

const NAV_LINKS = [
  { href: '/#servicos', label: 'Serviços' },
  { href: '/#projetos', label: 'Projetos' },
  { href: '/#diferenciais', label: 'Diferenciais' },
  { href: '/#sobre', label: 'Sobre' },
  { href: '/#contato', label: 'Contato' },
]

const SOCIAL_LINKS = [
  { href: 'https://www.instagram.com/', label: 'Instagram' },
  { href: 'https://www.linkedin.com/', label: 'LinkedIn' },
  { href: `https://wa.me/${WA_NUMBER}`, label: 'WhatsApp' },
]

export default function Footer() {
  return (
    <footer
      className="relative z-0"
      style={{ background: '#F5F5F4', borderTop: '1px solid rgba(0,0,0,0.08)' }}
    >
      <Container style={{ paddingTop: '64px', paddingBottom: '48px' }}>

        {/* Grid principal */}
        <div className="grid grid-cols-12 gap-6 mb-16">

          {/* Coluna 1 — contatos */}
          <AnimatedSection className="col-span-12 md:col-span-3">
            <a
              href="mailto:laert.14@gmail.com"
              className="font-body text-black font-medium group"
              style={{
                fontSize: '16px',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(0,0,0,0.15)',
                paddingBottom: '6px',
                display: 'inline-flex',
                alignItems: 'flex-start',
                gap: '8px',
              }}
            >
              <span style={{ color: 'rgba(0,0,0,0.3)' }}>+</span>
              laert.14@gmail.com
            </a>
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-black font-medium group"
              style={{
                fontSize: '16px',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(0,0,0,0.15)',
                paddingBottom: '6px',
                display: 'inline-flex',
                alignItems: 'flex-start',
                gap: '8px',
                marginTop: '12px',
              }}
            >
              <span style={{ color: 'rgba(0,0,0,0.3)' }}>+</span>
              +55 (67) 99324-8550
            </a>
          </AnimatedSection>

          {/* Espaço central */}
          <div className="hidden md:block md:col-span-3" />

          {/* Coluna 2 — navegação */}
          <AnimatedSection className="col-span-6 md:col-span-3" delay={60}>
            <span
              className="font-body text-black/55 tracking-widest block mb-4"
              style={{ fontSize: '12px' }}
            >
              Navegação
            </span>
            <nav aria-label="Navegação do rodapé">
              <ul role="list" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {NAV_LINKS.map(({ href, label }) => (
                  <li key={href} style={{ marginBottom: '8px' }}>
                    <Link
                      href={href}
                      className="font-body text-black hover:text-black/50 transition-colors"
                      style={{ fontSize: '16px', textDecoration: 'none' }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </AnimatedSection>

          {/* Coluna 3 — social */}
          <AnimatedSection className="col-span-6 md:col-span-2 md:col-start-11" delay={120}>
            <span
              className="font-body text-black/55 tracking-widest block mb-4"
              style={{ fontSize: '12px' }}
            >
              Social
            </span>
            {SOCIAL_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-black hover:text-black/50 transition-colors"
                style={{
                  fontSize: '16px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginBottom: '8px',
                }}
              >
                {label}
                <span style={{ fontSize: '12px' }}>&#8599;</span>
              </a>
            ))}
          </AnimatedSection>
        </div>

        {/* Linha inferior */}
        <AnimatedSection
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          delay={180}
          style={{ paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.1)' }}
        >
          <div className="flex flex-col leading-none">
            <span
              className="font-display text-black"
              style={{ fontSize: '18px', letterSpacing: '0.12em' }}
            >
              STUDIO LAERT COSTA
            </span>
            <span
              className="font-body text-black/55 uppercase mt-1"
              style={{ fontSize: '10px', letterSpacing: '0.22em' }}
            >
              ARQUITETURA INTEGRADA
            </span>
          </div>
          <span
            className="font-body text-black/55"
            style={{ fontSize: '12px' }}
          >
            &copy; {new Date().getFullYear()} Laert Costa Studio. Todos os direitos reservados.
          </span>
        </AnimatedSection>

      </Container>
    </footer>
  )
}
