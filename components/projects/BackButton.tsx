'use client'

import { useRouter } from 'next/navigation'

export function BackButton() {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/#projetos')
    }
  }

  return (
    <button
      onClick={handleBack}
      type="button"
      className="flex items-center gap-2 font-body uppercase tracking-widest transition-colors duration-200"
      style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
    >
      ← VOLTAR AOS PROJETOS
    </button>
  )
}
