-- Bucket público para imagens dos projetos
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Leitura pública
CREATE POLICY "public_read_images_storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-images');

-- Upload autenticado
CREATE POLICY "admin_upload_images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-images' AND auth.role() = 'authenticated'
  );

-- Exclusão autenticada
CREATE POLICY "admin_delete_images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'project-images' AND auth.role() = 'authenticated'
  );

-- Atualização autenticada
CREATE POLICY "admin_update_images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'project-images' AND auth.role() = 'authenticated'
  );
