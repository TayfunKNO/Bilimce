export async function POST(req) {
  try {
    const { query } = await req.json()
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: `Convert this search query to the best PubMed search terms in English. Return ONLY 2-4 key medical terms separated by spaces, nothing else.

Query: "${query}"

Examples:
"kalp krizi geçiren hastalarda omega 3 kullanımının etkileri" → "myocardial infarction omega-3 fatty acids"
"alzheimer hastalığında beyin hücrelerinin korunması" → "alzheimer disease neuroprotection"
"tip 2 diyabette insülin direnci tedavisi" → "type 2 diabetes insulin resistance treatment"
"depresyon için en etkili ilaçlar" → "depression antidepressant treatment efficacy"

Return only the English terms:`
        }]
      })
    })
    
    const data = await response.json()
    const terms = data.content?.[0]?.text?.trim() || query
    return Response.json({ terms })
  } catch (err) {
    return Response.json({ terms: query })
  }
}
