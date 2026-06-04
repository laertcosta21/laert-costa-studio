import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { createStaticClient } from '@/lib/supabase/static'
import ProjectGallery from '@/components/projects/ProjectGallery'
import { BackButton } from '@/components/projects/BackButton'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const supabase = createStaticClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('slug')
    .eq('status', 'published')
  return projects?.map((p) => ({ slug: p.slug })) ?? []
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: project } = await supabase
    .from('projects')
    .select('title, description, cover_image_url')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  if (!project) return {}
  return {
    title: `${project.title} — Laert Costa Studio`,
    description: project.description?.slice(0, 160) ?? undefined,
    openGraph: { images: project.cover_image_url ? [project.cover_image_url] : [] },
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  residential: 'Residencial',
  commercial: 'Comercial',
  render: 'Render 3D',
}

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5567993248550'

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!project) notFound()

  const { data: images } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', project.id)
    .order('order', { ascending: true })

  const imageList = images ?? []
  const categoryLabel = CATEGORY_LABELS[project.category] ?? project.category
  const breadcrumb = project.year
    ? `${categoryLabel.toUpperCase()} — ${project.year}`
    : categoryLabel.toUpperCase()

  const waMessage = encodeURIComponent(
    `Olá, Laert! Vi o projeto "${project.title}" e gostaria de conversar.`
  )

  return (
    <div className="bg-black min-h-screen">
      {/* padding-top via inline style — garante compensação do header fixo (80px) */}
      <div
        className="max-w-[1440px] mx-auto w-full px-6 md:px-10 lg:px-12 2xl:px-24"
        style={{ paddingTop: '112px' }}
      >

        {/* Botão voltar — Client Component com router.back() */}
        <div style={{ paddingBottom: '32px' }}>
          <BackButton />
        </div>

        {/* ─── BLOCO 1 — Cabeçalho ─── */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start py-12 md:py-16"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}
        >
          {/* Coluna esquerda — breadcrumb + título */}
          <div>
            <p
              className="font-body uppercase tracking-widest mb-5"
              style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}
            >
              {breadcrumb}
            </p>
            <h1
              className="font-display text-white leading-none"
              style={{ fontSize: 'clamp(32px, 6vw, 100px)', lineHeight: 0.95 }}
            >
              {project.title}
            </h1>
          </div>

          {/* Coluna direita — metadados (alinhados ao fundo do título) */}
          <div className="self-end">
            <div className="grid grid-cols-3 gap-4 md:gap-12">
              <div>
                <span
                  className="block font-body uppercase tracking-widest mb-2 text-[10px] md:text-xs"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  CATEGORIA
                </span>
                <span className="font-body text-white" style={{ fontSize: '16px' }}>
                  {categoryLabel}
                </span>
              </div>
              <div>
                <span
                  className="block font-body uppercase tracking-widest mb-2 text-[10px] md:text-xs"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  ANO
                </span>
                <span className="font-body text-white" style={{ fontSize: '16px' }}>
                  {project.year ?? '—'}
                </span>
              </div>
              <div>
                <span
                  className="block font-body uppercase tracking-widest mb-2 text-[10px] md:text-xs"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  STUDIO
                </span>
                <span className="font-body text-white" style={{ fontSize: '16px' }}>
                  Laert Costa
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── BLOCO 2 — Galeria ─── */}
        <div className="py-16">
          {imageList.length > 0 ? (
            <ProjectGallery images={imageList} projectTitle={project.title} />
          ) : (
            /* Estado sem imagens — placeholder limpo */
            <div
              className="flex flex-col items-center justify-center"
              style={{
                minHeight: '400px',
                border: '1px solid rgba(255,255,255,0.08)',
                gap: '12px',
              }}
            >
              <span
                className="font-display text-center leading-none"
                style={{ fontSize: '32px', color: 'rgba(255,255,255,0.15)' }}
              >
                IMAGENS EM BREVE
              </span>
              <span
                className="font-body uppercase tracking-widest"
                style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}
              >
                Imagens sendo adicionadas ao portfólio
              </span>
            </div>
          )}
        </div>

        {/* ─── BLOCO 3 — Descrição ─── */}
        {project.description && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 py-16"
            style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}
          >
            <div>
              <span
                className="block font-body uppercase tracking-widest mb-6"
                style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}
              >
                — SOBRE O PROJETO
              </span>
              <p
                className="font-body"
                style={{
                  fontSize: '18px',
                  lineHeight: 1.8,
                  color: 'rgba(255,255,255,0.75)',
                  maxWidth: '560px',
                }}
              >
                {project.description}
              </p>
            </div>
            {/* Coluna direita vazia — respiro visual */}
            <div />
          </div>
        )}

        {/* ─── BLOCO 4 — CTA final ─── */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center py-20"
          style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}
        >
          <div>
            <span
              className="block font-body uppercase tracking-widest mb-4"
              style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}
            >
              GOSTOU DO TRABALHO?
            </span>
            <p
              className="font-body"
              style={{
                fontSize: '20px',
                color: 'rgba(255,255,255,0.75)',
                lineHeight: 1.7,
                maxWidth: '44ch',
              }}
            >
              Entre em contato para discutir seu projeto e receber uma proposta personalizada.
            </p>
          </div>

          <div className="md:text-right">
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="project-cta-btn flex w-full justify-center items-center font-body uppercase tracking-widest md:inline-flex md:w-auto"
              style={{
                fontSize: '13px',
                padding: '16px 32px',
                border: '1px solid rgba(255,255,255,0.25)',
                background: 'transparent',
                color: 'rgba(255,255,255,0.9)',
                borderRadius: 0,
                textDecoration: 'none',
              }}
            >
              FALAR NO WHATSAPP →
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
