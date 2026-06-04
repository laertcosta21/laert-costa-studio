'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/utils'
import type { ProjectCategory, ProjectStatus } from '@/lib/supabase/types'

async function triggerRevalidate() {
  revalidatePath('/')
  revalidatePath('/projetos/[slug]', 'page')
  revalidatePath('/admin')
  revalidatePath('/admin/projetos/[id]', 'page')
}

export async function createProject(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const slug = (formData.get('slug') as string) || generateSlug(title)
  const category = formData.get('category') as ProjectCategory
  const year = formData.get('year') ? Number(formData.get('year')) : null
  const description = (formData.get('description') as string) || null
  const status = (formData.get('status') as ProjectStatus) || 'hidden'

  // Pega o maior position atual para colocar o novo projeto no final
  const { data: lastPos } = await supabase
    .from('projects')
    .select('position')
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle()
  const nextPosition = (lastPos?.position ?? 0) + 1

  const { data: project, error } = await supabase
    .from('projects')
    .insert({ title, slug, category, year, description, status, position: nextPosition })
    .select('id')
    .single()

  if (error || !project) {
    return { error: error?.message ?? 'Erro ao criar projeto.' }
  }

  // Upload de imagens
  const files = formData.getAll('images') as File[]
  const validFiles = files.filter((f) => f.size > 0)

  let coverUrl: string | null = null

  for (let i = 0; i < validFiles.length; i++) {
    const file = validFiles[i]
    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${i}.${ext}`
    const path = `${project.id}/${filename}`

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(path, file, { contentType: file.type, upsert: false })

    if (uploadError) {
      console.error('Erro no upload de imagem (createProject):', uploadError)
      return { error: `Erro no upload da imagem ${file.name}: ${uploadError.message}` }
    }

    const { data: urlData } = supabase.storage
      .from('project-images')
      .getPublicUrl(path)

    const publicUrl = urlData?.publicUrl
    if (!publicUrl) continue

    await supabase.from('project_images').insert({
      project_id: project.id,
      url: publicUrl,
      order: i,
      alt_text: file.name.replace(/\.[^.]+$/, ''),
    })

    if (i === 0) coverUrl = publicUrl
  }

  if (coverUrl) {
    await supabase.from('projects').update({ cover_image_url: coverUrl }).eq('id', project.id)
  }

  await triggerRevalidate()
  redirect('/admin')
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const slug = (formData.get('slug') as string) || generateSlug(title)
  const category = formData.get('category') as ProjectCategory
  const year = formData.get('year') ? Number(formData.get('year')) : null
  const description = (formData.get('description') as string) || null
  const status = (formData.get('status') as ProjectStatus) || 'hidden'

  const { error } = await supabase
    .from('projects')
    .update({ title, slug, category, year, description, status })
    .eq('id', id)

  if (error) return { error: error.message }

  // Upload de novas imagens
  const files = formData.getAll('images') as File[]
  const validFiles = files.filter((f) => f.size > 0)

  if (validFiles.length > 0) {
    const { data: existingImages } = await supabase
      .from('project_images')
      .select('order')
      .eq('project_id', id)
      .order('order', { ascending: false })
      .limit(1)

    let startOrder = (existingImages?.[0]?.order ?? -1) + 1

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i]
      const ext = file.name.split('.').pop()
      const filename = `${Date.now()}-${i}.${ext}`
      const path = `${id}/${filename}`

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(path, file, { contentType: file.type, upsert: false })

      if (uploadError) {
        console.error('Erro no upload de imagem (updateProject):', uploadError)
        return { error: `Erro no upload da imagem ${file.name}: ${uploadError.message}` }
      }

      const { data: urlData } = supabase.storage
        .from('project-images')
        .getPublicUrl(path)

      const publicUrl = urlData?.publicUrl
      if (!publicUrl) continue

      await supabase.from('project_images').insert({
        project_id: id,
        url: publicUrl,
        order: startOrder + i,
        alt_text: file.name.replace(/\.[^.]+$/, ''),
      })
    }

    // Atualiza cover se não houver uma
    const { data: proj } = await supabase
      .from('projects')
      .select('cover_image_url')
      .eq('id', id)
      .single()

    if (!proj?.cover_image_url) {
      const { data: firstImage } = await supabase
        .from('project_images')
        .select('url')
        .eq('project_id', id)
        .order('order', { ascending: true })
        .limit(1)
        .single()

      if (firstImage) {
        await supabase.from('projects').update({ cover_image_url: firstImage.url }).eq('id', id)
      }
    }
  }

  await triggerRevalidate()
  redirect('/admin')
}

export async function deleteProject(id: string) {
  const supabase = await createClient()

  // Deleta arquivos do Storage
  const { data: files } = await supabase.storage
    .from('project-images')
    .list(id)

  if (files && files.length > 0) {
    await supabase.storage
      .from('project-images')
      .remove(files.map((f) => `${id}/${f.name}`))
  }

  // Deleta o projeto (cascade remove project_images)
  await supabase.from('projects').delete().eq('id', id)

  await triggerRevalidate()
  redirect('/admin')
}

export async function deleteProjectImage(imageId: string, projectId: string, imageUrl: string) {
  const supabase = await createClient()

  // Extrai o path da URL pública
  const urlParts = imageUrl.split('/project-images/')
  if (urlParts[1]) {
    await supabase.storage.from('project-images').remove([urlParts[1]])
  }

  await supabase.from('project_images').delete().eq('id', imageId)

  // Se era a capa, atualiza para a próxima imagem
  const { data: firstImage } = await supabase
    .from('project_images')
    .select('url')
    .eq('project_id', projectId)
    .order('order', { ascending: true })
    .limit(1)
    .single()

  await supabase
    .from('projects')
    .update({ cover_image_url: firstImage?.url ?? null })
    .eq('id', projectId)

  revalidatePath('/admin')
}

// Atualiza a ordem dos projetos via drag-and-drop
// orderedIds: array de IDs na nova ordem desejada
export async function updateProjectsOrder(orderedIds: string[]) {
  const supabase = await createClient()

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from('projects')
        .update({ position: index + 1 })
        .eq('id', id)
    )
  )

  revalidatePath('/')
  revalidatePath('/admin')
}
