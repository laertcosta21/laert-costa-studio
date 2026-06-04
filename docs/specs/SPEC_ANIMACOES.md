# Spec de Animacoes — Laert Costa Studio

**Versao:** 1.0

Este documento e a referencia definitiva para todas as animacoes do site.
Cada animacao esta atribuida a exatamente um componente. Nenhuma animacao
deve ser implementada fora do componente responsavel.

---

## Principios

- Animacoes existem para guiar a atencao, nao para entreter.
- Toda animacao respeita `prefers-reduced-motion`.
- Performance primeiro: preferir CSS transitions e transforms que rodam na GPU.
- Anime.js apenas quando o CSS nao e suficiente (sequencias, stagger, objetos numericos).
- Nenhum `setTimeout` para controle de animacao. Usar callbacks do Anime.js ou eventos CSS.

---

## 1. CustomCursor

**Arquivo:** `components/ui/CustomCursor.tsx`
**Tipo:** Client Component

**Elementos:**
- `cursor-dot`: circulo solido de 8px, branco, posicao absoluta.
- `cursor-ring`: circulo vazio de 32px, borda 1px branca, posicao absoluta.

**Dot (instantaneo):**
```ts
// Segue o mouse sem delay
window.addEventListener('mousemove', (e) => {
  requestAnimationFrame(() => {
    dot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
  })
})
```

**Ring (lerp continuo):**
```ts
let ringX = 0, ringY = 0
let mouseX = 0, mouseY = 0

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX
  mouseY = e.clientY
})

function animateRing() {
  ringX += (mouseX - ringX) * 0.12 // fator de lerp
  ringY += (mouseY - ringY) * 0.12
  ring.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`
  requestAnimationFrame(animateRing)
}
animateRing()
```

**Estados especiais:**
- Sobre elementos clicaveis (`a`, `button`): dot expande para 24px, ring some. CSS transition 200ms.
- Sobre imagem de projeto: ring exibe texto "VER" centralizado em 10px.

**CSS base:**
```css
.cursor-dot, .cursor-ring {
  position: fixed;
  top: 0; left: 0;
  pointer-events: none;
  z-index: 9999;
  will-change: transform;
}
.cursor-dot { width: 8px; height: 8px; background: white; border-radius: 50%; }
.cursor-ring { width: 32px; height: 32px; border: 1px solid white; border-radius: 50%; transition: opacity 200ms; }
```

---

## 2. HeroSection

**Arquivo:** `components/home/HeroSection.tsx`
**Tipo:** Client Component

**Timeline Anime.js (total ~2400ms):**

```ts
import anime from 'animejs'

// Estrutura HTML necessaria:
// <div class="word-mask"><span class="word">LAERT</span></div>
// <div class="word-mask"><span class="word">COSTA</span></div>
// <div class="word-mask"><span class="word">STUDIO</span></div>
// Cada .word-mask tem overflow: hidden

anime.timeline({ easing: 'easeOutExpo' })
  .add({
    targets: '.word',
    translateY: ['110%', '0%'],
    duration: 600,
    delay: anime.stagger(80),
  }, 400) // começa em 400ms
  .add({
    targets: '.hero-subtitle',
    opacity: [0, 1],
    duration: 400,
  }, '-=200') // sobrepoe 200ms com a animacao anterior
```

**Spotlight (mousemove):**
```ts
heroRef.current.addEventListener('mousemove', (e: MouseEvent) => {
  const rect = heroRef.current.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  heroRef.current.style.background =
    `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.04), transparent 50%), #000`
})
```

**TypewriterText** (subtitulo entra apos a timeline da hero):
- Texto: "Arquitetura. BIM. Visualizacao 3D."
- Inicia com 1800ms de delay apos mount (aguarda a timeline da hero terminar).

---

## 3. AnimatedSection + useScrollAnimation

**Arquivos:**
- `components/ui/AnimatedSection.tsx`
- `hooks/useScrollAnimation.ts`

**Uso:**
```tsx
<AnimatedSection>
  <div>Conteudo que vai animar</div>
</AnimatedSection>
```

**Hook:**
```ts
export function useScrollAnimation(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.unobserve(el) // anima apenas uma vez
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
}
```

**CSS:**
```css
.animated-section {
  clip-path: inset(0 0 100% 0);
  filter: blur(8px);
  transform: translateY(24px);
  opacity: 0;
  transition:
    clip-path 700ms cubic-bezier(0.16, 1, 0.3, 1),
    filter 700ms ease,
    transform 700ms ease,
    opacity 700ms ease;
}

.animated-section.is-visible {
  clip-path: inset(0 0 0% 0);
  filter: blur(0);
  transform: translateY(0);
  opacity: 1;
}
```

---

## 4. useParallax

**Arquivo:** `hooks/useParallax.ts`

**Uso:** aplicado em headlines das secoes para movimento sutil no scroll.

```ts
export function useParallax(ref: RefObject<HTMLElement>, factor = 0.1) {
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!ref.current) return
          const scrollY = window.scrollY
          const elementTop = ref.current.offsetTop
          const relativeScroll = scrollY - elementTop
          ref.current.style.transform = `translateY(${relativeScroll * factor}px)`
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [ref, factor])
}
```

**Fator recomendado:** 0.05 a 0.15. Valores maiores sao mais dramaticos.

---

## 5. ProjectCard

**Arquivo:** `components/projects/ProjectCard.tsx`
**Tipo:** Client Component

**Tilt 3D:**
```ts
const handleMouseMove = (e: MouseEvent) => {
  const rect = card.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5  // -0.5 a 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5

  card.style.transform = `
    perspective(1000px)
    rotateY(${x * 8}deg)
    rotateX(${-y * 8}deg)
    scale(1.02)
  `
}

const handleMouseLeave = () => {
  card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)'
  card.style.transition = 'transform 500ms ease'
}
```

**Overlay hover (CSS):**
```css
.project-card .overlay {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
  padding: 24px;
  transform: translateY(100%);
  opacity: 0;
  transition: transform 350ms ease, opacity 350ms ease;
}

.project-card:hover .overlay {
  transform: translateY(0);
  opacity: 1;
}
```

---

## 6. ProjectGallery (Lightbox)

**Arquivo:** `components/projects/ProjectGallery.tsx`
**Tipo:** Client Component

**Abertura:**
```ts
import anime from 'animejs'

function openGallery(index: number) {
  setActiveIndex(index)
  setIsOpen(true)

  // Apos o elemento ser montado (useLayoutEffect ou requestAnimationFrame)
  requestAnimationFrame(() => {
    anime({
      targets: '.gallery-overlay',
      clipPath: ['inset(100% 0 0 0)', 'inset(0% 0 0 0)'],
      translateY: [40, 0],
      opacity: [0, 1],
      duration: 500,
      easing: 'easeOutExpo',
    })
  })
}
```

**Fechamento:**
```ts
function closeGallery() {
  anime({
    targets: '.gallery-overlay',
    opacity: [1, 0],
    translateY: [0, 20],
    duration: 300,
    easing: 'easeInQuad',
    complete: () => setIsOpen(false),
  })
}
```

**Navegacao:** teclas `ArrowLeft`, `ArrowRight`, `Escape`. Touch: swipe horizontal.

---

## 7. TypewriterText

**Arquivo:** `components/ui/TypewriterText.tsx`
**Tipo:** Client Component

```ts
interface TypewriterTextProps {
  text: string
  delay?: number // delay antes de comecar (ms)
  speed?: number // ms por caractere
}

export function TypewriterText({ text, delay = 0, speed = 35 }: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    let i = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1))
        i++
        if (i === text.length) clearInterval(interval)
      }, speed)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, delay, speed])

  return <span aria-label={text}>{displayed}</span>
}
```

---

## 8. CounterNumber

**Arquivo:** `components/ui/CounterNumber.tsx`
**Tipo:** Client Component

```ts
import anime from 'animejs'

interface CounterNumberProps {
  target: number
  prefix?: string
  suffix?: string
}

export function CounterNumber({ target, prefix = '', suffix = '' }: CounterNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [started, setStarted] = useState(false)

  // IntersectionObserver ativa quando visivel
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started || !ref.current) return
    const obj = { value: 0 }
    anime({
      targets: obj,
      value: target,
      duration: 2000,
      easing: 'easeOutExpo',
      round: 1,
      update: () => {
        if (ref.current) ref.current.textContent = `${prefix}${obj.value}${suffix}`
      },
    })
  }, [started, target, prefix, suffix])

  return <span ref={ref}>{prefix}0{suffix}</span>
}
```

---

## 9. Header

**Arquivo:** `components/layout/Header.tsx`
**Tipo:** Client Component (para detectar scroll)

**Scroll state:**
```ts
useEffect(() => {
  const handleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50)
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
```

**CSS:**
```css
.header {
  background: transparent;
  border-bottom: 1px solid transparent;
  transition: background 400ms ease, border-color 400ms ease;
}

.header.scrolled {
  background: #000;
  border-bottom-color: rgba(255,255,255,0.1);
}

.nav-link {
  position: relative;
  text-decoration: none;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 0;
  width: 100%; height: 1px;
  background: white;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 350ms ease;
}

.nav-link:hover::after { transform: scaleX(1); }
```

---

## 10. ScrollProgress

**Arquivo:** `components/layout/ScrollProgress.tsx`
**Tipo:** Client Component

```ts
useEffect(() => {
  const updateProgress = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = (scrollTop / docHeight) * 100
    if (barRef.current) barRef.current.style.width = `${progress}%`
  }
  window.addEventListener('scroll', updateProgress, { passive: true })
  return () => window.removeEventListener('scroll', updateProgress)
}, [])
```

**CSS:**
```css
.scroll-progress {
  position: fixed;
  top: 0; left: 0;
  height: 2px;
  background: white;
  width: 0%;
  z-index: 10000;
  transition: width 50ms linear;
}
```

---

## 11. ProjectFilters

**Arquivo:** `components/projects/ProjectFilters.tsx`
**Tipo:** Client Component

**Ao trocar filtro:**
```ts
import anime from 'animejs'

async function handleFilterChange(newFilter: string) {
  // 1. Saida dos cards atuais
  await anime({
    targets: '.project-card',
    opacity: [1, 0],
    scale: [1, 0.95],
    duration: 250,
    easing: 'easeInQuad',
  }).finished

  // 2. Atualiza o estado do filtro (React re-renderiza os cards)
  setActiveFilter(newFilter)

  // 3. Aguarda o DOM atualizar
  await new Promise(resolve => requestAnimationFrame(resolve))

  // 4. Entrada dos novos cards com stagger
  anime({
    targets: '.project-card',
    opacity: [0, 1],
    scale: [0.95, 1],
    duration: 400,
    delay: anime.stagger(40),
    easing: 'easeOutExpo',
  })
}
```
