# Laert Costa Studio

Site institucional e portfolio de Laert Costa, Arquiteto e Urbanista.
Desenvolvido com Next.js 14 App Router, TypeScript, Tailwind CSS e Supabase.

---

## Stack

| Camada       | Tecnologia                        |
|--------------|-----------------------------------|
| Framework    | Next.js 14 (App Router)           |
| Linguagem    | TypeScript (strict)               |
| Estilizacao  | Tailwind CSS com tema customizado |
| Banco        | Supabase (PostgreSQL)             |
| Storage      | Supabase Storage                  |
| Animacoes    | Anime.js + CSS transitions        |
| Deploy       | Vercel (regiao gru1 - Sao Paulo)  |
| Fontes       | next/font/local (woff2 locais)    |

---

## Configuracao do Ambiente Local

### 1. Clonar o repositorio

```bash
git clone https://github.com/seu-usuario/laert-costa-studio.git
cd laert-costa-studio
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variaveis de ambiente

Copie o arquivo de exemplo e preencha os valores reais:

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas credenciais:

```bash
# URL e chave publica do projeto Supabase
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui

# Chave de servico (somente para operacoes server-side)
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

# Numero WhatsApp no formato internacional
NEXT_PUBLIC_WHATSAPP_NUMBER=5567993248550

# URL do site em producao
NEXT_PUBLIC_SITE_URL=https://laertcostastudio.com.br
```

As chaves do Supabase estao em: **Project Settings > API** no dashboard do Supabase.

### 4. Rodar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse em `http://localhost:3000`.

---

## Deploy na Vercel

### Primeiro deploy

1. Acesse [vercel.com](https://vercel.com) e conecte sua conta GitHub.
2. Clique em **Add New Project** e selecione o repositorio.
3. Configure as variaveis de ambiente na aba **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
   - `NEXT_PUBLIC_SITE_URL`
4. Clique em **Deploy**.

O arquivo `vercel.json` ja esta configurado para usar a regiao `gru1` (Sao Paulo).

### Deploys subsequentes

Qualquer push para a branch `main` dispara um deploy automatico.

---

## Deploy em Servidor (Hostinger VPS / Servidor Proprio)

### Requisitos do servidor

- Node.js 18 ou superior
- npm 9 ou superior
- Porta 3000 disponivel (ou configurar proxy reverso com Nginx)

### Passos

```bash
# 1. Clonar o repositorio no servidor
git clone https://github.com/seu-usuario/laert-costa-studio.git
cd laert-costa-studio

# 2. Instalar dependencias
npm install

# 3. Criar o arquivo de ambiente
cp .env.local.example .env.local
# Editar .env.local com os valores reais

# 4. Fazer o build de producao
npm run build

# 5. Iniciar o servidor
npm start
```

O servidor sobe na porta 3000 por padrao.

### Rodando em background com PM2

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar a aplicacao
pm2 start npm --name "laert-costa-studio" -- start

# Configurar reinicio automatico ao reiniciar o servidor
pm2 startup
pm2 save
```

### Proxy reverso com Nginx

Exemplo de configuracao `/etc/nginx/sites-available/laertcostastudio`:

```nginx
server {
    listen 80;
    server_name laertcostastudio.com.br www.laertcostastudio.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ative o SSL com Certbot:

```bash
sudo certbot --nginx -d laertcostastudio.com.br -d www.laertcostastudio.com.br
```

---

## Estrutura de Pastas

```
app/              Pages e layouts (App Router)
components/       Componentes React organizados por dominio
hooks/            Custom hooks
lib/              Configuracoes (Supabase, utils)
public/fonts/     Fontes woff2 locais (Bebas Neue, Inter Tight)
styles/           CSS global e variaveis
supabase/         Migrations SQL
```

---

## Banco de Dados

As migrations estao em `supabase/migrations/`. Para aplicar em um projeto Supabase novo:

1. Instale o Supabase CLI: `npm install -g supabase`
2. Conecte ao projeto: `supabase link --project-ref SEU_PROJECT_ID`
3. Aplique as migrations: `supabase db push`

---

## Acesso Admin

O painel administrativo esta em `/admin`. O acesso e exclusivo via Supabase Auth (email e senha).
Entre em contato com o desenvolvedor para provisionar credenciais.
