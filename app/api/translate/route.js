export async function POST(request) {
  try {
    const { title, abstract, titles } = await request.json()

    const translateText = async (text) => {
      if (!text) return null
      try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=tr&dt=t&q=${encodeURIComponent(text)}`
        const res = await fetch(url)
        const data = await res.json()
        return data[0]?.map(t => t[0]).filter(Boolean).join('') || null
      } catch (e) {
        return null
      }
    }

    if (titles && Array.isArray(titles)) {
      const results = []
      for (let i = 0; i < titles.length; i += 10) {
        const chunk = titles.slice(i, i + 10)
        const translated = await Promise.all(chunk.map(t => translateText(t)))
        results.push(...translated)
      }
      return Response.json({ titles_tr: results })
    }

    const title_tr = await translateText(title)

    let abstract_tr = null
    if (abstract) {
      // Bölümleri ayır ve her birini ayrı çevir
      const sections = abstract.split('\n\n').filter(Boolean)
      if (sections.length > 1) {
        const translated = []
        for (const section of sections) {
          const t = await translateText(section.slice(0, 4000))
          translated.push(t || section)
        }
        abstract_tr = translated.join('\n\n')
      } else {
        const chunks = []
        for (let i = 0; i < abstract.length; i += 4000) {
          chunks.push(abstract.slice(i, i + 4000))
        }
        const translated = []
        for (const chunk of chunks) {
          const t = await translateText(chunk)
          translated.push(t)
        }
        abstract_tr = translated.filter(Boolean).join(' ')
      }
    }

    return Response.json({ title_tr, abstract_tr })
  } catch (error) {
    return Response.json({ title_tr: null, abstract_tr: null }, { status: 500 })
  }
}
