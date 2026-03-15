export async function POST(request) {
  try {
    const { title, abstract } = await request.json()
    if (!abstract && !title) return Response.json({ title_tr: title, abstract_tr: null })

    const translateText = async (text) => {
      if (!text) return null
      try {
        const chunks = []
        const maxLen = 4500
        for (let i = 0; i < text.length; i += maxLen) chunks.push(text.slice(i, i + maxLen))
        const results = await Promise.all(chunks.map(async chunk => {
          const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=tr&dt=t&q=${encodeURIComponent(chunk)}`
          const res = await fetch(url)
          const data = await res.json()
          return data[0]?.map(t => t[0]).filter(Boolean).join('') || chunk
        }))
        return results.join(' ')
      } catch { return text }
    }

    const [title_tr, abstract_tr] = await Promise.all([
      translateText(title),
      translateText(abstract),
    ])

    let ai_summary = null
    if (abstract && abstract.length > 200) {
      try {
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

Format (tam olarak bu şekilde):
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
        const geminiData = await geminiRes.json()
        ai_summary = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || null
      } catch (e) {
        console.error('Gemini error:', e)
        ai_summary = null
      }
    }

    return Response.json({ title_tr, abstract_tr, ai_summary })
  } catch (err) {
    console.error(err)
    return Response.json({ title_tr: null, abstract_tr: null, ai_summary: null })
  }
}
