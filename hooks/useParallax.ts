import { useEffect, type RefObject } from 'react'

export function useParallax(ref: RefObject<HTMLElement | null>, factor = 0.1) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respeita prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let rafId: number
    let currentY = 0
    let targetY = 0

    const handleScroll = () => {
      const rect = el.getBoundingClientRect()
      const viewportCenter = window.innerHeight / 2
      targetY = (viewportCenter - rect.top - rect.height / 2) * factor
    }

    const animate = () => {
      // lerp: suaviza o valor em direção ao alvo (fator 0.08)
      currentY += (targetY - currentY) * 0.08
      el.style.transform = `translateY(${currentY.toFixed(3)}px)`
      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    rafId = requestAnimationFrame(animate)
    handleScroll() // inicializa targetY imediatamente

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [ref, factor])
}
