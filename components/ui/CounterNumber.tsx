'use client'

import { useEffect, useRef } from 'react'

interface CounterNumberProps {
  target: number
  prefix?: string
  suffix?: string
  className?: string
}

export default function CounterNumber({
  target,
  prefix = '',
  suffix = '',
  className,
}: CounterNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        onEnter: () => {
          if (startedRef.current) return
          startedRef.current = true
          const obj = { value: 0 }
          gsap.to(obj, {
            value: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              if (el) el.textContent = `${prefix}${Math.round(obj.value)}${suffix}`
            },
          })
        },
      })
    }

    init()
  }, [target, prefix, suffix])

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  )
}
