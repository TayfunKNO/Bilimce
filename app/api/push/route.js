import webpush from 'web-push'

webpush.setVapidDetails(
  'mailto:bilimce@bilimce.vercel.app',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
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
