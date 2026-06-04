'use client'

import { useEffect } from 'react'

/**
 * Inicializa o Lenis smooth scroll no cliente.
 *
 * - Desativado automaticamente se prefers-reduced-motion estiver ativo.
 * - Integrado ao requestAnimationFrame para sincronismo perfeito com o browser paint.
 * - Cleanup completo no unmount: destroy da instância + cancelAnimationFrame.
 * - Adiciona classe `lenis` no <html> quando ativo (usada pelo CSS do Lenis).
 */
export function useSmoothScroll(): void {
  useEffect(() => {
    // Respeitar preferência do usuário — não inicializar se reduzir movimento
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReduced) return

    let rafId: number
    let lenis: import('lenis').default | null = null
    // Flag de unmount: evita que a promise do import() inicialize
    // Lenis após o componente ter sido desmontado (race condition).
    let destroyed = false

    // Importação dinâmica — o bundle do Lenis (~12kb gzip) só é carregado
    // quando o componente é montado no cliente, não bloqueando o SSR.
    import('lenis').then(({ default: Lenis }) => {
      // Se o cleanup já rodou enquanto a promise estava em voo, aborta.
      if (destroyed) return

      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
      })

      // Adiciona classe no <html> para o CSS do Lenis funcionar corretamente
      document.documentElement.classList.add('lenis')

      function raf(time: number): void {
        lenis?.raf(time)
        rafId = requestAnimationFrame(raf)
      }

      rafId = requestAnimationFrame(raf)
    })

    return () => {
      // Marca como destruído antes de tudo — bloqueia a promise se ainda estiver em voo
      destroyed = true
      // Cleanup: cancela o loop de animação primeiro, depois destrói a instância
      cancelAnimationFrame(rafId)
      if (lenis) {
        lenis.destroy()
        lenis = null
      }
      document.documentElement.classList.remove('lenis')
    }
  }, [])
}
