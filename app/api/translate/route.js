export async function POST(request) {
  try {
    const { title, abstract } = await request.json()
    if (!abstract && !title) return Response.json({ title_tr: title, abstract_tr: null })

    // Google Translate ile çevir
    const translateText = async (text, targetLang = 'tr') => {
      if (!text) return null
      try {
        const chunks = []
        const maxLen = 4500
        for (let i = 0; i < text.length; i += maxLen) chunks.push(text.slice(i, i + maxLen))
        const results = await Promise.all(chunks.map(async chunk => {
          const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(chunk)}`
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

    // AI ile özet oluştur
    let ai_summary = null
    if (abstract && abstract.length > 200) {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{
              role: 'user',
              content: `Aşağıdaki bilimsel makale özetini Türkçe olarak 3 kısa bölümde özetle. Her bölüm 1-2 cümle olsun.

Format:
🎯 ANA AMAÇ: [Araştırmanın amacı]
🔬 BULGULAR: [Önemli bulgular]  
✅ SONUÇ: [Klinik önemi/sonuç]

Makale özeti:
${abstract.slice(0, 3000)}

Sadece 3 bölümü yaz, başka açıklama ekleme.`
            }]
          })
        })
        const data = await response.json()
        ai_summary = data.content?.[0]?.text || null
      } catch { ai_summary = null }
    }

    return Response.json({ title_tr, abstract_tr, ai_summary })
  } catch (err) {
    console.error(err)
    return Response.json({ title_tr: null, abstract_tr: null, ai_summary: null })
  }
}
