# Tasks de Implementacao — Laert Costa Studio

**Versao:** 1.0
**Ordem:** Implementar sequencialmente. Nao pular tasks. Cada task tem criterios de aceite.

---

## FASE 1 — Setup e Fundacao

### TASK-001 — Inicializacao do Projeto

**Descricao:** Criar o projeto Next.js com todas as dependencias e configuracoes base.

**Passos:**
1. `npx create-next-app@latest laert-costa-studio --typescript --tailwind --eslint --app --import-alias="@/*"`
2. Instalar dependencias: `npm install @supabase/ssr @supabase/supabase-js animejs`
3. Instalar tipos: `npm install -D @types/animejs`
4. Configurar `tsconfig.json` com `strict: true` e path alias `@/*`
5. Criar `.env.local` com base no `.env.local.example` (ver SPEC_TECNICA.md secao 10)
6. Criar `.env.local.example` no repositorio (sem valores reais)
7. Adicionar `.env.local` ao `.gitignore`

**Criterios de aceite:**
- `npm run dev` funciona sem erros
- TypeScript sem erros de compilacao (`npm run build` passa)
- ESLint sem erros

---

### TASK-002 — Tailwind e Variaveis CSS

**Descricao:** Configurar o tema visual do site.

**Passos:**
1. Atualizar `tailwind.config.ts` conforme SPEC_TECNICA.md secao 2.4
2. Criar `styles/globals.css` com variaveis CSS, reset e prefers-reduced-motion (ver SPEC_TECNICA.md secao 2.5)
3. Importar `globals.css` no `app/layout.tsx`
4. Configurar fontes Bebas Neue e Inter Tight via `next/font/google` (ver SPEC_TECNICA.md secao 3)
5. Aplicar variaveis de fonte no `<body>` via className

**Criterios de aceite:**
- Fundo da pagina e preto (#000000)
- Texto padrao e branco (#FFFFFF)
- Fontes carregando sem layout shift (verificar no DevTools > Performance)
- Variaveis CSS acessiveis em qualquer componente

---

### TASK-003 — Supabase: Clientes e Tipos

**Descricao:** Configurar a camada de acesso ao banco de dados.

**Passos:**
1. Criar `lib/supabase/client.ts` (browser client) — ver SPEC_TECNICA.md secao 4.1
2. Criar `lib/supabase/server.ts` (server client) — ver SPEC_TECNICA.md secao 4.2
3. Criar `lib/supabase/types.ts` com tipos manuais — ver SPEC_TECNICA.md secao 4.3
4. Criar `lib/utils.ts` com funcao `generateSlug` — ver SPEC_TECNICA.md secao 7.4

**Criterios de aceite:**
- Importar os clientes em qualquer componente sem erros de tipo
- TypeScript valida as queries contra os tipos do banco

---

### TASK-004 — Migrations do Banco de Dados

**Descricao:** Criar as tabelas, tipos e politicas RLS no Supabase.

**Passos:**
1. Criar `supabase/migrations/001_create_projects.sql` com o schema completo (ver CLAUDE.md secao Supabase)
2. Criar `supabase/migrations/002_create_storage.sql` para criar o bucket `project-images`
3. Criar `supabase/seed.sql` com 6 projetos de exemplo (2 por categoria, todos publicados)
4. Executar as migrations no projeto Supabase (via Dashboard ou CLI)
5. Executar o seed para ter dados de desenvolvimento

**SQL do bucket (002_create_storage.sql):**
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true);

CREATE POLICY "public_read_images_storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "admin_upload_images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-images' AND auth.role() = 'authenticated'
  );

CREATE POLICY "admin_delete_images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'project-images' AND auth.role() = 'authenticated'
  );
```

**Criterios de aceite:**
- Tabelas `projects` e `project_images` existem no Supabase
- RLS ativo e funcionando (testar: usuario anonimo ve somente publicados)
- Bucket `project-images` existe e e publico para leitura
- Seed executado: 6 projetos visiveis na listagem do Supabase

---

## FASE 2 — Layout e Componentes Base

### TASK-005 — Root Layout e Metadata Global

**Descricao:** Configurar o layout raiz com fontes, metadata e componentes globais.

**Arquivo:** `app/layout.tsx`

**Conteudo:**
- Fontes via next/font aplicadas no `<html>`
- Metadata global (ver SPEC_TECNICA.md secao 9)
- Importar `CustomCursor` e `ScrollProgress` como dynamic imports com `{ ssr: false }`
- Estrutura: `<html>` → `<body>` → `<CustomCursor />` → `<ScrollProgress />` → `{children}`

**Criterios de aceite:**
- Metadata aparece corretamente no `<head>`
- Nenhum erro de hydration no console
- Fontes carregam com `font-display: swap`

---

### TASK-006 — CustomCursor

**Descricao:** Implementar o cursor customizado que substitui o cursor padrao do sistema.

**Arquivo:** `components/ui/CustomCursor.tsx`

**Referencia completa:** SPEC_ANIMACOES.md secao 1

**Pontos de atencao:**
- Montar somente no cliente (`useEffect` com cleanup)
- Desativar em dispositivos touch (verificar `navigator.maxTouchPoints > 0`)
- `will-change: transform` no CSS para performance de GPU
- `pointer-events: none` para nao interferir com cliques

**Criterios de aceite:**
- Cursor padrao do sistema invisivel na pagina
- Dot segue o mouse sem delay perceptivel
- Ring segue com lerp suave
- Em links e botoes: dot expande, ring desaparece
- Em mobile/touch: componente nao renderiza

---

### TASK-007 — ScrollProgress

**Descricao:** Barra de progresso de scroll no topo da pagina.

**Arquivo:** `components/layout/ScrollProgress.tsx`

**Referencia completa:** SPEC_ANIMACOES.md secao 10

**Criterios de aceite:**
- Barra branca de 2px no topo, z-index acima de tudo
- Largura vai de 0% a 100% conforme o scroll
- Transicao suave de 50ms

---

### TASK-008 — Header

**Descricao:** Header fixo com navegacao e comportamento de scroll.

**Arquivo:** `components/layout/Header.tsx`

**Referencia:** SPEC_ANIMACOES.md secao 9

**Conteudo:**
- Logo: "LC STUDIO" em Bebas Neue, link para `/#hero`
- Links: SERVICOS (`/#servicos`), PROJETOS (`/#projetos`), SOBRE (`/#sobre`), CONTATO (`/#contato`)
- Scroll state: transparente → preto com borda sutil apos 50px
- Mobile: hamburger que abre menu fullscreen
- No menu mobile: links em tipografia grande (Bebas Neue 48px+)

**Criterios de aceite:**
- Header fixo no topo em todas as secoes
- Transicao de transparente para preto funciona
- Hover nos links: underline animado (scaleX)
- Mobile: hamburger abre e fecha o menu corretamente
- Links scrollam suavemente para a secao correta

---

### TASK-009 — AnimatedSection e useScrollAnimation

**Descricao:** Wrapper de animacao de entrada para todas as secoes.

**Arquivos:**
- `components/ui/AnimatedSection.tsx`
- `hooks/useScrollAnimation.ts`

**Referencia completa:** SPEC_ANIMACOES.md secao 3

**Criterios de aceite:**
- Elementos fora da viewport estao invisiveis (clip-path + opacity 0)
- Ao entrar na viewport (15% visivel): animacao de reveal ocorre
- Animacao acontece apenas uma vez (IntersectionObserver desconectado apos trigger)
- Com `prefers-reduced-motion`: elemento aparece imediatamente sem animacao

---

### TASK-010 — TypewriterText e CounterNumber

**Descricao:** Componentes de animacao de texto.

**Arquivos:**
- `components/ui/TypewriterText.tsx`
- `components/ui/CounterNumber.tsx`

**Referencia completa:** SPEC_ANIMACOES.md secoes 7 e 8

**Criterios de aceite (TypewriterText):**
- Texto aparece caractere por caractere a 35ms
- Props `delay` e `speed` funcionam
- Texto completo acessivel via `aria-label`

**Criterios de aceite (CounterNumber):**
- Contador inicia somente quando o elemento entra na viewport
- Animacao de 0 ate o valor alvo em 2000ms com easing
- Suporte a `prefix` e `suffix`

---

## FASE 3 — Home: Secoes Publicas

### TASK-011 — HeroSection

**Descricao:** Primeira dobra do site. A mais importante.

**Arquivo:** `components/home/HeroSection.tsx`

**Referencia completa:** SPEC_ANIMACOES.md secao 2 e SPEC_TECNICA.md secao 5.1

**Conteudo textual:**
- Titulo: "LAERT COSTA STUDIO" (pode ser em tres linhas: LAERT / COSTA / STUDIO)
- Subtitulo (TypewriterText): "Arquitetura. BIM. Visualizacao 3D."
- Sem CTA na hero — o scroll guia o usuario

**Pontos de atencao:**
- `id="hero"` no elemento raiz para o link do header
- Altura: `100dvh` (dynamic viewport height para mobile)
- Tipografia: `clamp(80px, 12vw, 180px)` para o titulo
- Word mask: cada palavra em `<div style={{overflow:'hidden'}}>` com `<span>` interno
- Spotlight: radial gradient dinamico no mousemove (ver spec)
- Importar Anime.js dinamicamente: `const anime = (await import('animejs')).default`

**Criterios de aceite:**
- Titulo entra com word mask animation em ~2400ms total
- Subtitulo aparece com TypewriterText apos o titulo
- Spotlight segue o cursor sem lag
- Em mobile: spotlight desativado (sem mousemove em touch)
- Layout responsivo: tipografia menor em mobile

---

### TASK-012 — ServicesSection

**Descricao:** Secao de servicos com tres blocos e numeros.

**Arquivo:** `components/home/ServicesSection.tsx`

**Referencia:** SPEC_TECNICA.md secao 5.2

**Conteudo (ver SPEC_TECNICA.md para textos completos):**
- 01 — Projetos Residenciais
- 02 — Projetos Comerciais
- 03 — Render & Visualizacao 3D
- Numeros de destaque: "+10 anos de experiencia", "+50 projetos entregues"

**Pontos de atencao:**
- `id="servicos"` no elemento raiz
- Envolver em `<AnimatedSection>` com stagger entre os tres blocos
- Numeros com `<CounterNumber>`
- Linha horizontal separando blocos no desktop

**Criterios de aceite:**
- Tres blocos em grid 3 colunas (desktop), 1 coluna (mobile)
- Cada bloco entra com animacao de reveal via AnimatedSection
- Contadores animam ao entrar na viewport
- Layout responsivo correto

---

### TASK-013 — ProjectsSection (com dados mockados)

**Descricao:** Secao de projetos com filtros e grid de cards.

**Arquivos:**
- `components/home/ProjectsSection.tsx`
- `components/projects/ProjectCard.tsx`
- `components/projects/ProjectFilters.tsx`

**Referencia:** SPEC_TECNICA.md secao 5.3 e SPEC_ANIMACOES.md secoes 5 e 11

**Nesta task:** usar dados mockados (array local) para desenvolver sem depender do Supabase.

**Dados mockados (6 projetos, 2 por categoria):**
```ts
const MOCK_PROJECTS = [
  { id: '1', title: 'Residencia Jardins', slug: 'residencia-jardins', category: 'residential', cover_image_url: null, year: 2024 },
  // ... mais 5
]
```

**Pontos de atencao:**
- `id="projetos"` no elemento raiz
- ProjectCard com efeito de tilt 3D (SPEC_ANIMACOES.md secao 5)
- Filtros com animacao Anime.js ao trocar (SPEC_ANIMACOES.md secao 11)
- next/image com `fill` e `object-fit: cover` nos cards
- Placeholder de cor cinza escuro quando `cover_image_url` e null
- Link de cada card para `/projetos/[slug]`

**Criterios de aceite:**
- Grid responsivo: 3 col desktop, 2 tablet, 1 mobile
- Filtros funcionam: cards corretos aparecem por categoria
- Animacao de saida e entrada dos cards ao filtrar
- Tilt 3D funciona no hover
- Overlay com titulo e categoria sobe no hover

---

### TASK-014 — AboutSection

**Descricao:** Secao sobre o profissional.

**Arquivo:** `components/home/AboutSection.tsx`

**Referencia:** SPEC_TECNICA.md secao 5.4

**Conteudo textual (baseado no curriculo):**
```
Headline: ARQUITETO. PROFESSOR. ESPECIALISTA BIM.

Paragrafo 1:
Arquiteto e Urbanista com mais de 10 anos de atuacao em projetos 
residenciais, comerciais e incorporacao imobiliaria em Campo Grande, MS.

Paragrafo 2:
Pos-graduado em Plataforma BIM e Gestao de Projetos. Atua como professor 
de pos-graduacao e como Analista de Arquitetura na Engepar Engenharia, 
com expertise em NBR 12721, compatibilizacao BIM e projetos para 
aprovacao (Minha Casa Minha Vida e SBPE).

Credenciais:
- MBA Plataforma BIM — IPOG MS
- MBA Gestao de Projetos — Faculdade Fasul
- Arquitetura e Urbanismo — Anhanguera Uniderp
- Professor de Pos-Graduacao
```

**Pontos de atencao:**
- `id="sobre"` no elemento raiz
- `useParallax` na headline (fator 0.08)
- Foto: bloco preto com texto "LAERT COSTA" ate foto real ser fornecida
- Layout duas colunas no desktop, uma no mobile

**Criterios de aceite:**
- Parallax na headline funciona suavemente
- Layout responsivo
- Credenciais legíveis e bem hierarquizadas

---

### TASK-015 — ContactSection

**Descricao:** Ultima secao com CTA de WhatsApp.

**Arquivo:** `components/home/ContactSection.tsx`

**Referencia:** SPEC_TECNICA.md secao 5.5

**Conteudo:**
- Titulo: "VAMOS TRABALHAR JUNTOS?"
- Subtitulo: "Projetos residenciais, comerciais e renders 3D para lancamentos imobiliarios."
- Botao: "FALAR NO WHATSAPP" → `https://wa.me/5567993248550`

**Pontos de atencao:**
- `id="contato"` no elemento raiz
- Fundo BRANCO, texto PRETO (unica secao invertida)
- Botao: border-radius 0, fundo preto, texto branco
- Hover do botao: inversao de cores com transition 200ms
- Link abre em nova aba (`target="_blank" rel="noopener noreferrer"`)

**Criterios de aceite:**
- Inversao de paleta (branco) visivel e correta
- Botao WhatsApp funciona e abre em nova aba
- Hover do botao animado

---

### TASK-016 — Home Page Assembly

**Descricao:** Montar a home com todas as secoes na ordem correta.

**Arquivo:** `app/page.tsx`

**Ordem das secoes:**
1. `<HeroSection />`
2. `<ServicesSection />`
3. `<ProjectsSection />`
4. `<AboutSection />`
5. `<ContactSection />`

**Criterios de aceite:**
- Home completa sem erros
- Scroll suave entre secoes
- Links do header levam para as secoes corretas
- Layout responsivo em mobile, tablet e desktop
- Nenhum erro de console

---

## FASE 4 — Pagina de Detalhe do Projeto

### TASK-017 — Pagina de Detalhe

**Descricao:** Pagina de detalhe de cada projeto com galeria.

**Arquivos:**
- `app/projetos/[slug]/page.tsx`
- `components/projects/ProjectGallery.tsx`

**Referencia:** SPEC_TECNICA.md secao 6 e SPEC_ANIMACOES.md secao 6

**Nesta task:** ainda com dados mockados. Conectar ao Supabase na TASK-022.

**Comportamento da galeria:**
- Grade de imagens: primeira imagem ocupa largura total, demais em grid 2 colunas
- Ao clicar em qualquer imagem: lightbox fullscreen
- Lightbox: imagem centralizada, navegacao com setas, fechar com ESC ou clique fora
- Setas em mobile: swipe horizontal
- Animacao de abertura e fechamento (SPEC_ANIMACOES.md secao 6)

**Criterios de aceite:**
- Rota `/projetos/[slug]` funciona com dados mockados
- Galeria exibe imagens corretamente
- Lightbox abre com animacao
- Navegacao por teclado funciona (setas e ESC)
- Botao voltar funciona
- Metadata da pagina definida (titulo e descricao)

---

## FASE 5 — Painel Admin

### TASK-018 — Login Admin

**Descricao:** Pagina de autenticacao do painel.

**Arquivo:** `app/admin/login/page.tsx`

**Referencia:** SPEC_TECNICA.md secao 7.2

**Pontos de atencao:**
- Server Action para o submit (nao Client Component)
- Redirecionar para `/admin` apos login bem-sucedido
- Mensagem de erro clara em caso de falha

**Criterios de aceite:**
- Login com email e senha corretos redireciona para `/admin`
- Login com credenciais erradas exibe mensagem de erro
- Form sem JavaScript funciona (progressive enhancement)

---

### TASK-019 — Auth Guard Layout Admin

**Descricao:** Layout que protege todas as rotas `/admin/*`.

**Arquivo:** `app/admin/layout.tsx`

**Referencia:** SPEC_TECNICA.md secao 7.1

**Pontos de atencao:**
- Server Component
- Verificar sessao via `supabase.auth.getSession()`
- Se nao autenticado: `redirect('/admin/login')`
- Se autenticado: renderizar `{children}`
- Header do admin com logo e botao "Sair"

**Criterios de aceite:**
- Acessar `/admin` sem login redireciona para `/admin/login`
- Acessar `/admin` com login renderiza o conteudo
- Botao "Sair" faz logout e redireciona para `/admin/login`

---

### TASK-020 — Dashboard e Listagem Admin

**Descricao:** Pagina principal do admin com lista de projetos.

**Arquivos:**
- `app/admin/page.tsx`
- `components/admin/ProjectList.tsx`

**Referencia:** SPEC_TECNICA.md secao 7.3

**Conteudo da listagem:**
- Para cada projeto: thumbnail (50x50px), titulo, categoria, status (badge), botoes Editar e Excluir
- Botao "NOVO PROJETO" que leva para `/admin/projetos/novo`
- Status "PUBLICADO" em verde, "OCULTO" em cinza (excecao de cor somente no admin)
- Confirmar antes de excluir
- Ao excluir: remover do banco E as imagens do Storage

**Criterios de aceite:**
- Lista todos os projetos (publicados e ocultos)
- Badge de status correto
- Botao editar leva para `/admin/projetos/[id]`
- Excluir remove do banco com confirmacao
- "NOVO PROJETO" leva para o formulario

---

### TASK-021 — Formulario de Projeto (Criar e Editar)

**Descricao:** Formulario completo para criar e editar projetos.

**Arquivos:**
- `app/admin/projetos/novo/page.tsx`
- `app/admin/projetos/[id]/page.tsx`
- `components/admin/ProjectForm.tsx`
- `components/admin/ImageUploader.tsx`

**Referencia:** SPEC_TECNICA.md secoes 7.4 e 7.5

**Campos do formulario:** titulo, slug (auto-gerado, editavel), categoria (select), ano, descricao (textarea), status (toggle publicado/oculto), imagens (upload multiplo).

**ImageUploader:**
- Input file para multiplas imagens
- Preview antes do upload
- Upload ao salvar o formulario (nao em tempo real)
- Primeira imagem = capa automaticamente
- Reordenacao via drag and drop nativo
- Remover imagem individual com botao X

**Server Actions:**
- `createProject(formData)`: insere no banco, faz upload das imagens, chama revalidate
- `updateProject(id, formData)`: atualiza banco, gerencia imagens (novas + removidas), chama revalidate
- `deleteProject(id)`: remove banco + storage + chama revalidate

**Criterios de aceite:**
- Criar novo projeto funciona end-to-end
- Editar projeto existente pre-preenche o formulario
- Upload de imagens vai para o Supabase Storage
- Slug gerado automaticamente do titulo, editavel manualmente
- Validacao: titulo obrigatorio, categoria obrigatoria
- Apos salvar: redireciona para `/admin` com lista atualizada

---

### TASK-022 — Conectar Frontend ao Supabase Real

**Descricao:** Substituir todos os dados mockados por queries reais ao Supabase.

**Arquivos a atualizar:**
- `components/home/ProjectsSection.tsx`
- `app/projetos/[slug]/page.tsx`

**Queries necessarias:**

```ts
// Buscar projetos publicados (home)
const { data: projects } = await supabase
  .from('projects')
  .select('id, title, slug, category, cover_image_url, year')
  .eq('status', 'published')
  .order('created_at', { ascending: false })

// Buscar projeto por slug (detalhe)
const { data: project } = await supabase
  .from('projects')
  .select('*, project_images(*)')
  .eq('slug', params.slug)
  .eq('status', 'published')
  .single()

// SSG: gerar params estaticos
export async function generateStaticParams() {
  const { data: projects } = await supabase
    .from('projects')
    .select('slug')
    .eq('status', 'published')
  return projects?.map(p => ({ slug: p.slug })) ?? []
}
```

**Criterios de aceite:**
- Home exibe projetos reais do banco
- Pagina de detalhe exibe projeto correto com imagens reais
- SSG funciona: `npm run build` gera paginas estaticas
- Revalidacao: apos salvar no admin, home atualiza em ate 3600s

---

### TASK-023 — Route Handler de Revalidacao

**Descricao:** Endpoint para revalidar o cache do Next.js apos mudancas no admin.

**Arquivo:** `app/api/revalidate/route.ts`

**Referencia:** SPEC_TECNICA.md secao 7.6

**Criterios de aceite:**
- POST para `/api/revalidate` revalida `/` e `/projetos/[slug]`
- Chamado apos criar, editar ou excluir projeto no admin

---

## FASE 6 — SEO e Performance

### TASK-024 — SEO: Metadata, Sitemap, Robots

**Descricao:** Configurar todas as tags de SEO.

**Arquivos:**
- `app/sitemap.ts`
- `app/robots.ts`
- Atualizar metadata em `app/layout.tsx` e `app/projetos/[slug]/page.tsx`

**Referencia:** SPEC_TECNICA.md secao 9

**Criterios de aceite:**
- `https://dominio.com/sitemap.xml` retorna XML valido com todos os projetos publicados
- `https://dominio.com/robots.txt` bloqueia `/admin`
- Metadata correta em todas as paginas (title, description, og:image)
- Lighthouse SEO: 100

---

### TASK-025 — Auditoria de Performance

**Descricao:** Revisar e corrigir gargalos de performance.

**Checklist:**
- Todas as imagens usando `next/image`?
- Todas as fontes usando `next/font`?
- Componentes com animacoes pesadas usando dynamic import com `ssr: false`?
- `will-change: transform` nos elementos animados?
- Listeners de scroll e mousemove usando `{ passive: true }`?
- `requestAnimationFrame` sendo cancelado no cleanup dos useEffect?
- Imagens do Supabase Storage com parametros de otimizacao (width, quality)?

**Meta:**
- Lighthouse Performance mobile: > 90
- Lighthouse Performance desktop: > 95
- LCP: < 2.5s

**Criterios de aceite:**
- Relatorio Lighthouse com scores documentados
- Nenhuma imagem sem `next/image`
- Nenhuma fonte sem `next/font`

---

## FASE 7 — Deploy

### TASK-026 — Deploy na Vercel

**Descricao:** Configurar e fazer o deploy na Vercel.

**Passos:**
1. Criar projeto na Vercel via dashboard ou CLI
2. Configurar variaveis de ambiente na Vercel (mesmas do `.env.local`)
3. Configurar dominio customizado (quando disponivel)
4. Verificar que o build de producao passa sem erros
5. Testar todas as funcionalidades em producao
6. Verificar Supabase: adicionar URL da Vercel nos "Allowed URLs" do projeto

**Criterios de aceite:**
- Site acessivel em producao
- Admin funciona em producao
- Imagens carregando do Supabase Storage
- Variaveis de ambiente corretas (nenhuma exposta no client que nao deveria)

---

## Resumo das Phases

| Fase | Tasks | Descricao |
|---|---|---|
| 1 — Setup | 001 a 004 | Projeto, Tailwind, Supabase, Migrations |
| 2 — Layout | 005 a 010 | Layout raiz, Cursor, Header, Animacoes base |
| 3 — Home | 011 a 016 | Todas as secoes da home |
| 4 — Detalhe | 017 | Pagina de projeto com galeria |
| 5 — Admin | 018 a 023 | Login, CRUD, upload, revalidacao |
| 6 — SEO/Perf | 024 a 025 | Metadata, sitemap, auditoria |
| 7 — Deploy | 026 | Vercel |

**Total: 26 tasks**
