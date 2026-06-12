'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'

const NAV_LINKS = [
  { href: '/#servicos', label: 'SERVIÇOS' },
  { href: '/#projetos', label: 'PROJETOS' },
  { href: '/#sobre', label: 'SOBRE' },
  { href: '/#contato', label: 'CONTATO' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false)
    }
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''

    const main = document.querySelector('main')
    if (main) {
      if (menuOpen) {
        main.setAttribute('inert', '')
      } else {
        main.removeAttribute('inert')
      }
    }

    return () => {
      document.body.style.overflow = ''
      main?.removeAttribute('inert')
    }
  }, [menuOpen])

  const handleNavClick = () => setMenuOpen(false)

  return (
    <>
      <header
        ref={headerRef}
        className={`header fixed top-0 left-0 right-0 z-50 h-16 md:h-20 transition-all duration-400 ${
          scrolled || menuOpen
            ? 'bg-[var(--color-black)] border-b border-white/10'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <Container className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/#hero"
            className="flex flex-col items-start justify-center leading-tight text-white hover:opacity-70 transition-opacity"
            onClick={(e) => {
              handleNavClick()
              if (typeof window !== 'undefined' && window.location.pathname === '/') {
                e.preventDefault()
                document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          >
            <span className="font-display text-[13px] tracking-[0.15em] leading-none whitespace-nowrap">
              LAERT COSTA STUDIO
            </span>
            <span className="font-body text-white/40 text-[9px] tracking-[0.2em] uppercase leading-none mt-[3px] whitespace-nowrap">
              ARQUITETURA INTEGRADA
            </span>
          </Link>

          {/* Navegação desktop — gap-12 + Inter Tight 500 tracking-widest */}
          <nav className="hidden lg:flex items-center gap-12" aria-label="Navegação principal">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="nav-link">
                {label}
              </Link>
            ))}
          </nav>

          {/* Botão hamburger mobile */}
          <button
            className="flex lg:hidden flex-col justify-center items-center w-11 h-11 gap-[6px] flex-shrink-0"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
          >
            <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </Container>
      </header>

      {/* Menu fullscreen mobile */}
      <div
        className={`fixed inset-0 z-40 bg-[var(--color-black)] flex flex-col justify-center items-center gap-8 transition-all duration-500 lg:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col items-center gap-6" aria-label="Menu mobile">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-display text-5xl text-white tracking-widest hover:opacity-60 transition-opacity"
              onClick={handleNavClick}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
