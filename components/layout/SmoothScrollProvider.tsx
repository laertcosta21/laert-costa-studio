'use client'

import { type ReactNode } from 'react'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'

interface SmoothScrollProviderProps {
  children: ReactNode
}

/**
 * Provider transparente que inicializa o Lenis smooth scroll.
 * Deve ser colocado no layout raiz, envolvendo todo o conteúdo.
 * Não adiciona nenhum elemento DOM extra — apenas renderiza children.
 */
export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps): ReactNode {
  useSmoothScroll()
  return children
}
