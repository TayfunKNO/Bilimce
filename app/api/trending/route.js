let cache = null
let cacheTime = null
const CACHE_DURATION = 3600 * 1000

export async function GET() {
  try {
    if (cache && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
      return Response.json({ trending: cache }, {
        headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' }
      })
    }

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
        const res = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(topic)}&mindate=${dateStr}&datetype=pdat&retmode=json&retmax=1`, {
          next: { revalidate: 3600 }
        })
        const data = await res.json()
        const count = parseInt(data.esearchresult?.count || 0)
        return { topic, query: topic, count }
      } catch {
        return { topic, query: topic, count: 0 }
      }
    }))

    results.sort((a, b) => b.count - a.count)
    const trending = results.slice(0, 3)
    cache = trending
    cacheTime = Date.now()

    return Response.json({ trending }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' }
    })
  } catch (err) {
    return Response.json({ trending: [] }, { status: 500 })
  }
}
