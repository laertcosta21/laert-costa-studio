'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="font-body text-white hover:text-white/60 transition-colors ml-6"
      style={{ fontSize: '13px', letterSpacing: '0.1em' }}
    >
      SAIR
    </button>
  )
}
