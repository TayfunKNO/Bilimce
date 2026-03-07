export async function POST(request) {
  try {
    const { title, abstract } = await request.json()

    const translateText = async (text) => {
      const res = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: 'tr',
          format: 'text',
          api_key: ''
        }),
      })
      const data = await res.json()
      return data.translatedText || null
    }

    const title_tr = await translateText(title)
    const abstract_tr = await translateText(abstract || '')

    return Response.json({ title_tr, abstract_tr })
  } catch (error) {
    return Response.json({ title_tr: null, abstract_tr: error.message }, { status: 500 })
  }
}
