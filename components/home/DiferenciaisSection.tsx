import AnimatedSection from '@/components/ui/AnimatedSection'
import CounterNumber from '@/components/ui/CounterNumber'

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

export default function DiferenciaisSection() {
  return (
    <section
      id="diferenciais"
      className="bg-white border-t border-black/10 py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)]"
    >
      <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-12">

        {/* Label / eyebrow */}
        <AnimatedSection>
          <p
            className="font-body uppercase"
            style={{
              fontSize: '12px',
              letterSpacing: '0.18em',
              color: 'rgba(0,0,0,0.40)',
              marginBottom: '24px',
            }}
          >
            + POR QUE ESCOLHER O STUDIO
          </p>
        </AnimatedSection>

        {/* Título principal */}
        <AnimatedSection delay={60}>
          <h2
            className="font-display text-black leading-tight"
            style={{
              fontSize: 'clamp(36px, 5vw, 88px)',
              maxWidth: '700px',
              marginBottom: '64px',
              lineHeight: 1.0,
            }}
          >
            TÉCNICA, PRECISÃO E ENTREGA SEM INTERMEDIÁRIOS.
          </h2>
        </AnimatedSection>

        {/* Três colunas de diferenciais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DIFERENCIAIS.map((item, index) => (
            <AnimatedSection key={item.title} delay={index * 80}>
              <div style={{ borderTop: '2px solid #000', paddingTop: '32px' }}>
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
        <AnimatedSection delay={160}>
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            style={{
              borderTop: '1px solid rgba(0,0,0,0.20)',
              paddingTop: '32px',
              marginTop: '80px',
            }}
          >
            {CONTADORES.map((counter) => (
              <div key={counter.label}>
                <CounterNumber
                  target={counter.target}
                  prefix={counter.prefix}
                  suffix={counter.suffix}
                  className="font-display text-black leading-none block [font-size:clamp(40px,5vw,72px)]"
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
        </AnimatedSection>

      </div>
    </section>
  )
}
