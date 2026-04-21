import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lypjtxqvusqndqawugxu.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'sb_publishable_EbJEG5Y_81M3qM4isjXyaw_uUraIsAu'
)

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  if (!userId) return Response.json({ error: 'No userId' }, { status: 400 })

  const today = new Date().toISOString().split('T')[0]

  // Premium kontrolü
  const { data: premium } = await supabase.from('premium_users').select('status, expires_at').eq('user_id', userId).eq('status', 'active').single()
  const isPremium = premium && (!premium.expires_at || new Date(premium.expires_at) > new Date())

  // Kullanım verisi
  const { data: usage } = await supabase.from('usage_limits').select('*').eq('user_id', userId).eq('date', today).single()

  return Response.json({
    isPremium,
    searchCount: usage?.search_count || 0,
    translateCount: usage?.translate_count || 0,
    limits: isPremium ? { searches: 999, translates: 999 } : { searches: 10, translates: 5 }
  })
}

export async function POST(request) {
  const { userId, type } = await request.json()
  if (!userId || !type) return Response.json({ error: 'Missing params' }, { status: 400 })

  const today = new Date().toISOString().split('T')[0]

  const { data: existing } = await supabase.from('usage_limits').select('*').eq('user_id', userId).eq('date', today).single()

  if (existing) {
    const update = type === 'search'
      ? { search_count: (existing.search_count || 0) + 1 }
      : { translate_count: (existing.translate_count || 0) + 1 }
    await supabase.from('usage_limits').update(update).eq('id', existing.id)
    return Response.json({ success: true, count: type === 'search' ? (existing.search_count || 0) + 1 : (existing.translate_count || 0) + 1 })
  } else {
    const insert = type === 'search' ? { user_id: userId, date: today, search_count: 1 } : { user_id: userId, date: today, translate_count: 1 }
    await supabase.from('usage_limits').insert(insert)
    return Response.json({ success: true, count: 1 })
  }
}
