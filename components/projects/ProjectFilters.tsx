'use client'

import type { ProjectCategory } from '@/lib/supabase/types'

const FILTERS: { value: 'all' | ProjectCategory; label: string }[] = [
  { value: 'all', label: 'TODOS' },
  { value: 'residential', label: 'RESIDENCIAL' },
  { value: 'commercial', label: 'COMERCIAL' },
  { value: 'render', label: 'RENDER' },
]

interface ProjectFiltersProps {
  active: 'all' | ProjectCategory
  onChange: (filter: 'all' | ProjectCategory) => void
}

export default function ProjectFilters({ active, onChange }: ProjectFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 md:gap-8" role="tablist" aria-label="Filtrar projetos">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          role="tab"
          aria-selected={active === value}
          onClick={() => onChange(value)}
          className={`font-body text-xs tracking-widest uppercase transition-colors duration-200 pb-1 border-b ${
            active === value
              ? 'text-black border-black'
              : 'text-black/30 border-transparent hover:text-black/60 hover:border-black/30'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
