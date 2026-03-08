export async function POST(request) {
  try {
    const { title, abstract } = await request.json()

    const translateText = async (text) => {
      if (!text) return null
      const encoded = encodeURIComponent(text)
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encoded}&langpair=en|tr`)
      const data = await res.json()
      return data.responseData?.translatedText || null
    }

    const title_tr = await translateText(title)
    const abstract_tr = await translateText(abstract || '')

    return Response.json({ title_tr, abstract_tr })
  } catch (error) {
    return Response.json({ title_tr: null, abstract_tr: error.message }, { status: 500 })
  }
}
