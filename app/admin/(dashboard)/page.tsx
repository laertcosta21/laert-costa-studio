import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProjectList from '@/components/admin/ProjectList'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('position', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  const total = projects?.length ?? 0

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '48px 32px' }}>

      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div>
          <h1
            className="font-display"
            style={{ fontSize: '48px', lineHeight: 1, color: '#000' }}
          >
            PROJETOS
          </h1>
          <p
            className="font-body"
            style={{ fontSize: '13px', color: 'rgba(0,0,0,0.4)', marginTop: '4px', letterSpacing: '0.05em' }}
          >
            {total} projeto{total !== 1 ? 's' : ''}
          </p>
        </div>

        <Link
          href="/admin/projetos/novo"
          className="font-body"
          style={{
            background: '#000',
            color: '#fff',
            fontSize: '13px',
            letterSpacing: '0.1em',
            padding: '12px 24px',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          + NOVO PROJETO
        </Link>
      </div>

      {/* Lista */}
      {total === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p className="font-body" style={{ fontSize: '15px', color: 'rgba(0,0,0,0.4)', marginBottom: '24px' }}>
            Nenhum projeto cadastrado ainda.
          </p>
          <a
            href="/admin/projetos/novo"
            className="font-body"
            style={{
              fontSize: '12px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              border: '1px solid rgba(0,0,0,0.2)',
              padding: '12px 24px',
              textDecoration: 'none',
              color: '#000',
            }}
          >
            + CRIAR PRIMEIRO PROJETO
          </a>
        </div>
      ) : (
        <ProjectList projects={projects ?? []} />
      )}
    </div>
  )
}
