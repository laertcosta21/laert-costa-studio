'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from './ImageUploader'
import {
  createProject,
  updateProject,
  deleteProjectImage,
} from '@/lib/admin-actions'
import { generateSlug } from '@/lib/utils'
import type { Database } from '@/lib/supabase/types'

type Project = Database['public']['Tables']['projects']['Row']
type ProjectImage = Database['public']['Tables']['project_images']['Row']

interface ProjectFormProps {
  project?: Project
  images?: ProjectImage[]
}

// Classes reutilizáveis
const labelClass = 'block font-body text-xs tracking-widest font-semibold text-black/50 uppercase mb-2'
const inputClass = 'w-full border border-gray-200 bg-white px-4 py-3 font-body text-black placeholder-black/20 focus:outline-none focus:border-black transition-colors'
const fieldClass = 'mb-6'

export default function ProjectForm({ project, images = [] }: ProjectFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState(images)

  const [title, setTitle] = useState(project?.title ?? '')
  const [slug, setSlug] = useState(project?.slug ?? '')
  const [slugManual, setSlugManual] = useState(!!project)
  const [isPublished, setIsPublished] = useState(
    project ? project.status === 'published' : false
  )

  const handleTitleChange = (v: string) => {
    setTitle(v)
    if (!slugManual) setSlug(generateSlug(v))
  }

  const handleDeleteExisting = async (imageId: string, url: string) => {
    if (!project || !confirm('Remover esta imagem?')) return
    await deleteProjectImage(imageId, project.id, url)
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  const handleSubmit = (e: { preventDefault(): void; currentTarget: HTMLFormElement }) => {
    e.preventDefault()
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    formData.set('status', isPublished ? 'published' : 'hidden')
    selectedFiles.forEach((file) => formData.append('images', file))

    startTransition(async () => {
      const result = project
        ? await updateProject(project.id, formData)
        : await createProject(formData)

      if (result?.error) {
        setError(result.error)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <div style={{ maxWidth: '672px', margin: '0 auto', padding: '48px 32px' }}>

      {/* Cabeçalho */}
      <a
        href="/admin"
        className="font-body text-black/40 hover:text-black transition-colors block mb-6"
        style={{ fontSize: '12px', letterSpacing: '0.12em' }}
      >
        ← PROJETOS
      </a>
      <h1
        className="font-display text-black mb-10"
        style={{ fontSize: '40px', lineHeight: 1 }}
      >
        {project ? 'EDITAR PROJETO' : 'NOVO PROJETO'}
      </h1>

      {/* Erro global */}
      {error && (
        <div
          className="border border-red-200 bg-red-50 px-4 py-3 font-body text-red-600 mb-8"
          style={{ fontSize: '13px' }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* TÍTULO */}
        <div className={fieldClass}>
          <label htmlFor="title" className={labelClass}>
            Título <span className="text-red-400">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Nome do projeto"
            className={inputClass}
            style={{ fontSize: '15px' }}
          />
        </div>

        {/* SLUG */}
        <div className={fieldClass}>
          <label htmlFor="slug" className={labelClass}>
            Slug (URL)
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugManual(true) }}
            placeholder="gerado-automaticamente"
            className={`${inputClass} text-black/50`}
            style={{ fontSize: '15px' }}
          />
        </div>

        {/* CATEGORIA */}
        <div className={fieldClass}>
          <label htmlFor="category" className={labelClass}>
            Categoria <span className="text-red-400">*</span>
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={project?.category ?? ''}
            className={inputClass}
            style={{ fontSize: '15px' }}
          >
            <option value="" disabled>Selecionar</option>
            <option value="residential">Residencial</option>
            <option value="commercial">Comercial</option>
            <option value="render">Render 3D</option>
          </select>
        </div>

        {/* ANO */}
        <div className={`${fieldClass} max-w-[160px]`}>
          <label htmlFor="year" className={labelClass}>
            Ano
          </label>
          <input
            id="year"
            name="year"
            type="number"
            min="1900"
            max={new Date().getFullYear() + 5}
            defaultValue={project?.year ?? ''}
            placeholder={String(new Date().getFullYear())}
            className={inputClass}
            style={{ fontSize: '15px' }}
          />
        </div>

        {/* DESCRIÇÃO */}
        <div className={fieldClass}>
          <label htmlFor="description" className={labelClass}>
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={project?.description ?? ''}
            placeholder="Descrição do projeto (opcional)"
            className={`${inputClass} resize-none`}
            style={{ fontSize: '15px' }}
          />
        </div>

        {/* STATUS — toggle */}
        <div className={`${fieldClass} flex items-center justify-between py-2`}>
          <span className="font-body font-medium text-black" style={{ fontSize: '13px' }}>
            PUBLICADO
          </span>
          <div className="flex items-center gap-3">
            <span
              className="font-body text-black/40"
              style={{ fontSize: '12px' }}
            >
              {isPublished ? 'Sim' : 'Não'}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isPublished}
              aria-label="Publicar projeto"
              onClick={() => setIsPublished((v) => !v)}
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                isPublished ? 'bg-black' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  isPublished ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <input type="hidden" name="status" value={isPublished ? 'published' : 'hidden'} />
        </div>

        {/* IMAGENS */}
        <div className="border-t border-gray-100 pt-8 mt-4">
          <ImageUploader
            existingImages={existingImages}
            onNewFilesChange={setSelectedFiles}
            onDeleteExisting={project ? handleDeleteExisting : undefined}
          />
        </div>

        {/* BOTÕES */}
        <div className="flex items-center gap-4 mt-10">
          <button
            type="submit"
            disabled={isPending}
            className="font-body bg-black text-white hover:bg-black/80 transition-colors px-8 py-4 disabled:opacity-50"
            style={{ fontSize: '13px', letterSpacing: '0.1em', borderRadius: 0 }}
          >
            {isPending ? 'SALVANDO...' : project ? 'SALVAR ALTERAÇÕES' : 'SALVAR'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="font-body text-black/40 hover:text-black transition-colors px-8 py-4"
            style={{ fontSize: '13px', letterSpacing: '0.1em' }}
          >
            CANCELAR
          </button>
        </div>

      </form>
    </div>
  )
}
