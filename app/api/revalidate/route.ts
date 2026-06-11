import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
  }

  revalidatePath('/')
  revalidatePath('/projetos/[slug]', 'page')
  return NextResponse.json({ revalidated: true })
}
