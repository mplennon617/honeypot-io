import { createClient } from '@/lib/supabase'
import { USER1_ID } from '@/lib/constants'
import HoneypotUI from './HoneypotUI'

export default async function HoneypotPage() {
  const supabase = createClient()

  const today = new Date().toISOString().slice(0, 10)
  const { count } = await supabase
    .from('VISITEVENT')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', USER1_ID)
    .gte('visited_at', today)

  return <HoneypotUI todayCount={count ?? 0} />
}
