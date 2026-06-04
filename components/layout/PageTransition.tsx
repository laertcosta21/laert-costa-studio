'use client'

import { useEffect, useRef, type ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

/**
 * Aplica um fade-in sutil (opacity 0→1, 400ms ease-out) na montagem da página.
 * Usa apenas CSS e uma única classe — zero dependências externas.
 * Respeita prefers-reduced-motion via globals.css.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return

    // Remove a classe após a animação para liberar will-change/compositing
    const handleEnd = () => el.classList.remove('page-transition-wrapper')
    el.addEventListener('animationend', handleEnd, { once: true })

    return () => el.removeEventListener('animationend', handleEnd)
  }, [])

  return (
    <div ref={wrapperRef} className="page-transition-wrapper">
      {children}
    </div>
  )
}
