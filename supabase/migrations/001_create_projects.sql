-- Tipos ENUM
CREATE TYPE project_category AS ENUM ('residential', 'commercial', 'render');
CREATE TYPE project_status AS ENUM ('published', 'hidden');

-- Tabela de projetos
CREATE TABLE projects (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  category         project_category NOT NULL,
  description      TEXT,
  year             INTEGER,
  status           project_status NOT NULL DEFAULT 'hidden',
  cover_image_url  TEXT,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

-- Tabela de imagens dos projetos
CREATE TABLE project_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  "order"     INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- Políticas: leitura pública somente para projetos publicados
CREATE POLICY "public_read_published" ON projects
  FOR SELECT USING (status = 'published');

-- Políticas: admin vê e gerencia tudo
CREATE POLICY "admin_all" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para imagens
CREATE POLICY "public_read_images" ON project_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_id AND p.status = 'published'
    )
  );

CREATE POLICY "admin_all_images" ON project_images
  FOR ALL USING (auth.role() = 'authenticated');
