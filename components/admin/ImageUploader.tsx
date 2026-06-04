'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface ExistingImage {
  id: string
  url: string
  alt_text: string | null
  order: number
}

interface NewImage {
  file: File
  preview: string
}

interface ImageUploaderProps {
  existingImages?: ExistingImage[]
  onNewFilesChange: (files: File[]) => void
  onDeleteExisting?: (id: string, url: string) => void
}

export default function ImageUploader({
  existingImages = [],
  onNewFilesChange,
  onDeleteExisting,
}: ImageUploaderProps) {
  const [newImages, setNewImages] = useState<NewImage[]>([])
  const [dragging, setDragging] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const updateFiles = (items: NewImage[]) => {
    setNewImages(items)
    onNewFilesChange(items.map((i) => i.file))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const items = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    const updated = [...newImages, ...items]
    updateFiles(updated)
    if (inputRef.current) inputRef.current.value = ''
  }

  const removeNew = (index: number) => {
    const updated = newImages.filter((_, i) => {
      if (i === index) URL.revokeObjectURL(newImages[i].preview)
      return i !== index
    })
    updateFiles(updated)
  }

  const handleDragStart = (i: number) => setDragging(i)

  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    if (dragging === null || dragging === i) return
    const next = [...newImages]
    const [moved] = next.splice(dragging, 1)
    next.splice(i, 0, moved)
    setDragging(i)
    updateFiles(next)
  }

  const handleDragEnd = () => setDragging(null)

  const total = existingImages.length + newImages.length

  return (
    <div className="flex flex-col gap-4">
      {/* Imagens já salvas */}
      {existingImages.length > 0 && (
        <div>
          <p className="text-xs text-black/40 tracking-wider uppercase mb-2">Imagens salvas</p>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((img, i) => (
              <div key={img.id} className="relative group w-24 h-24 border border-black/10 overflow-hidden">
                <Image src={img.url} alt={img.alt_text ?? ''} fill className="object-cover" sizes="96px" />
                {i === 0 && (
                  <span className="absolute top-1 left-1 bg-black text-white text-[9px] px-1 leading-4">
                    CAPA
                  </span>
                )}
                {onDeleteExisting && (
                  <button
                    type="button"
                    onClick={() => onDeleteExisting(img.id, img.url)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remover"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Novas imagens */}
      {newImages.length > 0 && (
        <div>
          <p className="text-xs text-black/40 tracking-wider uppercase mb-2">
            Novas — arraste para reordenar
          </p>
          <div className="flex flex-wrap gap-3">
            {newImages.map((img, i) => (
              <div
                key={img.preview}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDragEnd={handleDragEnd}
                className={`relative group w-24 h-24 border border-black/10 overflow-hidden cursor-grab ${
                  dragging === i ? 'opacity-40 scale-95' : ''
                } transition-all`}
              >
                <Image src={img.preview} alt="" fill className="object-cover" sizes="96px" />
                {existingImages.length === 0 && i === 0 && (
                  <span className="absolute top-1 left-1 bg-black text-white text-[9px] px-1 leading-4">
                    CAPA
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeNew(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remover"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botão de seleção */}
      <div className="flex items-center gap-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="image-upload-input"
        />
        <label
          htmlFor="image-upload-input"
          className="inline-flex items-center gap-2 border border-dashed border-black/20 px-5 py-3 text-xs text-black/50 tracking-wider uppercase cursor-pointer hover:border-black hover:text-black transition-colors"
        >
          + ADICIONAR IMAGENS
        </label>
        {total > 0 && (
          <span className="text-xs text-black/30">
            {total} imagem{total !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  )
}
