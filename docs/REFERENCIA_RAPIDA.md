# Referencia Rapida — Laert Costa Studio

Use este arquivo como consulta rapida durante a implementacao.
Para detalhes completos: CLAUDE.md, docs/specs/, docs/tasks/TASKS.md

---

## Cores

| Nome | Hex | Uso |
|---|---|---|
| Preto | #000000 | Fundo de todas as secoes exceto Contato |
| Branco | #FFFFFF | Texto, elementos de destaque |
| Excecao | N/A | Somente secao Contato tem fundo branco |

**Regra absoluta:** zero outras cores no site publico.

---

## Tipografia

| Uso | Fonte | Peso | Tamanho referencia |
|---|---|---|---|
| Hero title | Bebas Neue | 400 (a fonte so tem este peso) | clamp(80px, 12vw, 180px) |
| Secao titles | Bebas Neue | 400 | clamp(48px, 8vw, 120px) |
| Labels | Bebas Neue | 400 | 16-24px |
| Corpo | Inter Tight | 400/500 | 16-18px |
| Credenciais | Inter Tight | 600 | 14-16px |

---

## Secoes da Home

| ID HTML | Componente | Fundo |
|---|---|---|
| `#hero` | HeroSection | Preto |
| `#servicos` | ServicesSection | Preto |
| `#projetos` | ProjectsSection | Preto |
| `#sobre` | AboutSection | Preto |
| `#contato` | ContactSection | **Branco** |

---

## Responsividade

| Breakpoint | Tailwind | Uso |
|---|---|---|
| < 768px | default | Mobile |
| 768px+ | `md:` | Tablet |
| 1024px+ | `lg:` | Desktop |
| 1440px+ | `xl:` | Desktop grande |

---

## Rotas

| Rota | Tipo | Acesso |
|---|---|---|
| `/` | SSG + revalidate | Publico |
| `/projetos/[slug]` | SSG + revalidate | Publico |
| `/admin` | Server Component | Autenticado |
| `/admin/login` | Client Component | Publico |
| `/admin/projetos/novo` | Server Component | Autenticado |
| `/admin/projetos/[id]` | Server Component | Autenticado |
| `/api/revalidate` | Route Handler | Interno |
| `/sitemap.xml` | app/sitemap.ts | Publico |
| `/robots.txt` | app/robots.ts | Publico |

---

## Categorias de Projeto

| Valor no banco | Label exibido | Filtro |
|---|---|---|
| `residential` | Residencial | RESIDENCIAL |
| `commercial` | Comercial | COMERCIAL |
| `render` | Render 3D | RENDER |

---

## Componentes e Responsabilidade de Animacao

```
CustomCursor      → cursor dot (rAF) + ring (lerp)
HeroSection       → word mask (Anime.js) + spotlight (mousemove)
AnimatedSection   → reveal secoes (IntersectionObserver + CSS)
useParallax       → parallax headlines (scroll + rAF)
ProjectCard       → tilt 3D (mousemove) + overlay (CSS hover)
ProjectGallery    → lightbox abertura/fechamento (Anime.js)
TypewriterText    → digitacao (setInterval)
CounterNumber     → contador numerico (Anime.js + IntersectionObserver)
Header            → scroll state (classList) + link hover (CSS ::after)
ScrollProgress    → barra de progresso (CSS width + scroll)
ProjectFilters    → filtro de projetos (Anime.js saida/entrada)
```

---

## Supabase Storage

- Bucket: `project-images` (publico)
- Path: `{project_id}/{nome-do-arquivo}`
- URL publica: `https://SEU_PROJECT.supabase.co/storage/v1/object/public/project-images/{path}`
- Formatos aceitos: JPEG, PNG, WebP
- Tamanho maximo: 10MB por imagem

---

## WhatsApp

- Numero: 5567993248550
- Link: `https://wa.me/5567993248550`
- Variavel: `process.env.NEXT_PUBLIC_WHATSAPP_NUMBER`

---

## Checklist Antes de Cada Commit

- TypeScript sem erros (`npx tsc --noEmit`)
- ESLint sem erros (`npm run lint`)
- Nenhum `console.log` esquecido
- Nenhuma `<img>` direta (sempre `next/image`)
- Nenhuma cor fora de preto e branco no site publico
- Variaveis de ambiente nao expostas incorretamente
