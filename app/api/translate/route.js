export async function POST(request) {
  try {
    const { title, abstract } = await request.json()

    const translateText = async (text) => {
      if (!text) return null
      const encoded = encodeURIComponent(text.slice(0, 490))
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encoded}&langpair=en|tr`)
      const data = await res.json()
      return data.responseData?.translatedText || null
    }

    const title_tr = await translateText(title)

    let abstract_tr = null
    if (abstract) {
      const chunks = []
      for (let i = 0; i < abstract.length; i += 480) {
        chunks.push(abstract.slice(i, i + 480))
      }
      const translated = []
      for (const chunk of chunks) {
        const t = await translateText(chunk)
        translated.push(t)
        await new Promise(r => setTimeout(r, 500))
      }
      abstract_tr = translated.filter(Boolean).join(' ')
    }

    return Response.json({ title_tr, abstract_tr })
  } catch (error) {
    return Response.json({ title_tr: null, abstract_tr: null }, { status: 500 })
  }
}
