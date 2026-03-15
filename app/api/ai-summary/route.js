export const maxDuration = 30

export async function POST(request) {
  try {
    const { abstract } = await request.json()
    if (!abstract || abstract.length < 100) return Response.json({ summary: null })

    const GEMINI_KEY = 'AIzaSyCcGlFkV4ixx3xnWCRp3MaWJ4mo1s9ICU8'
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Aşağıdaki bilimsel makale özetini Türkçe olarak 3 bölümde özetle. Her bölüm 2-3 cümle olsun, detaylı ve anlaşılır yaz.

Format:
🎯 ANA AMAÇ: [Araştırmanın amacı ve kapsamı]

🔬 BULGULAR: [Önemli bulgular ve sonuçlar]

✅ SONUÇ: [Klinik önemi ve çıkarımlar]

Makale özeti:
${abstract.slice(0, 4000)}

Sadece 3 bölümü yaz.`
            }]
          }],
          generationConfig: { maxOutputTokens: 800, temperature: 0.3 }
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
