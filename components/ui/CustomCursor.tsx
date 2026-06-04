'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (navigator.maxTouchPoints > 0) return
    setVisible(true)

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let ringX = 0
    let ringY = 0
    let mouseX = 0
    let mouseY = 0
    let rafId: number

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      requestAnimationFrame(() => {
        if (dot) dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`
      })
    }

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      if (ring) ring.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`
      rafId = requestAnimationFrame(animateRing)
    }

    const addClickableListeners = () => {
      document.querySelectorAll<HTMLElement>('a, button').forEach((el) => {
        el.addEventListener('mouseenter', onEnterClickable)
        el.addEventListener('mouseleave', onLeaveClickable)
      })
    }

    const onEnterClickable = () => {
      dot.classList.add('cursor-dot--hover')
      ring.classList.add('cursor-ring--hover')
    }

    const onLeaveClickable = () => {
      dot.classList.remove('cursor-dot--hover')
      ring.classList.remove('cursor-ring--hover')
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    rafId = requestAnimationFrame(animateRing)
    addClickableListeners()

    const observer = new MutationObserver(addClickableListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [])

  if (!visible) return null

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
