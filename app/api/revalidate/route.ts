import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST() {
  revalidatePath('/')
  revalidatePath('/projetos/[slug]', 'page')
  return NextResponse.json({ revalidated: true })
}
