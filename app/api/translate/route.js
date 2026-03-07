export async function POST(request) {
  const key = process.env.ANTHROPIC_API_KEY
  
  if (!key) {
    return Response.json({ title_tr: 'API KEY YOK', abstract_tr: 'ANTHROPIC_API_KEY tanimlanmamis' })
  }

  try {
    const { title, abstract } = await request.json()
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 1000,
        messages: [{ role: 'user', content: `Translate this title to Turkish, respond with just JSON: {"title_tr": "...", "abstract_tr": "..."}\nTitle: ${title}\nAbstract: ${abstract || 'none'}` }],
      }),
    })
    
    const data = await response.json()
    
    if (data.error) {
      return Response.json({ title_tr: 'HATA: ' + data.error.type, abstract_tr: data.error.message })
    }
    
    const text = data.content?.[0]?.text || '{}'
    const clean = text.replace(/```json|```/g, '').trim()
    const result = JSON.parse(clean)
    return Response.json(result)
  } catch (error) {
    return Response.json({ title_tr: 'CATCH HATA', abstract_tr: error.message })
  }
}
