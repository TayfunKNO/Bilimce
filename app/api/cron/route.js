import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lypjtxqvusqndqawugxu.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'sb_publishable_rqtzTjZBNww4u56gNNCI4A_OS_ID1Bo'
)

const VAPID_PUBLIC_KEY = 'BEtOdaXxiV3Bl4TNOO42Ir1s1quGBR0QePpK3iHg2b4T5Mvpl6i4qCj15PDD54eJ78j0l8VrONIC2F5WWcThUzo'
const VAPID_PRIVATE_KEY = 'ICcmLZYNQ9OS3mk8BZd73q5Abzw1b6c9AL0synPvunk'

webpush.setVapidDetails(
  'mailto:bilimce@bilimce.vercel.app',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
)

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: subs } = await supabase.from('topic_subscriptions').select('*')
    if (!subs || subs.length === 0) return Response.json({ ok: true })

    const userTopics = {}
    subs.forEach(s => {
      if (!userTopics[s.user_id]) userTopics[s.user_id] = []
      userTopics[s.user_id].push(s.topic)
    })

    for (const userId of Object.keys(userTopics)) {
      const { data: pushSub } = await supabase
        .from('push_subscriptions')
        .select('subscription')
        .eq('user_id', userId)
        .single()

      if (!pushSub) continue

      const topics = userTopics[userId]
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const dateStr = yesterday.toISOString().split('T')[0].replace(/-/g, '/')

      for (const topic of topics) {
        const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(topic)}&mindate=${dateStr}&maxdate=${dateStr}&retmode=json`
        const res = await fetch(url)
        const data = await res.json()
        const count = data.esearchresult?.count || 0

        if (parseInt(count) > 0) {
          await webpush.sendNotification(
            pushSub.subscription,
            JSON.stringify({
              title: `BİLİMCE — ${topic}`,
              body: `Bugün "${topic}" hakkında ${count} yeni araştırma yayınlandı!`,
            })
          )
        }
      }
    }

    return Response.json({ ok: true })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
