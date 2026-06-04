'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { deleteProject, updateProjectsOrder } from '@/lib/admin-actions'
import type { Database } from '@/lib/supabase/types'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectListProps {
  projects: Project[]
}

const CATEGORY_LABELS: Record<string, string> = {
  residential: 'Residencial',
  commercial: 'Comercial',
  render: 'Render 3D',
}

export default function ProjectList({ projects: initialProjects }: ProjectListProps) {
  const router = useRouter()
  const [items, setItems] = useState(initialProjects)
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)
  const dragIndex = useRef<number | null>(null)

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Excluir "${title}"? Esta ação não pode ser desfeita.`)) return
    setDeletingId(id)
    startTransition(async () => {
      await deleteProject(id)
      setDeletingId(null)
    })
  }

  // ─── Drag and drop nativo ───────────────────────────────────
  const onDragStart = (index: number) => {
    dragIndex.current = index
  }

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex.current === null || dragIndex.current === index) return
    const reordered = [...items]
    const [moved] = reordered.splice(dragIndex.current, 1)
    reordered.splice(index, 0, moved)
    dragIndex.current = index
    setItems(reordered)
  }

  const onDragEnd = async () => {
    dragIndex.current = null
    setSavingOrder(true)
    try {
      await updateProjectsOrder(items.map((p) => p.id))
      router.refresh()
    } finally {
      setSavingOrder(false)
    }
  }

  return (
    <div>
      {/* Instrução de ordenação */}
      <p
        className="font-body text-black/30 mb-3"
        style={{ fontSize: '12px', letterSpacing: '0.08em' }}
      >
        {savingOrder ? '⟳ Salvando ordem...' : '⠿ Arraste as linhas para reordenar os projetos no site'}
      </p>

      <div className="flex flex-col">
        {items.map((project, index) => (
          <div
            key={project.id}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDragEnd={onDragEnd}
            className={`bg-white border border-gray-200 hover:border-gray-400 transition-colors flex items-center px-4 py-4 gap-4 border-b last:border-b-0 cursor-grab active:cursor-grabbing select-none ${
              deletingId === project.id ? 'opacity-40' : ''
            }`}
          >
            {/* Handle de drag */}
            <div
              className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors"
              style={{ fontSize: '18px', lineHeight: 1, cursor: 'grab', userSelect: 'none' }}
              aria-hidden="true"
            >
              ⠿
            </div>

            {/* Thumbnail */}
            <div
              className="flex-shrink-0 bg-gray-100 overflow-hidden relative"
              style={{ width: '64px', height: '64px', minWidth: '64px' }}
            >
              {project.cover_image_url ? (
                <Image
                  src={project.cover_image_url}
                  alt={project.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="font-body text-gray-300 font-semibold" style={{ fontSize: '22px' }}>
                    {project.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Bloco de texto */}
            <div className="flex-1 min-w-0">
              <p className="font-body font-medium text-black truncate" style={{ fontSize: '15px' }}>
                {project.title}
              </p>
              <p className="font-body text-black/40 mt-0.5" style={{ fontSize: '13px' }}>
                {CATEGORY_LABELS[project.category] ?? project.category}
                {project.year ? ` · ${project.year}` : ''}
              </p>
            </div>

            {/* Badge de status */}
            <div className="w-24 text-right flex-shrink-0">
              {project.status === 'published' ? (
                <span className="font-body font-semibold text-emerald-600" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                  PUBLICADO
                </span>
              ) : (
                <span className="font-body text-gray-400" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                  OCULTO
                </span>
              )}
            </div>

            {/* Botões */}
            <div className="flex gap-4 flex-shrink-0">
              <Link
                href={`/admin/projetos/${project.id}`}
                className="font-body text-black hover:text-black/50 transition-colors"
                style={{ fontSize: '13px', letterSpacing: '0.1em' }}
                onClick={(e) => e.stopPropagation()}
              >
                EDITAR
              </Link>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(project.id, project.title) }}
                disabled={isPending}
                className="font-body text-red-500 hover:text-red-400 transition-colors disabled:opacity-40"
                style={{ fontSize: '13px', letterSpacing: '0.1em' }}
              >
                EXCLUIR
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
