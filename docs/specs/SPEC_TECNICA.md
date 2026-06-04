# Spec Tecnica — Laert Costa Studio

**Versao:** 1.0
**Data:** Junho 2025

---

## 1. Visao Geral da Arquitetura

```
Browser → Vercel CDN → Next.js (App Router)
                             ↓
                      Supabase (PostgreSQL + Storage)
```

O site e majoritariamente estatico (SSG) com revalidacao periodica. O painel admin usa Server Actions e Route Handlers para operacoes de escrita. O Supabase Storage serve as imagens via CDN proprio.

---

## 2. Setup Inicial

### 2.1 Criar projeto Next.js

```bash
npx create-next-app@latest laert-costa-studio \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"
```

### 2.2 Dependencias

```bash
# Producao
npm install @supabase/ssr @supabase/supabase-js animejs

# Tipos
npm install -D @types/animejs
```

### 2.3 tsconfig.json

Garantir:
```json
{
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  }
}
```

### 2.4 tailwind.config.ts

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#FFFFFF',
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'sans-serif'],
        body: ['var(--font-inter-tight)', 'sans-serif'],
      },
    },
  },
}
export default config
```

### 2.5 globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-black: #000000;
  --color-white: #FFFFFF;
  --font-display: var(--font-bebas), sans-serif;
  --font-body: var(--font-inter-tight), sans-serif;
  --spacing-section: 120px;
  --spacing-section-mobile: 64px;
  --max-width: 1440px;
  --grid-gutter: 24px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  background: var(--color-black);
  color: var(--color-white);
  font-family: var(--font-body);
  cursor: none; /* cursor customizado ativo */
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 3. Fontes (app/layout.tsx)

```tsx
import { Bebas_Neue, Inter_Tight } from 'next/font/google'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
})
```

---

## 4. Supabase

### 4.1 lib/supabase/client.ts

```ts
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 4.2 lib/supabase/server.ts

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

### 4.3 lib/supabase/types.ts

Gerar via CLI apos criar as migrations:
```bash
npx supabase gen types typescript --project-id SEU_PROJECT_ID > lib/supabase/types.ts
```

Tipos manuais ate a geracao:
```ts
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          slug: string
          category: 'residential' | 'commercial' | 'render'
          description: string | null
          year: number | null
          status: 'published' | 'hidden'
          cover_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
      project_images: {
        Row: {
          id: string
          project_id: string
          url: string
          order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['project_images']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['project_images']['Insert']>
      }
    }
  }
}
```

---

## 5. Spec por Secao da Home

### 5.1 HeroSection

**Comportamento:**
- Fundo preto, fullscreen (100dvh).
- "LAERT COSTA STUDIO" em Bebas Neue, tamanho fluido: clamp(80px, 12vw, 180px).
- Cada palavra entra mascarada: container com `overflow: hidden`, texto com `translateY: '110%'` inicial.
- Anime.js timeline: delay de 400ms, cada palavra com stagger de 80ms, duracao 600ms por palavra, easing 'easeOutExpo'.
- Apos o titulo entrar (delay ~1800ms): subtitulo aparece com TypewriterText.
- Subtitulo texto: "Arquitetura. BIM. Visualizacao 3D."
- Spotlight: `mousemove` no container, `radial-gradient` de 600px centrado no cursor, cor `rgba(255,255,255,0.04)`.

**Componentes usados:** TypewriterText, useCursor (para spotlight separado do cursor global).

**Nao usar:** video de fundo, imagens, particles.

### 5.2 ServicesSection

**Comportamento:**
- Tres blocos em grid 3 colunas (desktop), 1 coluna (mobile).
- Cada bloco: numero de ordem em tipografia massiva (01, 02, 03), titulo do servico, descricao curta (2 linhas).
- Linha horizontal separando os blocos no desktop.
- Entrada via AnimatedSection (clip-path + blur + translateY) com stagger entre os tres blocos.
- CounterNumber em destaque: ex. "+10 anos de experiencia", "+50 projetos entregues".

**Conteudo:**
```
01 — Projetos Residenciais
Casas e condominiios do anteprojeto ao executivo.

02 — Projetos Comerciais
Lojas, escritorios e edificios com aprovacao garantida.

03 — Render & Visualizacao 3D
Material visual premium para lancamentos imobiliarios.
```

### 5.3 ProjectsSection

**Comportamento:**
- Titulo da secao: "PROJETOS" em Bebas Neue massivo.
- Filtros: "TODOS", "RESIDENCIAL", "COMERCIAL", "RENDER". Texto simples, sem bordas excessivas.
- Grid: 3 colunas desktop, 2 tablet, 1 mobile. Sem altura fixa — proporcao 4:3 nos cards.
- ProjectCard: imagem de capa via next/image, overlay com titulo e categoria. Tilt 3D no mousemove.
- Ao clicar: navegar para `/projetos/[slug]`.
- Filtros animados via Anime.js (saida + entrada com stagger).
- Dados carregados do Supabase (somente `status = 'published'`).

**Estado vazio:** texto "Projetos em breve." centralizado se nao ha projetos publicados.

### 5.4 AboutSection

**Comportamento:**
- Fundo permanece preto.
- Texto principal sobre o Laert em duas colunas (desktop): coluna da esquerda com headline grande, coluna da direita com paragrafos.
- Headline: "ARQUITETO. PROFESSOR. ESPECIALISTA BIM." com parallax sutil no scroll.
- Credenciais em lista: MBA BIM, MBA Gestao de Projetos, Arquitetura e Urbanismo, Professor de Pos-Graduacao.
- Foto profissional a direita (placeholder preto enquanto a foto nao for fornecida).
- Sem foto de stock. Se nao houver foto real, usar bloco preto com texto "LAERT COSTA" em branco.

### 5.5 ContactSection

**Comportamento:**
- Inversao de paleta: fundo BRANCO, texto PRETO. Unica secao com fundo branco.
- Titulo: "VAMOS TRABALHAR JUNTOS?" em Bebas Neue, cor preta.
- Subtitulo: texto curto.
- Botao: "FALAR NO WHATSAPP" — link `https://wa.me/5567993248550`.
- Botao: fundo preto, texto branco, sem bordas arredondadas (border-radius: 0).
- Hover do botao: inversao (fundo branco, borda preta, texto preto).

---

## 6. Spec da Pagina de Detalhe do Projeto

**Rota:** `/projetos/[slug]`
**Rendering:** SSG com `generateStaticParams` + `revalidate = 3600`

**Layout:**
- Header fixo (mesmo da home, mas pode ser mais simples).
- Hero da pagina: titulo do projeto em tipografia massiva, categoria e ano embaixo.
- Galeria: grid de imagens, primeira imagem maior (hero da galeria), demais em grid 2 colunas.
- Ao clicar em qualquer imagem: lightbox fullscreen com navegacao por teclado (setas) e swipe mobile.
- Descricao: paragrafo abaixo da galeria.
- Botao "VOLTAR" que usa `router.back()` ou link para `/#projetos`.

**Metadata dinamica:**
```ts
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug)
  return {
    title: `${project.title} — Laert Costa Studio`,
    description: project.description?.slice(0, 160),
    openGraph: {
      images: [project.cover_image_url],
    },
  }
}
```

---

## 7. Spec do Painel Admin

### 7.1 Auth Guard (app/admin/layout.tsx)

Server Component. Verifica sessao. Se nao autenticado, redireciona para `/admin/login`.

### 7.2 Login (app/admin/login/page.tsx)

- Form simples: email + senha + botao entrar.
- Usa `supabase.auth.signInWithPassword`.
- Em erro: mensagem "Email ou senha incorretos."
- Em sucesso: redirect para `/admin`.
- Estilo: fundo branco, formulario centralizado, sem animacoes.

### 7.3 Dashboard Admin (app/admin/page.tsx)

- Header simples com logo e botao "Sair".
- Listagem de todos os projetos (publicados e ocultos).
- Para cada projeto: capa (thumbnail pequena), titulo, categoria, status (badge PUBLICADO / OCULTO), botoes Editar e Excluir.
- Botao "NOVO PROJETO" em destaque.
- Confirmacao antes de excluir (window.confirm ou modal simples).

### 7.4 Formulario de Projeto (components/admin/ProjectForm.tsx)

Campos:
- `title` (texto, obrigatorio)
- `slug` (texto, gerado automaticamente a partir do titulo, editavel)
- `category` (select: Residencial / Comercial / Render)
- `year` (numero, opcional)
- `description` (textarea, opcional)
- `status` (toggle: Publicado / Oculto)
- `images` (upload multiplo via ImageUploader)

Geracao do slug:
```ts
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
```

### 7.5 Upload de Imagens (components/admin/ImageUploader.tsx)

- Input file aceita multiplas imagens (JPEG, PNG, WebP).
- Preview das imagens selecionadas antes do upload.
- Upload para Supabase Storage em `project-images/{project_id}/{filename}`.
- Barra de progresso por imagem.
- Primeira imagem da lista e automaticamente a capa (`cover_image_url`).
- Drag para reordenar imagens (HTML5 Drag and Drop nativo, sem biblioteca).
- Botao de remover imagem individual.

### 7.6 Revalidacao de Cache

Apos salvar ou excluir um projeto no admin, chamar:
```ts
// Route Handler: app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache'

export async function POST() {
  revalidatePath('/')
  revalidatePath('/projetos/[slug]', 'page')
  return Response.json({ revalidated: true })
}
```

---

## 8. Header

**Comportamento:**
- Posicao: `fixed`, `top: 0`, z-index alto.
- Estado inicial (topo da pagina): background transparente.
- Estado apos scroll (>50px): background preto com `border-bottom: 1px solid rgba(255,255,255,0.1)`. Transicao CSS 400ms.
- Logo: "LC STUDIO" em Bebas Neue, link para `/#hero`.
- Navegacao: links SERVICOS, PROJETOS, SOBRE, CONTATO. Cada link com scroll suave para a secao correspondente.
- Link hover: `::after` com `content: ''`, `height: 1px`, `background: white`, `scaleX: 0 → 1`, `transition: transform 350ms ease`.
- Mobile: hamburger menu. Ao abrir: menu fullscreen preto com links em tipografia grande.

---

## 9. SEO e Metadata

### app/layout.tsx metadata
```ts
export const metadata: Metadata = {
  title: 'Laert Costa Studio — Arquitetura e Visualizacao 3D',
  description: 'Projetos residenciais, comerciais e renders 3D premium. Parceiro tecnico para escritorios e incorporadoras em Campo Grande, MS.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://laertcostastudio.com.br',
    siteName: 'Laert Costa Studio',
  },
}
```

### app/sitemap.ts
```ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublishedProjects()
  const projectUrls = projects.map(p => ({
    url: `https://laertcostastudio.com.br/projetos/${p.slug}`,
    lastModified: p.updated_at,
  }))
  return [
    { url: 'https://laertcostastudio.com.br', lastModified: new Date() },
    ...projectUrls,
  ]
}
```

### app/robots.ts
```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/admin' },
    ],
    sitemap: 'https://laertcostastudio.com.br/sitemap.xml',
  }
}
```

---

## 10. Variaveis de Ambiente

```bash
# .env.local.example

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key

# Site
NEXT_PUBLIC_WHATSAPP_NUMBER=5567993248550
NEXT_PUBLIC_SITE_URL=https://laertcostastudio.com.br
```

---

## 11. Dados de Seed para Desenvolvimento

Criar em `supabase/seed.sql` com 6 projetos de exemplo (2 por categoria) com status 'published' para desenvolver e testar os filtros e a galeria sem precisar do admin desde o inicio.
