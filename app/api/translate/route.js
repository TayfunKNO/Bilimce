export async function POST(request) {
  try {
    const { title, abstract } = await request.json()

    const prompt = `Aşağıdaki bilimsel makaleyi Türkçeye çevir. Sadece JSON formatında yanıt ver, başka hiçbir şey yazma.

Başlık (İngilizce): ${title}
Özet (İngilizce): ${abstract || 'Özet yok'}

Şu JSON formatında yanıt ver:
{"title_tr": "türkçe başlık", "abstract_tr": "türkçe özet"}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const text = data.content?.[0]?.text || '{}'
    const clean = text.replace(/```json|```/g, '').trim()
    const result = JSON.parse(clean)

    return Response.json(result)
  } catch (error) {
    console.error('Çeviri API hatası:', error)
    return Response.json(
      { title_tr: null, abstract_tr: 'Çeviri şu an kullanılamıyor.' },
      { status: 500 }
    )
  }
}
