export async function POST(request) {
  try {
    const { title, abstract } = await request.json()
    const prompt = `Translate to Turkish. Respond only in JSON format with no extra text.
Title: ${title}
Abstract: ${abstract || 'No abstract'}
Respond exactly like this: {"title_tr": "turkish title", "abstract_tr": "turkish abstract"}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',


        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const data = await response.json()
    console.log('API Response:', JSON.stringify(data))
    const text = data.content?.[0]?.text || '{}'
    const clean = text.replace(/```json|```/g, '').trim()
    const result = JSON.parse(clean)
    return Response.json(result)
  } catch (error) {
    console.log('Error:', error.message)
    return Response.json({ title_tr: null, abstract_tr: error.message }, { status: 200 })
  }
}
