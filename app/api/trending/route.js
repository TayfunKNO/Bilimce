export async function GET() {
  try {
    const topics = [
      { en: 'artificial intelligence medicine', tr: 'Yapay Zeka ve Tıp' },
      { en: 'cancer immunotherapy', tr: 'Kanser İmmünoterapisi' },
      { en: 'COVID-19', tr: 'COVID-19' },
      { en: 'alzheimer treatment', tr: 'Alzheimer Tedavisi' },
      { en: 'CRISPR gene editing', tr: 'CRISPR Gen Düzenleme' },
      { en: 'microbiome health', tr: 'Mikrobiyom ve Sağlık' },
      { en: 'mental health depression', tr: 'Ruh Sağlığı ve Depresyon' },
      { en: 'diabetes obesity', tr: 'Diyabet ve Obezite' },
    ]

    const today = new Date()
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const dateStr = lastWeek.toISOString().split('T')[0].replace(/-/g, '/')

    const results = await Promise.all(topics.map(async (topic) => {
      try {
        const res = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(topic.en)}&mindate=${dateStr}&datetype=pdat&retmode=json&retmax=1`)
        const data = await res.json()
        const count = parseInt(data.esearchresult?.count || 0)
        return { topic: topic.tr, query: topic.en, count }
      } catch {
        return { topic: topic.tr, query: topic.en, count: 0 }
      }
    }))

    results.sort((a, b) => b.count - a.count)
    return Response.json({ trending: results.slice(0, 6) })
  } catch (err) {
    return Response.json({ trending: [] }, { status: 500 })
  }
}
