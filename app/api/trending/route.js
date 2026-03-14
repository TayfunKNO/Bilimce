export async function GET() {
  try {
    const topics = [
      'artificial intelligence medicine',
      'cancer immunotherapy',
      'COVID-19',
      'alzheimer treatment',
      'CRISPR gene editing',
      'microbiome health',
      'mental health depression',
      'diabetes obesity',
    ]

    const today = new Date()
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const dateStr = lastWeek.toISOString().split('T')[0].replace(/-/g, '/')

    const results = await Promise.all(topics.map(async (topic) => {
      try {
        const res = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(topic)}&mindate=${dateStr}&datetype=pdat&retmode=json&retmax=1`)
        const data = await res.json()
        const count = parseInt(data.esearchresult?.count || 0)
        return { topic, count }
      } catch {
        return { topic, count: 0 }
      }
    }))

    results.sort((a, b) => b.count - a.count)
    return Response.json({ trending: results.slice(0, 6) })
  } catch (err) {
    return Response.json({ trending: [] }, { status: 500 })
  }
}
