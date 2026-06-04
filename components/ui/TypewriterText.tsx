'use client'

import { useEffect, useState } from 'react'

interface TypewriterTextProps {
  text: string
  delay?: number
  speed?: number
  className?: string
}

export default function TypewriterText({
  text,
  delay = 0,
  speed = 35,
  className,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    // Referências mutáveis para que o cleanup sempre acesse os IDs atuais
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let intervalId: ReturnType<typeof setInterval> | null = null

    timeoutId = setTimeout(() => {
      let i = 0
      intervalId = setInterval(() => {
        setDisplayed(text.slice(0, i + 1))
        i++
        if (i === text.length) {
          clearInterval(intervalId!)
          intervalId = null
        }
      }, speed)
    }, delay)

    // Cleanup: cancela tanto o timeout inicial quanto o interval em andamento
    return () => {
      if (timeoutId !== null) clearTimeout(timeoutId)
      if (intervalId !== null) clearInterval(intervalId)
    }
  }, [text, delay, speed])

  return (
    <span aria-label={text} className={className}>
      {displayed}
    </span>
  )
}
