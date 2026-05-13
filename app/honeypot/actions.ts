'use server'

import { createClient } from '@/lib/supabase'
import { USER1_ID } from '@/lib/constants'

export async function recordVisit(fromUrl: string) {
  const supabase = createClient()
  await supabase.from('VISITEVENT').insert({
    user_id: USER1_ID,
    from_url: fromUrl,
    visited_at: new Date().toISOString(),
  })
}
