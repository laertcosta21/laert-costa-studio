'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AdminHeaderProps {
  userEmail: string
}

export default function AdminHeader({ userEmail }: AdminHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="border-b border-black/10 px-6 py-4 flex items-center justify-between bg-white">
      <Link
        href="/admin"
        className="font-display text-black text-xl tracking-widest hover:opacity-60 transition-opacity"
      >
        LC STUDIO <span className="text-black/30 text-sm font-body normal-case tracking-normal">admin</span>
      </Link>

      <div className="flex items-center gap-6">
        <span className="text-xs text-black/30 hidden sm:block">{userEmail}</span>
        <button
          onClick={handleLogout}
          className="text-xs font-medium tracking-widest uppercase text-black/50 hover:text-black transition-colors"
        >
          SAIR
        </button>
      </div>
    </header>
  )
}
