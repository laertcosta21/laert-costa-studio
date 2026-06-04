import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Cliente sem cookies — para uso em generateStaticParams e contextos sem request HTTP
export function createStaticClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
