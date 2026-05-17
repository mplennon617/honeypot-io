export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase'
import { USER1_ID } from '@/lib/constants'
import DashboardUI from './DashboardUI'

function extractHostname(url: string): string {
  if (!url) return '(direct)'
  try {
    return new URL(url).hostname || '(direct)'
  } catch {
    return url.length > 40 ? url.slice(0, 40) + '…' : url
  }
}

function formatDateLabel(dateStr: string): string {
  const [, m, d] = dateStr.split('-')
  return `${parseInt(m)}/${parseInt(d)}`
}

export default async function DashboardPage() {
  const supabase = createClient()

  const today = new Date().toISOString().slice(0, 10)

  const windowStart = new Date()
  windowStart.setDate(windowStart.getDate() - 13)
  const startDate = windowStart.toISOString().slice(0, 10)

  const { data: rows } = await supabase
    .from('VISITEVENT')
    .select('visited_at, from_url')
    .eq('user_id', USER1_ID)
    .gte('visited_at', startDate)
    .order('visited_at', { ascending: true })

  const visits = rows ?? []

  // Pre-fill all 14 days with 0 so gaps show on the chart
  const dailyCounts: Record<string, number> = {}
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dailyCounts[d.toISOString().slice(0, 10)] = 0
  }
  for (const v of visits) {
    const day = v.visited_at.slice(0, 10)
    if (day in dailyCounts) dailyCounts[day]++
  }

  const dailyData = Object.entries(dailyCounts).map(([date, count]) => ({
    date: formatDateLabel(date),
    count,
  }))

  const todayCount = dailyCounts[today] ?? 0

  // Top sites for today
  const siteMap: Record<string, number> = {}
  for (const v of visits) {
    if (v.visited_at.slice(0, 10) !== today) continue
    const host = extractHostname(v.from_url)
    siteMap[host] = (siteMap[host] ?? 0) + 1
  }
  const topSites = Object.entries(siteMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([site, count]) => ({ site, count }))

  // 7-day window stats (last 7 entries in dailyCounts)
  const last7 = Object.values(dailyCounts).slice(-7)
  const sevenDayAvg = Math.round(last7.reduce((a, b) => a + b, 0) / 7)
  const sevenDayHigh = Math.max(...last7)
  const sevenDayLow = Math.min(...last7)

  return (
    <DashboardUI
      todayCount={todayCount}
      dailyData={dailyData}
      topSites={topSites}
      sevenDayAvg={sevenDayAvg}
      sevenDayHigh={sevenDayHigh}
      sevenDayLow={sevenDayLow}
    />
  )
}
