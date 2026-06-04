# Master Briefing — Laert Costa Studio

**Versao:** 1.0
**Data:** Junho 2025
**Responsavel:** Laert Costa

---

## 1. Contexto do Negocio

Laert Costa e arquiteto e urbanista baseado em Campo Grande, MS. Atua ha mais de 10 anos no mercado de arquitetura, com solida experiencia em projetos residenciais, comerciais, compatibilizacao BIM e incorporacao imobiliaria. Possui duas pos-graduacoes: MBA em Plataforma BIM (Gestao e Projetos) pelo IPOG e MBA em Gestao de Projetos pela Faculdade Fasul. Atua como professor de pos-graduacao no modulo de modelagem de arquitetura para extracao de quantitativos.

Atualmente trabalha na Engepar Engenharia como Analista de Arquitetura e PM, onde e responsavel por elaboracao de Registros de Incorporacao, analise dos quadros da NBR 12721, projetos arquitetonicos e compatibilizacao.

**Posicionamento pretendido:** parceiro tecnico premium para escritorios de arquitetura de pequeno a grande porte e incorporadoras. Nao e um portfolio generico de arquiteto — e um site de um especialista tecnico que entende tanto de projeto quanto de processo.

---

## 2. Objetivo do Site

Gerar contato qualificado via WhatsApp de potenciais clientes (escritorios, construtoras, incorporadoras) interessados em:

- Projetos arquitetonicos residenciais
- Projetos arquitetonicos comerciais
- Renderizacao e visualizacao 3D para lancamentos imobiliarios

Secundariamente: consolidar autoridade e credibilidade via portfolio visual de alta qualidade.

---

## 3. Publico-Alvo

**Primario:** Proprietarios e socios de escritorios de arquitetura pequenos e medios que precisam de apoio tecnico ou de renders para apresentar projetos a clientes.

**Secundario:** Incorporadoras e construtoras de medio porte que precisam de arquiteto para registro de incorporacao, compatibilizacao BIM e material visual para lancamentos.

**Perfil comum:** profissional de 30 a 55 anos, acostumado a avaliar qualidade de entrega antes de contratar, que decide pelo portfolio e pela clareza da comunicacao.

---

## 4. Marca

**Nome:** Laert Costa Studio
**Personalidade:** tecnico, preciso, confiavel, contemporaneo, sem exageros
**Tom de voz:** direto, sem rodeios, confiante sem ser arrogante
**Estetica:** brutalismo refinado, preto e branco, tipografia massiva, espaco negativo

**O que a marca NAO e:** glamourosa, decorativa, emotiva em excesso, generica.

---

## 5. Servicos Oferecidos

### Projetos Residenciais
Projetos arquitetonicos completos para residencias unifamiliares e condominiios. Desde o anteprojeto ate o projeto executivo. Conhecimento de normas municipais de Campo Grande e MS.

### Projetos Comerciais
Projetos para lojas, escritorios, clinicas e edificios comerciais. Experiencia em aprovacao junto a prefeitura e orgaos competentes.

### Renderizacao e Visualizacao 3D
Producao de renders fotorrealistas para apresentacao de projetos e lancamentos imobiliarios. Utilizando SketchUp e ferramentas de renderizacao. Diferencial para incorporadoras que precisam de material visual de qualidade para marketing de lancamento.

---

## 6. Informacoes do Profissional (para secao Sobre)

**Nome completo:** Laert da Costa Gomes Junior
**Formacao:** Arquitetura e Urbanismo — Anhanguera Uniderp (2018)
**Pos-graduacao 1:** MBA Plataforma BIM — Gestao e Projetos — IPOG MS (2020)
**Pos-graduacao 2:** MBA Gestao de Projetos — Faculdade Fasul (2025)
**Cursando:** Product Manager — Escola DNC

**Experiencia atual:** Analista de Arquitetura e PM — Engepar Engenharia (novembro 2020 — presente)
**Docencia:** Professor de Pos-Graduacao — Faculdade Focus / Instituto HD ENG

**Habilidades tecnicas relevantes:** AutoCAD, Revit, Navisworks, SketchUp, MS Project, Compatibilizacao BIM, NBR 12721, SQL, Python, Dashboards Gerenciais

**Contato:** (67) 99324-8550 — laert.14@gmail.com — Campo Grande, MS
**WhatsApp:** 5567993248550

---

## 7. Estrutura do Site

### Paginas Publicas

**Home (one-page com scroll)**
- Hero: nome do studio em tipografia massiva, subtitulo com efeito de digitacao
- Servicos: tres blocos (Residencial, Comercial, Render 3D)
- Projetos: grid filtrado por categoria com cards animados
- Sobre: perfil do Laert com credenciais
- Contato: botao WhatsApp

**Detalhe do Projeto** (`/projetos/[slug]`)
- Galeria de imagens em fullscreen
- Titulo, categoria, ano, descricao
- Botao voltar

### Painel Admin (`/admin`)
- Login com email e senha
- Listagem de projetos com status
- Criar novo projeto
- Editar projeto existente
- Upload de multiplas imagens
- Controle de publicacao (publicado / oculto)

---

## 8. Animacoes Planejadas

Todas as animacoes sao intencionais e mapeadas por componente no CLAUDE.md. O site deve parecer um produto de agencia de design premium, nao um template.

As animacoes principais sao: entrada da hero com word mask, cursor customizado com dot e ring, reveal das secoes via scroll, parallax nas headlines, tilt 3D nos cards de projetos, galeria com abertura animada, filtros com transicao fluida e contador de numeros.

---

## 9. Restricoes Tecnicas

- Deploy: Vercel (plano gratuito ou pro, a definir)
- Banco: Supabase gratuito no inicio
- Dominio: a contratar (sugestao: laertcostastudio.com.br)
- Imagens: armazenadas no Supabase Storage, nao no repositorio
- Sem servidor proprio — arquitetura serverless e estatica

---

## 10. Criterios de Sucesso

- Lighthouse Performance: acima de 90 em mobile
- Lighthouse SEO: 100
- Tempo de carregamento da home (LCP): abaixo de 2.5s
- Site funcional com admin operacional
- Upload e publicacao de projetos sem assistencia tecnica
- Zero dependencia de desenvolvedor para atualizar o portfolio
