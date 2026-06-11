'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  /**
   * Delay em ms antes de iniciar a transição de entrada.
   * Usado para stagger manual entre irmãos.
   */
  delay?: number
  /**
   * Deslocamento vertical inicial em px (padrão 40).
   */
  y?: number
  style?: CSSProperties
}

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  y = 40,
  style,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ctx: { revert?: () => void } = {}

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: delay / 1000,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }

    init()
    return () => ctx.revert?.()
  }, [delay, y])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
