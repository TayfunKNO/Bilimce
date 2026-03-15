export const maxDuration = 30

export async function POST(request) {
  try {
    const { abstract } = await request.json()
    if (!abstract || abstract.length < 100) return Response.json({ summary: null })

    const GEMINI_KEY = 'AIzaSyCcGlFkV4ixx3xnWCRp3MaWJ4mo1s9ICU8'
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: `3 cümlede Türkçe özetle:\n${abstract.slice(0, 800)}` }] }],
          generationConfig: { maxOutputTokens: 150, temperature: 0.1 }
        })
      }
    )
    clearTimeout(timeout)
    const data = await geminiRes.json()
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || null
    return Response.json({ summary })
  } catch (err) {
    return Response.json({ summary: null })
  }
}
