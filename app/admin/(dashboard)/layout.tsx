import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AdminLogoutButton from '@/components/admin/AdminLogoutButton'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black h-16 px-8 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/admin"
            className="font-display text-white hover:opacity-70 transition-opacity"
            style={{ fontSize: '18px' }}
          >
            LC STUDIO
          </Link>
          <span
            className="font-body text-white/40 ml-3"
            style={{ fontSize: '11px', letterSpacing: '0.15em' }}
          >
            admin
          </span>
        </div>

        <div className="flex items-center">
          <span
            className="font-body text-white/50"
            style={{ fontSize: '13px' }}
          >
            {user.email}
          </span>
          <AdminLogoutButton />
        </div>
      </header>

      {/* Conteúdo deslocado do header fixo */}
      <main className="pt-16 min-h-screen bg-gray-50">{children}</main>
    </div>
  )
}
