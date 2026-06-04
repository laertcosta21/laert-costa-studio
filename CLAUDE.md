# CLAUDE.md — Laert Costa Studio

Este arquivo e lido automaticamente pelo Claude Code antes de qualquer acao.
Siga todas as instrucoes abaixo sem excecao em toda sessao de trabalho.

---

## Identidade do Projeto

**Nome:** Laert Costa Studio
**Tipo:** Site institucional e portfolio com painel admin
**Proprietario:** Laert Costa, Arquiteto e Urbanista
**Objetivo:** Posicionar o studio como parceiro tecnico premium para escritorios e incorporadoras, exibindo projetos residenciais, comerciais e renders 3D.

---

## Stack Obrigatoria

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript estrito |
| Estilizacao | Tailwind CSS com tema customizado |
| Banco de dados | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Animacoes | Anime.js + CSS transitions |
| Deploy | Vercel |
| Fontes | next/font (Google Fonts) |
| Imagens | next/image obrigatorio em todas as imagens |

**Nunca usar:** Redux, class components, moment.js, jQuery, UI libraries externas (MUI, Chakra, shadcn) no frontend publico.

---

## Identidade Visual — Regras Absolutas

- Paleta: **somente preto (#000000) e branco (#FFFFFF)**. Nenhuma outra cor.
- Tipografia: **sem serifa, bold, geometrica**. Fontes aprovadas: Bebas Neue (headlines), Inter Tight (corpo). Nenhuma fonte serifada.
- Estilo: brutalismo refinado. Espaco negativo generoso. Tipografia massiva. Zero ornamentacao desnecessaria.
- Cursor: customizado em toda a pagina publica.
- **Nunca usar:** gradientes coloridos, sombras coloridas, bordas arredondadas excessivas, icones decorativos sem funcao.

### Variaveis CSS obrigatorias (globals.css)

```css
:root {
  --color-black: #000000;
  --color-white: #FFFFFF;
  --font-display: 'Bebas Neue', sans-serif;
  --font-body: 'Inter Tight', sans-serif;
  --spacing-section: 120px; /* desktop */
  --spacing-section-mobile: 64px;
  --max-width: 1440px;
  --grid-gutter: 24px;
}
```

---

## Estrutura de Pastas

```
laert-costa-studio/
├── CLAUDE.md                        ← este arquivo
├── .env.local.example               ← variaveis de ambiente documentadas
├── app/
│   ├── layout.tsx                   ← root layout, fontes, metadata global
│   ├── page.tsx                     ← home one-page (todas as secoes)
│   ├── projetos/
│   │   └── [slug]/
│   │       └── page.tsx             ← detalhe do projeto (SSG)
│   ├── admin/
│   │   ├── layout.tsx               ← layout admin com auth guard
│   │   ├── page.tsx                 ← dashboard admin
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── projetos/
│   │       ├── page.tsx             ← listagem
│   │       ├── novo/
│   │       │   └── page.tsx
│   │       └── [id]/
│   │           └── page.tsx         ← editar projeto
│   └── api/
│       └── revalidate/
│           └── route.ts             ← revalidacao de cache apos admin salvar
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── ScrollProgress.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── AboutSection.tsx
│   │   └── ContactSection.tsx
│   ├── projects/
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectFilters.tsx
│   │   └── ProjectGallery.tsx
│   ├── ui/
│   │   ├── CustomCursor.tsx
│   │   ├── AnimatedSection.tsx
│   │   ├── TypewriterText.tsx
│   │   └── CounterNumber.tsx
│   └── admin/
│       ├── ProjectForm.tsx
│       ├── ImageUploader.tsx
│       └── ProjectList.tsx
├── hooks/
│   ├── useScrollAnimation.ts
│   ├── useParallax.ts
│   └── useCursor.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts               ← cliente browser
│   │   ├── server.ts               ← cliente server (SSR)
│   │   └── types.ts                ← tipos gerados do schema
│   └── utils.ts
├── styles/
│   └── globals.css
├── public/
│   └── fonts/                      ← se necessario fallback local
├── docs/
│   ├── specs/                      ← specs detalhadas por feature
│   └── tasks/                      ← tasks de implementacao
└── supabase/
    └── migrations/                 ← SQL de migrations ordenados
```

---

## Convencoes de Codigo

### TypeScript
- `strict: true` em tsconfig.json
- Nunca usar `any`. Usar `unknown` e fazer type guard quando necessario.
- Todos os componentes com tipagem explicita de props via `interface`.
- Tipos do Supabase gerados via CLI e importados de `lib/supabase/types.ts`.

### Componentes
- Functional components com arrow functions.
- Um componente por arquivo.
- Nomes em PascalCase para componentes, camelCase para hooks e utils.
- Props interface prefixada com nome do componente: `interface ProjectCardProps`.

### CSS / Tailwind
- Usar variaveis CSS definidas em globals.css via `var(--...)` para cores e espacamentos.
- Tailwind para layout, espacamento e tipografia.
- Animacoes complexas via classes CSS customizadas em globals.css, nao inline.
- Nunca usar `style={{}}` exceto para valores dinamicos de animacao (ex: transform no mousemove).

### Imports
- Path alias `@/` mapeado para a raiz do projeto (configurado em tsconfig.json).
- Ordem de imports: React → Next → libs externas → componentes internos → hooks → utils → tipos.

---

## Supabase — Regras

### Schema de banco (migrations em supabase/migrations/)

```sql
-- 001_create_projects.sql
CREATE TYPE project_category AS ENUM ('residential', 'commercial', 'render');
CREATE TYPE project_status AS ENUM ('published', 'hidden');

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category project_category NOT NULL,
  description TEXT,
  year INTEGER,
  status project_status NOT NULL DEFAULT 'hidden',
  cover_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- Leitura publica somente para projetos publicados
CREATE POLICY "public_read_published" ON projects
  FOR SELECT USING (status = 'published');

-- Admin ve tudo (autenticado)
CREATE POLICY "admin_all" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "public_read_images" ON project_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_id AND p.status = 'published'
    )
  );

CREATE POLICY "admin_all_images" ON project_images
  FOR ALL USING (auth.role() = 'authenticated');
```

### Storage
- Bucket: `project-images`, publico para leitura.
- Path das imagens: `{project_id}/{filename}`.
- Formato aceito: JPEG, PNG, WebP. Max 10MB por imagem.

### Clientes Supabase
- `lib/supabase/client.ts` — `createBrowserClient` para uso em Client Components.
- `lib/supabase/server.ts` — `createServerClient` com cookies para Server Components e Route Handlers.
- Nunca importar o cliente browser em Server Components.

---

## Animacoes — Contrato por Componente

Cada componente e responsavel por sua propria animacao. Sem animacoes cruzadas.

| Componente | Animacao | Biblioteca |
|---|---|---|
| CustomCursor | dot: mousemove instantaneo via rAF; ring: lerp continuo + transition CSS | Vanilla JS |
| HeroSection | word mask translateY 110%→0, stagger 80ms, total 2400ms; spotlight radial gradient no mousemove | Anime.js |
| AnimatedSection | reveal: clip-path + blur + translateY via IntersectionObserver | CSS + IntersectionObserver |
| useParallax | translateY proporcional ao scroll via rAF | Vanilla JS |
| ProjectCard | 3D tilt mousemove rotateX/Y max 8deg; overlay opacity+translateY no hover | CSS transition |
| ProjectGallery | abertura: clip-path+translateY Anime.js; fechamento: ease-in 300ms | Anime.js |
| TypewriterText | setInterval 35ms por caractere | Vanilla JS |
| CounterNumber | objeto numerico Anime.js via IntersectionObserver | Anime.js |
| Header | scroll state classList toggle 400ms; links ::after scaleX 0→1 350ms | CSS transition |
| ScrollProgress | width CSS no scroll event, transition 50ms | CSS |
| ProjectFilters | saida: opacity+scale 250ms; entrada: stagger 40ms 400ms | Anime.js |

### Regra de acessibilidade
Toda animacao deve respeitar `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Performance — Regras Obrigatorias

- `next/image` em TODA imagem. Nunca `<img>` direto.
- `next/font` para todas as fontes. Nunca `@import` de Google Fonts em CSS.
- Componentes com animacoes pesadas: `'use client'` + `dynamic import` com `{ ssr: false }`.
- ProjectGallery e CustomCursor: sempre com dynamic import.
- Metadata dinamica em cada pagina de projeto via `generateMetadata`.
- `generateStaticParams` em `/projetos/[slug]` para SSG.
- `revalidate = 3600` nas paginas que buscam do Supabase.

---

## SEO

- Title padrao: `{titulo do projeto} — Laert Costa Studio`
- Description padrao: extraida dos primeiros 160 caracteres da descricao do projeto.
- Open Graph configurado no root layout e sobrescrito por pagina.
- `robots.txt` gerado via `app/robots.ts`.
- `sitemap.xml` gerado via `app/sitemap.ts` com todos os projetos publicados.
- Rota `/admin` e todas as sub-rotas: `noindex, nofollow`.

---

## Autenticacao Admin

- Supabase Auth com email e senha.
- Sem cadastro publico. Apenas o Laert tem acesso.
- `app/admin/layout.tsx` verifica sessao via Server Component. Redireciona para `/admin/login` se nao autenticado.
- Apos login, redirecionar para `/admin`.
- Logout: botao no header do admin, chama `supabase.auth.signOut()`.

---

## Variaveis de Ambiente

Documentar em `.env.local.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=5567993248550
NEXT_PUBLIC_SITE_URL=https://laertcostastudio.com.br
```

---

## Ordem de Implementacao Recomendada

Seguir exatamente esta ordem para evitar bloqueios:

1. Setup do projeto (Next.js, dependencias, tsconfig, Tailwind, fontes)
2. Variaveis de ambiente e clientes Supabase
3. Migrations do banco de dados
4. Componentes UI base (CustomCursor, AnimatedSection, ScrollProgress)
5. Header e layout raiz
6. HeroSection
7. ServicesSection
8. ProjectsSection (com dados mockados primeiro, depois conectar Supabase)
9. AboutSection
10. ContactSection
11. Pagina de detalhe do projeto `/projetos/[slug]`
12. Painel admin: login, listagem, formulario de criacao e edicao
13. Upload de imagens no admin
14. Conectar ProjectsSection ao Supabase real
15. SEO: metadata, sitemap, robots
16. Testes de performance (Lighthouse) e ajustes finais

---

## O Que Nunca Fazer

- Nunca usar `<img>` diretamente. Sempre `next/image`.
- Nunca importar fontes via CSS `@import`. Sempre `next/font`.
- Nunca usar `any` em TypeScript.
- Nunca colocar `SUPABASE_SERVICE_ROLE_KEY` em variaveis `NEXT_PUBLIC_`.
- Nunca fazer chamadas ao Supabase no lado cliente para operacoes de admin. Usar Route Handlers.
- Nunca usar cores fora da paleta preto e branco.
- Nunca usar fontes serifadas.
- Nunca criar animacoes em componentes que nao sao os responsaveis por elas (ver tabela acima).
- Nunca commitar `.env.local`.
