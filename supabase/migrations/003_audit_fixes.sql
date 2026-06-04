-- Correções aplicadas após auditoria de segurança e performance
-- Auditoria realizada em: 2026-06-01

-- ============================================================
-- FASE 1: Integridade de dados
-- ============================================================

-- Timestamps não podem ser NULL
ALTER TABLE projects
  ALTER COLUMN created_at SET NOT NULL,
  ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE project_images
  ALTER COLUMN created_at SET NOT NULL;

-- Adicionar updated_at em project_images (estava faltando)
ALTER TABLE project_images
  ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE TRIGGER trg_project_images_updated_at
  BEFORE UPDATE ON project_images
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Alt text para acessibilidade e SEO de imagens
ALTER TABLE project_images
  ADD COLUMN alt_text TEXT;

-- Constraint de ano válido
ALTER TABLE projects
  ADD CONSTRAINT chk_projects_year
  CHECK (year IS NULL OR (year >= 1900 AND year <= EXTRACT(YEAR FROM now())::INTEGER + 5));

-- Índice funcional para slug case-insensitive (evita rotas duplicadas)
CREATE UNIQUE INDEX idx_projects_slug_lower ON projects (lower(slug));

-- ============================================================
-- FASE 2: Índices de performance
-- ============================================================

CREATE INDEX idx_projects_status   ON projects (status) WHERE status = 'published';
CREATE INDEX idx_projects_category ON projects (category);
CREATE INDEX idx_project_images_project_id ON project_images (project_id);
CREATE INDEX idx_project_images_order      ON project_images (project_id, "order");

-- ============================================================
-- FASE 3: RLS — policies travadas no email do admin
-- Problema original: auth.role() = 'authenticated' dava acesso
-- a qualquer usuário autenticado, não apenas ao Laert.
-- ============================================================

-- Tabela projects
DROP POLICY IF EXISTS "public_read_published" ON projects;
DROP POLICY IF EXISTS "admin_all"             ON projects;

CREATE POLICY "anon_select_published" ON projects
  FOR SELECT TO anon
  USING (status = 'published');

CREATE POLICY "admin_select_all" ON projects
  FOR SELECT TO authenticated
  USING ((auth.jwt() ->> 'email') = 'laert.14@gmail.com');

CREATE POLICY "admin_insert" ON projects
  FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() ->> 'email') = 'laert.14@gmail.com');

CREATE POLICY "admin_update" ON projects
  FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'email') = 'laert.14@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'laert.14@gmail.com');

CREATE POLICY "admin_delete" ON projects
  FOR DELETE TO authenticated
  USING ((auth.jwt() ->> 'email') = 'laert.14@gmail.com');

-- Tabela project_images
DROP POLICY IF EXISTS "public_read_images" ON project_images;
DROP POLICY IF EXISTS "admin_all_images"   ON project_images;

CREATE POLICY "anon_select_images" ON project_images
  FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_images.project_id AND p.status = 'published'
    )
  );

CREATE POLICY "admin_select_images" ON project_images
  FOR SELECT TO authenticated
  USING ((auth.jwt() ->> 'email') = 'laert.14@gmail.com');

CREATE POLICY "admin_insert_images" ON project_images
  FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() ->> 'email') = 'laert.14@gmail.com');

CREATE POLICY "admin_update_images" ON project_images
  FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'email') = 'laert.14@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'laert.14@gmail.com');

CREATE POLICY "admin_delete_images" ON project_images
  FOR DELETE TO authenticated
  USING ((auth.jwt() ->> 'email') = 'laert.14@gmail.com');

-- ============================================================
-- FASE 4: Storage — recriar policies com WITH CHECK correto
-- ============================================================

DROP POLICY IF EXISTS "public_read_images_storage" ON storage.objects;
DROP POLICY IF EXISTS "admin_upload_images"         ON storage.objects;
DROP POLICY IF EXISTS "admin_delete_images"         ON storage.objects;
DROP POLICY IF EXISTS "admin_update_images"         ON storage.objects;

CREATE POLICY "public_read_project_images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'project-images');

CREATE POLICY "admin_insert_project_images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'project-images'
    AND (auth.jwt() ->> 'email') = 'laert.14@gmail.com'
  );

CREATE POLICY "admin_delete_project_images" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'project-images'
    AND (auth.jwt() ->> 'email') = 'laert.14@gmail.com'
  );

-- WITH CHECK impede mover objeto para outro bucket via UPDATE
CREATE POLICY "admin_update_project_images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'project-images'
    AND (auth.jwt() ->> 'email') = 'laert.14@gmail.com'
  )
  WITH CHECK (
    bucket_id = 'project-images'
    AND (auth.jwt() ->> 'email') = 'laert.14@gmail.com'
  );
