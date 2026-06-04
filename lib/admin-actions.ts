'use server'

// Re-export das Server Actions do admin encapsulando em funções async
// Evita import com (dashboard) no path que causa problemas no Turbopack
// e contorna a limitação de re-export direto em arquivos 'use server'.

import {
  createProject as _createProject,
  updateProject as _updateProject,
  deleteProject as _deleteProject,
  deleteProjectImage as _deleteProjectImage,
  updateProjectsOrder as _updateProjectsOrder,
} from '@/app/admin/(dashboard)/projetos/actions'

export async function createProject(formData: FormData) {
  return _createProject(formData)
}

export async function updateProject(id: string, formData: FormData) {
  return _updateProject(id, formData)
}

export async function deleteProject(id: string) {
  return _deleteProject(id)
}

export async function deleteProjectImage(imageId: string, projectId: string, imageUrl: string) {
  return _deleteProjectImage(imageId, projectId, imageUrl)
}

export async function updateProjectsOrder(orderedIds: string[]) {
  return _updateProjectsOrder(orderedIds)
}
