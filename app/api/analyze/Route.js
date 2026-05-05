export async function POST(req) {
  const { title, abstract, lang } = await req.json()
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Analyze this scientific research abstract and respond ONLY in JSON format with no markdown:
{"positive":["finding 1"],"negative":["limitation 1"],"neutral":["context 1"],"consensus":"one sentence","confidence":"high/medium/low"}

Translate ALL findings to ${lang}.

Title: ${title}
Abstract: ${abstract}`
      }]
    })
  })
  const data = await response.json()
  const text = data.content?.[0]?.text || '{}'
  const clean = text.replace(/```json|```/g, '').trim()
  return Response.json(JSON.parse(clean))
}

