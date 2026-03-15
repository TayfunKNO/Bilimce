export const maxDuration = 30

export async function POST(request) {
  try {
    const { abstract } = await request.json()
    if (!abstract || abstract.length < 100) return Response.json({ summary: null })

    const GEMINI_KEY = 'AIzaSyCcGlFkV4ixx3xnWCRp3MaWJ4mo1s9ICU8'
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Bilimsel makale özetini Türkçe olarak 3 bölümde özetle. Her bölüm 2-3 cümle olsun.

🎯 ANA AMAÇ: [amaç]

🔬 BULGULAR: [bulgular]

✅ SONUÇ: [sonuç]

Özet:
${abstract.slice(0, 2000)}`
            }]
          }],
          generationConfig: { maxOutputTokens: 400, temperature: 0.1 }
        })
      }
    )
    const data = await geminiRes.json()
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || null
    return Response.json({ summary })
  } catch (err) {
    console.error('AI summary error:', err)
    return Response.json({ summary: null })
  }
}
