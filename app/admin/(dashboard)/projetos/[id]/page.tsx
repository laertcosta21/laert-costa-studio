'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProjectForm from '@/components/admin/ProjectForm'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type Project = Database['public']['Tables']['projects']['Row']
type ProjectImage = Database['public']['Tables']['project_images']['Row']

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [images, setImages] = useState<ProjectImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const supabase = createClient()

    Promise.all([
      supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .maybeSingle(),
      supabase
        .from('project_images')
        .select('*')
        .eq('project_id', id)
        .order('order', { ascending: true }),
    ]).then(([projectResult, imagesResult]) => {
      if (!projectResult.data) {
        router.push('/admin')
        return
      }
      setProject(projectResult.data)
      setImages(imagesResult.data ?? [])
    }).catch(() => {
      router.push('/admin')
    }).finally(() => {
      setLoading(false)
    })
  }, [id, router])

  if (loading) {
    return (
      <div style={{ maxWidth: '672px', margin: '0 auto', padding: '80px 32px' }}>
        <p className="font-body text-black/40" style={{ fontSize: '14px' }}>
          Carregando projeto...
        </p>
      </div>
    )
  }

  if (!project) return null

  return <ProjectForm project={project} images={images} />
}
