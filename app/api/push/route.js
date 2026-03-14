import webpush from 'web-push'

const VAPID_PUBLIC_KEY = 'BEtOdaXxiV3Bl4TNOO42Ir1s1quGBR0QePpK3iHg2b4T5Mvpl6i4qCj15PDD54eJ78j0l8VrONIC2F5WWcThUzo'
const VAPID_PRIVATE_KEY = 'ICcmLZYNQ9OS3mk8BZd73q5Abzw1b6c9AL0synPvunk'

webpush.setVapidDetails(
  'mailto:bilimce@bilimce.vercel.app',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
)

export async function POST(request) {
  try {
    const { subscription, title, body } = await request.json()
    await webpush.sendNotification(
      subscription,
      JSON.stringify({ title, body })
    )
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
